import { useEffect, useState } from 'react'
import { Button } from '@nextui-org/button'
import { Divider } from '@nextui-org/divider'
import { Card, CardBody } from '@nextui-org/react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react'
import { Select, SelectItem } from '@nextui-org/select'
import { Input } from '@nextui-org/input'
import { Formik, FieldArray } from 'formik'
import { apiUrl, tasas, toastStyle } from '../../config/constants'
import { calcularImpuesto, calcularPrecio, formatNumber } from '../../utils/facturacion'
import { PlusIcon } from '../../icons/PlusIcon'
import { MinusIcon } from '../../icons/MinusIcon'
import { jwtDecode } from 'jwt-decode'
import { notaCreditoCreateValidationSchema } from '../../formValidations/notaCreditoCreate'
import toast, { Toaster } from 'react-hot-toast'
import CustomBreadcrumbs from '../../components/CustomBreadcrumbs'
import axiosInstance from '../../services/axiosInstance'
import Loader from '../../components/Loader'
import NotaCreditoInputTotalGeneral from './NotaCreditoCreateInputTotalGeneral'
import NotaCreditoCreateInputTotalGeneralIva from './NotaCreditoCreateInputTotalGeneralIva'
import NotaCreditoCreateSelectCajaEstablecimiento from './NotaCreditoCreateSelectCajaEstablecimiento'

function NotaCreditoCreate() {
  const [user, setUser] = useState(null)
  const [list, setList] = useState([])
  const { isOpen: isOpenConfirmarCreacion, onOpen: onOpenConfirmarCreacion, onOpenChange: onOpenChangeConfirmarCreacion } = useDisclosure()
  const breadcrumbs = [
    { label: 'Inicio', link: '/' },
    { label: 'Emitir nota de crédito', link: null }
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`${apiUrl}/usuario/establecimientos-cajas`)
        const { data: apiResult } = response

        const dataList = apiResult.data
        setList(dataList)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUser(decoded)
      } catch (error) {
        console.error('Error decoding token:', error)
      }
    }
  }, [])

  return (
    <main className='w-full lg:w-3/4 lg:mx-auto'>
      <section className='grid grid-cols-1'>
        <CustomBreadcrumbs items={breadcrumbs} />
      </section>
      <section className='grid grid-col-1'>
        <Card className='p-4'>
          <CardBody>
            <Formik
              initialValues={{
                cdc: '',
                totalIva: 0,
                total: 0,
                items: [
                  { cantidad: 1, precioUnitario: 0, tasa: '10%', impuesto: 0, total: 0, descripcion: '' }
                ],
                establecimiento: '',
                caja: ''
              }}
              validationSchema={notaCreditoCreateValidationSchema}
              onSubmit={(values, { setSubmitting, resetForm }) => {

                if (values.situacionTributaria === 'NO_CONTRIBUYENTE') {
                  values.razonSocial = `${values.apellidos}, ${values.nombres}`
                  values.ruc = values.identificacion
                }
                axiosInstance.post(`${apiUrl}/factura`, { ...values })
                  .then(() => {
                    toast.success('Factura emitida', { style: toastStyle, duration: 5000 })
                    setSubmitting(false)
                    resetForm()
                  })
                  .catch((error) => {
                    toast.error(`Error al crear factura ${error.message ?? ''}`, { style: toastStyle, duration: 5000 })
                    setSubmitting(false)
                  })
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                isSubmitting,
                isValid
              }) => (
                <form onSubmit={handleSubmit}>
                  <section className='grid grid-cols-1 gap-4'>
                    {user && (
                      <>
                        <section>
                          <h1 className='font-bold text-secondary'>EMPRESA</h1>
                          <Divider className="mt-4" />
                        </section>
                        <section>
                          <p className='text-primary font-bold'>{user.empresaRuc}</p>
                          <p>{user.empresaNombre}</p>
                        </section>
                      </>
                    )}
                    <section>
                      <h1 className='font-bold text-secondary'>DOCUMENTO EMITIDO</h1>
                      <Divider className="mt-4" />
                    </section>
                    <section>
                      <Input
                        label='CDC'
                        labelPlacement='outside'
                        type='text'
                        name='cdc'
                        variant='bordered'
                        value={values.cdc}
                        isInvalid={errors.cdc && touched.cdc}
                        color={errors.cdc && touched.cdc ? 'danger' : ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errorMessage={errors.cdc && touched.cdc ? errors.cdc : ''}
                        placeholder='Ingrese el CDC...'
                      />
                    </section>
                    <section>
                      <h1 className='font-bold text-secondary'>PUNTO DE EMISIÓN</h1>
                      <Divider className="mt-4" />
                    </section>
                    <section>
                      <NotaCreditoCreateSelectCajaEstablecimiento
                        list={list}
                        onBlur={handleBlur} />
                    </section>
                    <section>
                      <h1 className='font-bold text-secondary'>DETALLES DE EMISIÓN DE NOTA DE CRÉDITO</h1>
                      <Divider className="mt-4" />
                    </section>
                    <FieldArray name="items">
                      {({ push, remove }) => (
                        <>
                          {values.items.map((item, index) => (
                            <Card className='p-4' key={index}>
                              <CardBody>
                                <section className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2">
                                  <section>
                                    <Input
                                      label='Cantidad'
                                      labelPlacement='outside'
                                      type='number'
                                      name={`items.${index}.cantidad`}
                                      variant='bordered'
                                      value={item.cantidad}
                                      isInvalid={errors.items?.[index]?.cantidad && touched.items?.[index]?.cantidad}
                                      color={errors.items?.[index]?.cantidad && touched.items?.[index]?.cantidad ? 'danger' : ''}
                                      errorMessage={errors.items?.[index]?.cantidad && touched.items?.[index]?.cantidad ? errors.items?.[index]?.cantidad : ''}
                                      onChange={(e) => {
                                        const value = Number(e.target.value)
                                        setFieldValue(`items.${index}.cantidad`, value)
                                        const total = calcularPrecio(value, item.precioUnitario)
                                        const impuesto = calcularImpuesto(value, item.precioUnitario, item.tasa)
                                        setFieldValue(`items.${index}.total`, total)
                                        setFieldValue(`items.${index}.impuesto`, impuesto)
                                        setFieldValue('total', values.total + total)
                                        setFieldValue('totalIva', values.totalIva + impuesto)
                                      }}
                                    />
                                  </section>
                                  <section>
                                    <Input
                                      label='Precio Unitario'
                                      labelPlacement='outside'
                                      type='text'
                                      name={`items.${index}.precioUnitario`}
                                      variant='bordered'
                                      value={item.precioUnitario}
                                      isInvalid={errors.items?.[index]?.precioUnitario && touched.items?.[index]?.precioUnitario}
                                      color={errors.items?.[index]?.precioUnitario && touched.items?.[index]?.precioUnitario ? 'danger' : ''}
                                      errorMessage={errors.items?.[index]?.precioUnitario && touched.items?.[index]?.precioUnitario ? errors.items?.[index]?.precioUnitario : ''}
                                      pattern='\d*'
                                      onChange={(e) => {
                                        const value = Number(e.target.validity.valid ? e.target.value : item.precioUnitario)
                                        setFieldValue(`items.${index}.precioUnitario`, value)
                                        const total = calcularPrecio(item.cantidad, value)
                                        const impuesto = calcularImpuesto(item.cantidad, value, item.tasa)
                                        setFieldValue(`items.${index}.total`, total)
                                        setFieldValue(`items.${index}.impuesto`, impuesto)
                                      }}
                                    />
                                  </section>
                                  <section>
                                    <Select
                                      variant='bordered'
                                      labelPlacement='outside'
                                      label='Tasa'
                                      name={`items.${index}.tasa`}
                                      size='md'
                                      defaultSelectedKeys={[item.tasa]}
                                      onChange={(e) => {
                                        const value = e.target.value
                                        setFieldValue(`items.${index}.tasa`, value)
                                        const total = calcularPrecio(item.cantidad, item.precioUnitario)
                                        const impuesto = calcularImpuesto(item.cantidad, item.precioUnitario, value)
                                        setFieldValue(`items.${index}.total`, total)
                                        setFieldValue(`items.${index}.impuesto`, impuesto)
                                        setFieldValue('total', values.total + total)
                                        setFieldValue('totalIva', values.totalIva + impuesto)
                                      }}
                                    >
                                      {tasas.map((el) => (
                                        <SelectItem key={el.key}>
                                          {el.label}
                                        </SelectItem>
                                      ))}
                                    </Select>
                                  </section>
                                  <section>
                                    <Input
                                      label='Impuesto'
                                      labelPlacement='outside'
                                      type='text'
                                      name={`items.${index}.impuesto`}
                                      variant='bordered'
                                      value={formatNumber(item.impuesto)}
                                      className='read-only'
                                      readOnly
                                    />
                                  </section>
                                  <section>
                                    <Input
                                      label='Total'
                                      labelPlacement='outside'
                                      type='text'
                                      name={`items.${index}.total`}
                                      variant='bordered'
                                      value={formatNumber(item.total)}
                                      className='read-only'
                                      readOnly
                                    />
                                  </section>
                                  <section className="col-span-1 sm:col-span-3 md:col-span-5">
                                    <Input
                                      label='Descripción'
                                      labelPlacement='outside'
                                      type='text'
                                      name={`items.${index}.descripcion`}
                                      variant='bordered'
                                      value={item.descripcion}
                                      isInvalid={errors.items?.[index]?.descripcion && touched.items?.[index]?.descripcion}
                                      color={errors.items?.[index]?.descripcion && touched.items?.[index]?.descripcion ? 'danger' : ''}
                                      errorMessage={errors.items?.[index]?.descripcion && touched.items?.[index]?.descripcion ? errors.items?.[index]?.descripcion : ''}
                                      onChange={handleChange}
                                    />
                                  </section>
                                  <section className="col-span-1 sm:col-span-3 md:col-span-5 flex justify-end items-end mt-4">
                                    <Button
                                      color='danger'
                                      type="button"
                                      onClick={() => remove(index)}
                                      className='w-full sm:w-auto'
                                      startContent={(<MinusIcon />)}
                                    >
                                      Quitar Ítem
                                    </Button>
                                  </section>
                                </section>
                              </CardBody>
                            </Card>
                          ))}
                          <section className="flex justify-end mt-4">
                            <Button
                              color='success'
                              type='button'
                              onClick={() => push({ cantidad: 1, precioUnitario: 0, tasa: '10%', impuesto: 0, total: 0, descripcion: '' })}
                              className='w-full sm:w-auto text-white'
                              startContent={(
                                <PlusIcon />
                              )}
                            >
                              Agregar Ítem
                            </Button>
                          </section>
                        </>
                      )}
                    </FieldArray>
                    <section>
                      <h1 className='font-bold text-secondary'>TOTAL</h1>
                      <Divider className="mt-4" />
                    </section>
                    <section className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                      <section>
                        <NotaCreditoInputTotalGeneral
                          label='Total General'
                          labelPlacement='outside'
                          type='text'
                          name='total'
                          value={values.total}
                          variant='bordered'
                          className='read-only'
                          readOnly
                        />
                      </section>
                      <section>
                        <NotaCreditoCreateInputTotalGeneralIva
                          label='Impuesto Total'
                          labelPlacement='outside'
                          type='text'
                          variant='bordered'
                          name='totalIva'
                          value={values.totalIva}
                          className='read-only'
                          readOnly
                        />
                      </section>
                    </section>
                    <section className='flex justify-center lg:justify-end mt-4'>
                      <Button
                        size='lg'
                        color='primary'
                        type='button'
                        className='w-full lg:w-1/3'
                        onPress={onOpenConfirmarCreacion}
                        isDisabled={!isValid}
                      >
                        Emitir Factura
                      </Button>
                    </section>
                  </section>
                  {isSubmitting && <Loader />}
                  <Modal isOpen={isOpenConfirmarCreacion} onOpenChange={onOpenChangeConfirmarCreacion} isDismissable={false} isKeyboardDismissDisabled={true}>
                    <ModalContent>
                      {(onClose) => (
                        <>
                          <ModalHeader className='flex flex-col gap-1 text-default-900'>Emisión de factura</ModalHeader>
                          <ModalBody>
                            <p className='text-default-900'>¿Estás seguro de esta acción?</p>
                          </ModalBody>
                          <ModalFooter>
                            <Button color='danger' variant='light' onPress={onClose}>
                              Cerrar
                            </Button>
                            <Button color='success' variant='solid' onPress={() => { onClose(); handleSubmit() }}>
                              Sí, emitir la factura
                            </Button>
                          </ModalFooter>
                        </>
                      )}
                    </ModalContent>
                  </Modal>
                </form>
              )}
            </Formik>
          </CardBody>
        </Card>
        <Toaster />
      </section>
    </main>
  )
}

export default NotaCreditoCreate
