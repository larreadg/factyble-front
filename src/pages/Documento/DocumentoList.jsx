import { Card, CardBody } from '@nextui-org/react'
import CustomBreadcrumbs from '../../components/CustomBreadcrumbs'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react'
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
import { cancelarDocumentoValidationSchema, reenviarEmailValidationSchema } from '../../formValidations/documentoList'
import toast, { Toaster } from 'react-hot-toast'
import { Formik } from 'formik'
import { NoSymbolIcon } from '../../icons/NoSymbolIcon'
import EstadoChip from '../../components/EstadoChip'
dayjs.extend(utc)

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
                        <a href={`${apiUrl}/public/${item.factura_uuid}.pdf`} target='_blank' className='text-xs text-primary cursor-pointer hover:underline'>
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

      <Modal isOpen={isOpenModalInfo} onOpenChange={onOpenChangeModalInfo} isDismissable={false} isKeyboardDismissDisabled={true}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1 text-default-900'>Doc. Nro: {modalInfoItem.numero_factura}</ModalHeader>
              <ModalBody>
                <section className='flex flex-col gap-2 font-poppins'>
                  <section className='flex items-center gap-2'>
                    <EstadoChip estado={modalInfoItem.sifen_estado} />
                  </section>

                  {['Rechazado', 'Cancelado'].includes(modalInfoItem.sifen_estado) && (
                    <p className='text-xs text-danger'>{modalInfoItem.sifen_estado_mensaje}</p>
                  )}
                  <section className='flex items-center gap-2'>
                    <section className='w-1/4 text-xs text-default-900 font-bold'>CDC</section>
                    <section className='w-3/4 text-xs text-default-900'>{modalInfoItem.cdc}</section>
                  </section>
                  <section className='flex items-center gap-2'>
                    <section className='w-1/4 text-xs text-default-900 font-bold'>KUDE</section>
                    <a className='text-xs text-primary underline truncate w-3/4' href={`${apiUrl}/public/${modalInfoItem.factura_uuid}.pdf`} target='_blank'>{`${apiUrl}/public/${modalInfoItem.factura_uuid}.pdf`}</a>
                  </section>
                  <section className='flex items-center gap-2'>
                    <section className='w-1/4 text-xs text-default-900 font-bold'>XML</section>
                    <a className='text-xs text-primary underline truncate w-3/4' href={modalInfoItem.xml} target='_blank'>{modalInfoItem.xml}</a>
                  </section>
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
      <Modal isOpen={isOpenModalReenviar} onOpenChange={onOpenChangeModalReenviar} isDismissable={false} isKeyboardDismissDisabled={true}>
        <ModalContent>
          {(onClose) => (
            <>
              <Formik
                initialValues={{ email: '' }}
                validationSchema={reenviarEmailValidationSchema}
                onSubmit={(values, { setSubmitting }) => {
                  axiosInstance.post(`${apiUrl}/factura/reenviar`, {
                    email: values.email,
                    facturaId: modalReenviarItem.id
                  })
                    .then(() => {
                      toast.success('Documento reenviado', {
                        style: toastStyle
                      });
                      setSubmitting(false);
                      onClose(); // Cerrar modal después de enviar el formulario con éxito
                    })
                    .catch(error => {
                      toast.error('Error al reenviar documento', {
                        style: toastStyle
                      });
                      console.log(error);
                      setSubmitting(false);
                    });
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                  isValid
                }) => (
                  <>
                    <ModalHeader className='flex flex-col gap-1 text-default-900'>
                      Reenviar Doc. Nro: {modalReenviarItem.numero_factura}
                    </ModalHeader>
                    <ModalBody>
                      <section className='flex flex-col gap-2 font-poppins'>
                        <form className='space-y-4 flex flex-col gap-2'>
                          <section>
                            <Input
                              key='outside'
                              label='Email'
                              labelPlacement='outside'
                              type='email'
                              name='email'
                              variant='bordered'
                              isInvalid={errors && errors.email && touched.email}
                              color={errors && errors.email && touched.email ? 'danger' : ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.email}
                              errorMessage={errors.email}
                              placeholder='Email'
                              startContent={
                                <MailIcon className='text-2xl text-default-400 pointer-events-none flex-shrink-0' />
                              }
                            />
                          </section>
                        </form>
                      </section>
                    </ModalBody>
                    <ModalFooter>
                      <Button color='danger' variant='light' onPress={onClose}>
                        Cerrar
                      </Button>
                      <Button
                        color='primary'
                        isDisabled={!isValid}
                        type='submit'
                        isLoading={isSubmitting}
                        onPress={handleSubmit}
                      >
                        Reenviar documento
                      </Button>
                    </ModalFooter>
                    <Toaster />
                  </>
                )}
              </Formik>

            </>
          )}
        </ModalContent>
      </Modal >
      <Modal isOpen={isOpenModalCancelar} onOpenChange={onOpenChangeModalCancelar} isDismissable={false} isKeyboardDismissDisabled={true}>
        <ModalContent>
          {(onClose) => (
            <>
              <Formik
                initialValues={{ motivo: '' }}
                validationSchema={cancelarDocumentoValidationSchema}
                onSubmit={(values, { setSubmitting }) => {
                  axiosInstance.post(`${apiUrl}/factura/cancelar`, {
                    motivo: values.motivo,
                    facturaId: modalCancelarItem.id
                  })
                    .then(() => {
                      toast.success('El documento fue cancelado', {
                        style: toastStyle
                      });
                      setSubmitting(false);
                      onClose()
                      setReloadPage(prev => !prev)
                    })
                    .catch(error => {
                      let msg = 'No se puede cancelar el documento'
                      const { response } = error

                      if (response.data && response.data.message) {
                        msg = response.data.message
                      }
                      toast.error(msg, {
                        style: toastStyle
                      });
                      setSubmitting(false)
                    });
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                  isValid
                }) => (
                  <>
                    <ModalHeader className='flex flex-col gap-1 text-default-900'>
                      Cancelación Doc. Nro: {modalCancelarItem.numero_factura}
                    </ModalHeader>
                    <ModalBody>
                      <section className='flex flex-col gap-2 font-poppins'>
                        <section className='flex items-center gap-2'>
                          <EstadoChip estado={modalCancelarItem.sifen_estado} />
                        </section>
                        <section className='flex items-center gap-2'>
                          <section className='w-1/4 text-xs text-default-900 font-bold'>CDC</section>
                          <section className='w-3/4 text-xs text-default-900'>{modalCancelarItem.cdc}</section>
                        </section>
                        <section className='flex items-center gap-2'>
                          <section className='w-1/4 text-xs text-default-900 font-bold'>KUDE</section>
                          <a className='text-xs text-primary underline truncate w-3/4' href={`${apiUrl}/public/${modalCancelarItem.factura_uuid}.pdf`} target='_blank'>{`${apiUrl}/public/${modalCancelarItem.factura_uuid}.pdf`}</a>
                        </section>
                        <section className='flex items-center gap-2'>
                          <section className='w-1/4 text-xs text-default-900 font-bold'>XML</section>
                          <a className='text-xs text-primary underline truncate w-3/4' href={modalCancelarItem.xml} target='_blank'>{modalCancelarItem.xml}</a>
                        </section>
                        <p className='my-2 text-center font-poppins text-danger'>¿Estás seguro? Esta acción no puede deshacerse.</p>
                      </section>
                      <section className='flex flex-col gap-2'>
                        <form className='space-y-4 flex flex-col gap-2'>
                          <section>
                            <Input
                              key='outside'
                              label='Motivo'
                              labelPlacement='outside'
                              type='text'
                              name='motivo'
                              variant='bordered'
                              isInvalid={errors && errors.motivo && touched.motivo}
                              color={errors && errors.motivo && touched.motivo ? 'danger' : ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.motivo}
                              errorMessage={errors.motivo}
                              placeholder='Motivo de cancelación...'
                            />
                          </section>
                        </form>
                      </section>
                    </ModalBody>
                    <ModalFooter>
                      <Button color='danger' variant='light' onPress={onClose}>
                        Cerrar
                      </Button>
                      <Button
                        color='danger'
                        isDisabled={!isValid}
                        type='submit'
                        isLoading={isSubmitting}
                        onPress={handleSubmit}
                      >
                        Sí, cancelar documento
                      </Button>
                    </ModalFooter>
                    <Toaster />
                  </>
                )}
              </Formik>

            </>
          )}
        </ModalContent>
      </Modal >
    </main >
  )
}

export default DocumentoList
