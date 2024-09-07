import { Card, CardBody } from '@nextui-org/react'
import CustomBreadcrumbs from '../../components/CustomBreadcrumbs'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react'
import { useDisclosure } from '@nextui-org/react'
import { Pagination } from '@nextui-org/pagination'
import { apiUrl, itemsPorPagina, toastStyle } from '../../config/constants'
import { useEffect, useState } from 'react'
import axiosInstance from '../../services/axiosInstance'
import { SearchIcon } from '../../icons/SearchIcon'
import { UserIcon } from '../../icons/UserIcon'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { LinkIcon } from '../../icons/LinkIcon'
import { EyeFilledIcon } from '../../icons/EyeFilledIcon'
import { Tooltip } from '@nextui-org/tooltip'
import { MailIcon } from '../../icons/MailIcon'
import { NoSymbolIcon } from '../../icons/NoSymbolIcon'
import EstadoChip from '../../components/EstadoChip'
import FacturaListModalInfo from './FacturaListModalInfo'
import FacturaListModalReenviar from './FacturaListModalReenviar'
import FacturaListModalCancelar from './FacturaListModalCancelar'
import toast, { Toaster } from 'react-hot-toast'
import { CopyIcon } from '../../icons/CopyIcon'
import { copyToClipboard } from '../../utils/utils'

dayjs.extend(utc)

function FacturaList() {

  const breadcrumbs = [
    { label: 'Inicio', link: '/' },
    { label: 'Facturas emitidas', link: null }
  ]

  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [filter, setFilter] = useState('')
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [itemsPerPage, setItemsPerPage] = useState(itemsPorPagina)
  const [reloadPage, setReloadPage] = useState(false)
  const { isOpen: isOpenModalInfo, onOpen: onOpenModalInfo, onOpenChange: onOpenChangeModalInfo } = useDisclosure()
  const { isOpen: isOpenModalReenviar, onOpen: onOpenModalReenviar, onOpenChange: onOpenChangeModalReenviar } = useDisclosure()
  const { isOpen: isOpenModalCancelar, onOpen: onOpenModalCancelar, onOpenChange: onOpenChangeModalCancelar } = useDisclosure()
  const [modalInfoItem, setModalInfoItem] = useState(null)
  const [modalReenviarItem, setModalReenviarItem] = useState(null)
  const [modalCancelarItem, setModalCancelarItem] = useState(null)

  useEffect(() => {
    setPage(1)
  }, [filter, itemsPerPage])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await axiosInstance.get(`${apiUrl}/factura?page=${page}&itemsPerPage=${itemsPerPage}&filter=${filter}`)
        const { data: apiResult } = response

        setPages(apiResult.data.totalItems ? Math.ceil(apiResult.data.totalItems / itemsPerPage) : 0)
        console.log(apiResult.data.items)
        setData(apiResult.data.items)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [page, filter, itemsPerPage, reloadPage])

  return (
    <main className='w-full lg:w-3/4 lg:mx-auto'>
      <section className='grid grid-cols-1'>
        <CustomBreadcrumbs items={breadcrumbs} />
      </section>
      <section className='grid grid-col-1'>
        <Card className='p-4'>
          <CardBody>
            <section className='grid grid-cols-1'>
              <Input
                className='mb-4'
                type='text'
                placeholder='Buscar...'
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                clearable
                size='sm'
                startContent={
                  <SearchIcon className='text-default-400 pointer-events-none flex-shrink-0' />
                }
                isClearable
                onClear={() => setFilter('')}
              />
              <Table
                isStriped
                bottomContent={
                  pages > 0 ? (
                    <section className='flex w-full justify-center gap-4'>
                      <Pagination
                        isCompact
                        showControls
                        showShadow
                        page={page}
                        total={pages}
                        onChange={(page) => setPage(page)}
                        size='sm'
                      />
                      <Dropdown size='sm'>
                        <DropdownTrigger>
                          <Button size='sm'>Items por pág. {itemsPerPage}</Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          onAction={(key) => setItemsPerPage(parseInt(key))}
                        >
                          <DropdownItem key='5'>5</DropdownItem>
                          <DropdownItem key='10'>10</DropdownItem>
                          <DropdownItem key='20'>20</DropdownItem>
                          <DropdownItem key='50'>50</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </section>
                  ) : null
                }
              >
                <TableHeader>
                  <TableColumn>Acciones</TableColumn>
                  <TableColumn>Nro. Documento</TableColumn>
                  <TableColumn>Creado el</TableColumn>
                  <TableColumn>Cliente</TableColumn>
                  <TableColumn>Estado</TableColumn>
                </TableHeader>
                <TableBody
                  items={data ?? []}
                  loadingContent={<Spinner />}
                  loadingState={isLoading ? 'loading' : 'idle'}
                >
                  {(item) => (
                    <TableRow>
                      <TableCell>
                        <section className='flex gap-1'>
                          <Tooltip content="Ver detalles" key='info' aria-describedby='Ver detalles'>
                            <Button size="sm" aria-label='Ver detalles' isIconOnly color='primary' onClick={() => {
                              setModalInfoItem(item)
                              onOpenModalInfo()
                            }}>
                              <EyeFilledIcon />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Copiar CDC" key='info-cdc' aria-describedby='Copiar CDC'>
                            <Button size="sm" aria-label='Ver detalles' isIconOnly color='success' onClick={async() => {
                              const result = await copyToClipboard(item.cdc)
                              if(result) {
                                toast.success('CDC copiado', {
                                  style: toastStyle
                                })
                              }
                            }}>
                              <CopyIcon />
                            </Button>
                          </Tooltip>

                          {item.sifen_estado === 'Aprobado' && (
                            <Tooltip content="Reenviar documento" key='resend-email' aria-describedby='Reenviar documento'>
                              <Button size="sm" aria-label='Reenviar documento' isIconOnly color='secondary' onClick={() => {
                                setModalReenviarItem(item)
                                onOpenModalReenviar()
                              }}>
                                <MailIcon />
                              </Button>
                            </Tooltip>
                          )}

                          {dayjs.utc(item.fecha_creacion).add(48, 'hour').isAfter(dayjs.utc()) && item.sifen_estado === 'Aprobado' && (
                            <Tooltip content="Anular documento" key='anular-documento' aria-describedby='Anular documento'>
                              <Button size="sm" aria-label='Anular documento' isIconOnly color='danger' onClick={() => {
                                setModalCancelarItem(item)
                                onOpenModalCancelar()
                              }}>
                                <NoSymbolIcon />
                              </Button>
                            </Tooltip>
                          )}
                        </section>
                      </TableCell>
                      <TableCell>
                        {['Rechazado', 'Cancelado'].includes(item.sifen_estado) && (
                          <p className='text-default-500'>N/A</p>
                        )}
                        {['Pendiente', 'Aprobado'].includes(item.sifen_estado) && (
                          <a href={`${apiUrl}/public/${item.factura_uuid}.pdf`} target='_blank' className='text-xs text-primary cursor-pointer hover:underline'>
                            <section className='flex items-center gap-1'>
                              <LinkIcon />
                              <span>
                                {item.numero_factura}
                              </span>
                            </section>
                          </a>
                        )}
                      </TableCell>
                      <TableCell><p className='text-xs'>{dayjs(item.fecha_creacion).format('DD/MM/YYYY HH:mm:ss')}</p></TableCell>
                      <TableCell>
                        <section className='flex items-center gap-2'>
                          <UserIcon className='text-primary w-6 h-auto' />
                          <section className='flex flex-col gap-1'>
                            <p className='text-primary text-xs'>{item.cliente_empresa.cliente.tipo_identificacion} | {item.cliente_empresa.cliente.ruc ?? item.cliente_empresa.cliente.documento}</p>
                            <p className='text-xs'> {item.cliente_empresa.cliente.razon_social ?? `${item.cliente_empresa.cliente.nombres} ${item.cliente_empresa.cliente.apellidos}`}</p>
                            <a className='text-xs text-primary' href={`mailto:${item.cliente_empresa.cliente.email}`}>{item.cliente_empresa.cliente.email}</a>
                          </section>
                        </section>
                      </TableCell>
                      <TableCell>
                        <section className='flex items-center gap-2'>
                          <EstadoChip estado={item.sifen_estado} />
                        </section>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </section>
          </CardBody>
        </Card>
      </section>

      <FacturaListModalInfo isOpen={isOpenModalInfo} onOpenChange={onOpenChangeModalInfo} item={modalInfoItem}/>
      <FacturaListModalReenviar isOpen={isOpenModalReenviar} onOpenChange={onOpenChangeModalReenviar} item={modalReenviarItem} />
      <FacturaListModalCancelar isOpen={isOpenModalCancelar} onOpenChange={onOpenChangeModalCancelar} item={modalCancelarItem} setReloadPage={setReloadPage}/>
      <Toaster />
    </main >
  )
}

export default FacturaList
