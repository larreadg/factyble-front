import { Card, CardBody } from '@nextui-org/react'
import CustomBreadcrumbs from '../../components/CustomBreadcrumbs'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react'
import { Chip } from '@nextui-org/chip'
import { Pagination } from '@nextui-org/pagination'
import { apiUrl, itemsPorPagina } from '../../config/constants'
import { useEffect, useState } from 'react'
import axiosInstance from '../../services/axiosInstance'
import { SearchIcon } from '../../icons/SearchIcon'
import { UserIcon } from '../../icons/UserIcon'
import { ClockIcon } from '../../icons/ClockIcon'
import dayjs from 'dayjs'
import { CheckIcon } from '../../icons/CheckIcon'
import { CloseIcon } from '../../icons/CloseIcon'
import { LinkIcon } from '../../icons/LinkIcon'
import { EyeFilledIcon } from '../../icons/EyeFilledIcon'
import { Tooltip } from '@nextui-org/tooltip'

function DocumentoList() {

  const breadcrumbs = [
    { label: 'Inicio', link: '/' },
    { label: 'Documentos emitidos', link: null }
  ]

  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [filter, setFilter] = useState('')
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [itemsPerPage, setItemsPerPage] = useState(itemsPorPagina)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [modalInfoItem, setModalInfoItem] = useState(null)

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
  }, [page, filter, itemsPerPage])

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
                aria-label='Example table with client async pagination'
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
                  <TableColumn>Nro. Factura</TableColumn>
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
                        <Tooltip content="Ver detalles">
                          <Button size="sm" isIconOnly color='primary' onClick={() => {
                            setModalInfoItem(item)
                            onOpen()
                          }}>
                            <EyeFilledIcon />
                          </Button>

                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <a href={item.kude} target='_blank' className='text-xs text-primary cursor-pointer hover:underline'>
                          <section className='flex items-center gap-1'>
                            <LinkIcon />
                            <span>
                              {item.numero_factura}
                            </span>
                          </section>
                        </a>
                      </TableCell>
                      <TableCell><p className='text-xs'>{dayjs(item.fecha_creacion).format('DD/MM/YYYY HH:mm:ss')}</p></TableCell>
                      <TableCell>
                        <section className='flex items-center gap-2'>
                          <UserIcon className='text-primary w-6 h-auto' />
                          <section className='flex flex-col gap-1'>
                            <p className='text-primary font-bold text-xs'>{item.cliente_empresa.cliente.tipo_identificacion} | {item.cliente_empresa.cliente.ruc ?? item.cliente_empresa.cliente.documento}</p>
                            <p className='text-sm'> {item.cliente_empresa.cliente.razon_social ?? `${item.cliente_empresa.cliente.nombres} ${item.cliente_empresa.cliente.apellidos}`}</p>
                          </section>
                        </section>
                      </TableCell>
                      <TableCell>
                        <section className='flex items-center gap-2'>
                          {item.sifen_estado === null && (
                            <Chip
                              startContent={<ClockIcon className='size-4' />}
                              variant='solid'
                              color='default'
                              size='sm'
                            >
                              Pendiente
                            </Chip>
                          )}
                          {item.sifen_estado === 'Aprobado' && (
                            <Chip
                              startContent={<CheckIcon className='size-4' />}
                              variant='solid'
                              color='success'
                              size='sm'
                            >
                              Aprobado
                            </Chip>
                          )}
                          {item.sifen_estado === 'Rechazado' && (
                            <Chip
                              startContent={<CloseIcon className='size-4' />}
                              variant='solid'
                              color='danger'
                              size='sm'
                            >
                              Rechazado
                            </Chip>
                          )}
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

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1 text-default-900'>Doc. Nro: {modalInfoItem.numero_factura}</ModalHeader>
              <ModalBody>
                <section className='flex flex-col gap-2'>
                  <section className='flex items-center gap-2'>
                    {modalInfoItem.sifen_estado === null && (
                      <Chip
                        startContent={<ClockIcon className='size-4' />}
                        variant='solid'
                        color='default'
                        size='sm'
                      >
                        Pendiente
                      </Chip>
                    )}
                    {modalInfoItem.sifen_estado === 'Aprobado' && (
                      <Chip
                        startContent={<CheckIcon className='size-4' />}
                        variant='solid'
                        color='success'
                        size='sm'
                      >
                        Aprobado
                      </Chip>
                    )}
                    {modalInfoItem.sifen_estado === 'Rechazado' && (
                      <Chip
                        startContent={<CloseIcon className='size-4' />}
                        variant='solid'
                        color='danger'
                        size='sm'
                      >
                        Rechazado
                      </Chip>
                    )}
                  </section>

                  {modalInfoItem.sifen_estado === 'Rechazado' ? (
                    <>
                      <p className='text-xs text-danger'>{modalInfoItem.sifen_estado_mensaje}</p>
                    </>
                  ) : (
                    <>
                      <section className='flex items-center gap-2'>
                        <section className='w-1/4 text-xs text-default-900 font-bold'>CDC</section>
                        <section className='w-3/4 text-xs text-default-900'>{modalInfoItem.cdc}</section>
                      </section>
                      <section className='flex items-center gap-2'>
                        <section className='w-1/4 text-xs text-default-900 font-bold'>KUDE</section>
                        <a className='text-xs text-primary underline truncate w-3/4' href={modalInfoItem.kude} target='_blank'>{modalInfoItem.kude}</a>
                      </section>
                      <section className='flex items-center gap-2'>
                        <section className='w-1/4 text-xs text-default-900 font-bold'>XML</section>
                        <a className='text-xs text-primary underline truncate w-3/4' href={modalInfoItem.xml} target='_blank'>{modalInfoItem.xml}</a>
                      </section>
                    </>
                  )}
                </section>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  )
}

export default DocumentoList
