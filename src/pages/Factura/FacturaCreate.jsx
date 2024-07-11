import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { Button } from '@nextui-org/button'
import { Avatar } from '@nextui-org/react'
import { Divider } from '@nextui-org/divider'
import { Card, CardBody } from '@nextui-org/react'
import { Select, SelectItem } from '@nextui-org/select'
import { Input } from '@nextui-org/input'
import { Formik, FieldArray } from 'formik'
import { apiUrl, condicionesVenta, situacionesTributarias, tasas, toastStyle } from '../../config/constants'
import CustomBreadcrumbs from '../../components/CustomBreadcrumbs'
import axiosInstance from '../../services/axiosInstance'
import axios from 'axios'
import * as Yup from 'yup'
import UserIcon from '../../icons/UserIcon'
import { calcularImpuesto, calcularPrecio, formatNumber } from '../../utils/facturacion'
import { PlusIcon } from '../../icons/PlusIcon'
import { MinusIcon } from '../../icons/MinusIcon'
import FacturaInputTotalGeneral from './components/FacturaInputTotalGeneral'
import FacturaInputTotalGeneralIva from './components/FacturaInputTotalGeneralIva'

function FacturaCreate() {
  const [search, setSearch] = useState('')

  const breadcrumbs = [
    { label: 'Inicio', link: '/' },
    { label: 'Emitir factura', link: null }
  ]

  const validationSchema = Yup.object().shape({
    situacionTributaria: Yup.string().required('Situación tributaria es obligatoria'),
    ruc: Yup.string().required('Ruc es obligatorio'),
    razonSocial: Yup.string().required('Razón Social es obligatoria'),
    domicilio: Yup.string().required('Domicilio es obligatorio'),
    email: Yup.string().email('El email no es válido').required('Email es obligatorio'),
    condicionVenta: Yup.string().required('Condición de venta es obligatorio'),
  })

  const buscarRuc = (setFieldValue) => {
    if (search) {
      axios
        .get(`${apiUrl}?ruc=${search}`)
        .then((response) => {
          if (response.data) {
            const { data } = response.data
            if (data !== null) {
              const { ruc, razonSocial } = data
              setFieldValue('ruc', ruc)
              setFieldValue('razonSocial', razonSocial)
              toast.success('RUC encontrado', { style: toastStyle })
            } else {
              toast.error('RUC no encontrado', { style: toastStyle })
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
          toast.error('Error al buscar RUC', { style: toastStyle })
        })
    }
  }

  return (
    <>
      <section className='grid grid-cols-1'>
        <CustomBreadcrumbs items={breadcrumbs} />
      </section>
      <section className='grid grid-col-1'>
        <Card className='p-4'>
          <CardBody>
            <Formik
              initialValues={{
                situacionTributaria: 'CONTRIBUYENTE',
                ruc: '',
                razonSocial: '',
                domicilio: '',
                email: '',
                condicionVenta: 'CONTADO',
                totalIva: 0,
                total: 0,
                items: [
                  { cantidad: 1, precioUnitario: 0, tasa: '10%', impuesto: 0, total: 0, descripcion: '' }
                ]
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                axiosInstance.post(`${apiUrl}/realm`, { ...values })
                  .then(() => {
                    toast.success('Dominio creado', { style: toastStyle })
                    setSubmitting(false)
                  })
                  .catch(() => {
                    toast.error('Error al crear dominio', { style: toastStyle })
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
              }) => (
                <form onSubmit={handleSubmit}>
                  <section className='grid grid-cols-1 gap-4'>
                    <section>
                      <h1 className='font-bold text-secondary'>DATOS DEL CLIENTE</h1>
                      <Divider className="mt-4" />
                    </section>
                    <section>
                      <Select 
                        variant='bordered'
                        labelPlacement='outside'
                        label='Situación tributaria'
                        size='md'
                        value={values.situacionTributaria}
                        defaultSelectedKeys={[values.situacionTributaria]}
                        onChange={(e) => setFieldValue('situacionTributaria', e.target.value)}
                        onBlur={handleBlur} 
                      >
                        {situacionesTributarias.map((el) => (
                          <SelectItem key={el.label}>
                            {el.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </section>
                    <section className='flex flex-col sm:flex-row items-end gap-2'>
                      <Input
                        label='RUC'
                        labelPlacement='outside'
                        type='text'
                        name='ruc'
                        variant='bordered'
                        onChange={(e) => setSearch(e.target.value)}
                        onBlur={handleBlur}
                        value={search}
                        placeholder='Buscar RUC...'
                      />
                      <Button
                          color='primary'
                          disabled={isSubmitting}
                          type='button'
                          loading={isSubmitting}
                          className='w-full lg:w-auto'
                          onClick={() => buscarRuc(setFieldValue)}>
                            Buscar
                      </Button>
                    </section>
                    {values.ruc && (
                      <section className='flex items-center gap-2'>
                        <section>
                          <Avatar
                            color="secondary"
                            className=" cursor-pointer"
                            size="sm"
                            showFallback
                            fallback={<UserIcon className="w-4 h-4 text-white" />}
                          />
                        </section>
                        <section>
                          <p className='font-bold text-primary'>{values.ruc}</p>
                          <p>{values.razonSocial}</p>
                        </section>
                      </section>
                    )}
                    <section>
                      <Input
                        label='Domicilio'
                        labelPlacement='outside'
                        type='text'
                        name='domicilio'
                        variant='bordered'
                        isInvalid={errors.domicilio && touched.domicilio}
                        color={errors.domicilio && touched.domicilio ? 'danger' : ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.domicilio}
                        errorMessage={errors.domicilio && touched.domicilio ? errors.domicilio : ''}
                        placeholder='Domicilio...'
                      />
                    </section>
                    <section>
                      <Input
                        label='Email'
                        labelPlacement='outside'
                        type='email'
                        name='email'
                        variant='bordered'
                        isInvalid={errors.email && touched.email}
                        color={errors.email && touched.email ? 'danger' : ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                        errorMessage={errors.email && touched.email ? errors.email : ''}
                        placeholder='Email...'
                      />
                    </section>
                    <section>
                      <h1 className='font-bold text-secondary'>TRANSACCIÓN</h1>
                      <Divider className="mt-4" />
                    </section>
                    <section>
                      <Select 
                        variant='bordered'
                        labelPlacement='outside'
                        label='Condición de venta'
                        size='md'
                        value={values.condicionVenta}
                        defaultSelectedKeys={[values.condicionVenta]}
                        onChange={(e) => setFieldValue('condicionVenta', e.target.value)}
                        onBlur={handleBlur} 
                      >
                        {condicionesVenta.map((el) => (
                          <SelectItem key={el.label}>
                            {el.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </section>
                    <section>
                      <h1 className='font-bold text-secondary'>DETALLES DE FACTURACIÓN</h1>
                      <Divider className="mt-4" />
                    </section>
                    <FieldArray name="items">
                      {({ push, remove }) => (
                        <>
                          {values.items.map((item, index) => (
                            <Card className='p-4' key={index}>
                              <CardBody>
                                <section  className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2">
                                  <section>
                                    <Input
                                      label='Cantidad'
                                      labelPlacement='outside'
                                      type='number'
                                      name={`items.${index}.cantidad`}
                                      variant='bordered'
                                      value={item.cantidad}
                                      onChange={(e) => {
                                        const value = e.target.value
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
                                      onChange={handleChange}
                                    />
                                  </section>
                                  <section className="col-span-1 sm:col-span-3 md:col-span-5 flex justify-end items-end mt-4">
                                    <Button
                                      color='danger'
                                      type="button"
                                      onClick={() => remove(index)}
                                      className='w-full sm:w-auto'
                                      startContent={(<MinusIcon/>)}
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
                                <PlusIcon/>
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
                        <FacturaInputTotalGeneral
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
                        <FacturaInputTotalGeneralIva
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
                    <section className='flex justify-end mt-4'>
                      <Button
                        color='primary'
                        disabled={isSubmitting}
                        type='submit'
                        loading={isSubmitting}
                      >
                        Emitir Factura
                      </Button>
                    </section>
                  </section>
                </form>
              )}
            </Formik>
          </CardBody>
        </Card>
        <Toaster />
      </section>
    </>
  )
}

export default FacturaCreate
