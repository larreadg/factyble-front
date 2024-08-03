import { Card, CardBody } from '@nextui-org/react'
import CustomBreadcrumbs from '../../components/CustomBreadcrumbs'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react'
import { Pagination } from "@nextui-org/pagination"
import { apiUrl, itemsPorPagina } from '../../config/constants'
import { useEffect, useState } from 'react'
import axiosInstance from '../../services/axiosInstance'
import { SearchIcon } from '../../icons/SearchIcon'
import { UserIcon } from '../../icons/UserIcon'
import { ClockIcon } from '../../icons/ClockIcon'
import dayjs from 'dayjs'
import { CheckIcon } from '../../icons/CheckIcon'
import { CloseIcon } from '../../icons/CloseIcon'

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
            <section className="grid grid-cols-1">
              <Input
                className="mb-4"
                type="text"
                placeholder="Buscar..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                clearable
                size="sm"
                startContent={
                  <SearchIcon className="text-default-400 pointer-events-none flex-shrink-0" />
                }
                isClearable
                onClear={() => setFilter("")}
              />
              <Table
                aria-label="Example table with client async pagination"
                bottomContent={
                  pages > 0 ? (
                    <section className="flex w-full justify-center gap-4">
                      <Pagination
                        isCompact
                        showControls
                        showShadow
                        page={page}
                        total={pages}
                        onChange={(page) => setPage(page)}
                        size="sm"
                      />
                      <Dropdown size="sm">
                        <DropdownTrigger>
                          <Button size="sm">Items por pág. {itemsPerPage}</Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          onAction={(key) => setItemsPerPage(parseInt(key))}
                        >
                          <DropdownItem key="5">5</DropdownItem>
                          <DropdownItem key="10">10</DropdownItem>
                          <DropdownItem key="20">20</DropdownItem>
                          <DropdownItem key="50">50</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </section>
                  ) : null
                }
              >
                <TableHeader>
                  <TableColumn>Nro. Factura</TableColumn>
                  <TableColumn>Creado el</TableColumn>
                  <TableColumn>Cliente</TableColumn>
                  <TableColumn>Estado</TableColumn>
                </TableHeader>
                <TableBody
                  items={data ?? []}
                  loadingContent={<Spinner />}
                  loadingState={isLoading ? "loading" : "idle"}
                >
                  {(item) => (
                    <TableRow key='numero_factura'>
                      <TableCell><p className='text-xs'>{item.numero_factura}</p></TableCell>
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
                            <>
                              <ClockIcon className='text-primary w-6 h-auto' />
                              <p className='text-xs'>Pendiente</p>
                            </>
                          )}
                          {item.sifen_estado === 'Aprobado' && (
                            <>
                              <CheckIcon className='w-6 h-auto' />
                              <p className='text-xs'>Aprobado</p>
                            </>
                          )}
                          {item.sifen_estado === 'Rechazado' && (
                            <>
                              <CloseIcon className='text-primary w-6 h-auto' />
                              <p className='text-xs'>Rechazado</p>
                            </>
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
    </main>
  )
}

export default FacturaList
