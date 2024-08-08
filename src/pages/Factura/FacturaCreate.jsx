import { useEffect, useState } from 'react'
import { Button } from '@nextui-org/button'
import { Divider } from '@nextui-org/divider'
import { Card, CardBody } from '@nextui-org/react'
import { Select, SelectItem } from '@nextui-org/select'
import { Input } from '@nextui-org/input'
import { Formik, FieldArray, useFormikContext } from 'formik'
import { apiUrl, condicionesVenta, situacionesTributarias, tasas, tiposIdentificacionesNoContribuyente, tiposIdentificacionesNoDomiciliado, toastStyle } from '../../config/constants'
import { calcularImpuesto, calcularPrecio, calcularTotalGeneral, calcularTotalGeneralIva, formatNumber } from '../../utils/facturacion'
import { PlusIcon } from '../../icons/PlusIcon'
import { MinusIcon } from '../../icons/MinusIcon'
import { facturaCreateValidationSchemaContribuyente, facturaCreateValidationSchemaNoContribuyente, facturaCreateValidationSchemaNoDomiciliado } from '../../formValidations/facturaCreate'
import toast, { Toaster } from 'react-hot-toast'
import CustomBreadcrumbs from '../../components/CustomBreadcrumbs'
import PropTypes from 'prop-types'
import axiosInstance from '../../services/axiosInstance'

function FacturaInputTotalGeneral({ label, labelPlacement, name, value, variant, className, readOnly }) {

  const {
    values: { items },
    setFieldValue,
  } = useFormikContext()

  useEffect(() => {
    const totalGeneral = calcularTotalGeneral(items)
    setFieldValue(name, totalGeneral)
  }, [items, setFieldValue, name])

  return (
    <>
      <Input
        value={formatNumber(value)}
        {...{ label, labelPlacement, name, variant, className, readOnly }}
      />
    </>
  )
}
FacturaInputTotalGeneral.propTypes = {
  label: PropTypes.string,
  labelPlacement: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.any,
  variant: PropTypes.string,
  className: PropTypes.string,
  readOnly: PropTypes.bool,
}

function FacturaInputTotalGeneralIva({ label, labelPlacement, name, value, variant, className, readOnly }) {

  const {
    values: { items },
    setFieldValue,
  } = useFormikContext()

  useEffect(() => {
    const totalGeneral = calcularTotalGeneralIva(items)
    setFieldValue(name, totalGeneral)
  }, [items, setFieldValue, name])

  return (
    <>
      <Input
        value={formatNumber(value)}
        {...{ label, labelPlacement, name, variant, className, readOnly }}
      />
    </>
  )
}
FacturaInputTotalGeneralIva.propTypes = {
  label: PropTypes.string,
  labelPlacement: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.any,
  variant: PropTypes.string,
  className: PropTypes.string,
  readOnly: PropTypes.bool,
}

function FacturaCreate() {
  const [search, setSearch] = useState('')
  const [validationSchema, setValidationSchema] = useState(facturaCreateValidationSchemaContribuyente)
  const [searchLoading, setSearchLoading] = useState(false)

  const breadcrumbs = [
    { label: 'Inicio', link: '/' },
    { label: 'Emitir factura', link: null }
  ]

  const buscarRuc = (situacionTributaria, setFieldValue) => {
    if (search) {
      setSearchLoading(true)
      axiosInstance
        .get(`${apiUrl}/buscar?ruc=${search}&situacionTributaria=${situacionTributaria}`)
        .then((response) => {
          setSearchLoading(false)
          if (response.data) {
            const { data } = response.data
            if (data !== null) {

              if (situacionTributaria === 'CONTRIBUYENTE') {
                const { ruc, razon_social: razonSocial } = data
                setFieldValue('ruc', ruc)
                setFieldValue('razonSocial', razonSocial)
                setFieldValue('tipoIdentificacion', 'RUC')
              } else if (situacionTributaria === 'NO_CONTRIBUYENTE') {

                const { nombres, apellidos, documento, tipo_identificacion: tipoIdentificacion } = data
                setFieldValue('nombres', nombres)
                setFieldValue('apellidos', apellidos)
                setFieldValue('identificacion', documento)
                setFieldValue('tipoIdentificacion', tipoIdentificacion)

              } else {
                const { nombres, apellidos, documento, tipo_identificacion: tipoIdentificacion } = data
                setFieldValue('nombres', nombres)
                setFieldValue('apellidos', apellidos)
                setFieldValue('identificacion', documento)
                setFieldValue('tipoIdentificacion', tipoIdentificacion)
              }
              toast.success('Datos encontrados', { style: toastStyle })

            } else {
              toast.error('Error al buscar datos', { style: toastStyle })
            }
          }
        })
        .catch((error) => {
          setSearchLoading(false)
          console.error('Error fetching data:', error)
          toast.error('Error al buscar datos', { style: toastStyle })
        })
    }
  }

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
                situacionTributaria: 'CONTRIBUYENTE',
                identificacion: '',
                tipoIdentificacion: '',
                nombres: '',
                apellidos: '',
                ruc: '',
                razonSocial: '',
                domicilio: '',
                email: '',
                pais: '',
                condicionVenta: 'CONTADO',
                totalIva: 0,
                total: 0,
                items: [
                  { cantidad: 1, precioUnitario: 0, tasa: '10%', impuesto: 0, total: 0, descripcion: '' }
                ]
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                axiosInstance.post(`${apiUrl}/factura`, { ...values })
                  .then(() => {
                    toast.success('Factura creada', { style: toastStyle })
                    setSubmitting(false)
                  })
                  .catch(() => {
                    toast.error('Error al crear factura', { style: toastStyle })
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
                        onChange={(e) => {
                          setFieldValue('situacionTributaria', e.target.value)

                          switch (e.target.value) {
                            case 'CONTRIBUYENTE':
                              setValidationSchema(facturaCreateValidationSchemaContribuyente)
                              break
                            case 'NO CONTRIBUYENTE':
                              setValidationSchema(facturaCreateValidationSchemaNoContribuyente)
                              break
                            default:
                              setValidationSchema(facturaCreateValidationSchemaNoDomiciliado)
                              break
                          }
                        }}
                        onBlur={handleBlur}
                      >
                        {situacionesTributarias.map((el) => (
                          <SelectItem key={el.label}>
                            {el.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </section>

                    {values.situacionTributaria === 'CONTRIBUYENTE' && (
                      <>
                        <section className='flex flex-col sm:flex-row items-end gap-2'>
                          <Input
                            label='Buscar RUC'
                            labelPlacement='outside'
                            type='text'
                            variant='bordered'
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                            placeholder='Buscar RUC...'
                          />
                          <Button
                            color='primary'
                            disabled={searchLoading}
                            type='button'
                            loading={searchLoading}
                            className='w-full lg:w-auto'
                            onClick={() => buscarRuc('CONTRIBUYENTE', setFieldValue)}
                            isLoading={searchLoading}>
                            Buscar
                          </Button>
                        </section>
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <section className='col-span-1 md:col-span-2'>
                            <Input
                              label='Razón Social'
                              labelPlacement='outside'
                              type='text'
                              name='razonSocial'
                              variant='bordered'
                              isInvalid={errors.razonSocial && touched.razonSocial}
                              color={errors.razonSocial && touched.razonSocial ? 'danger' : ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.razonSocial}
                              errorMessage={errors.razonSocial && touched.razonSocial ? errors.razonSocial : ''}
                              placeholder='Razón Social...'
                              className='read-only'
                              readOnly
                            />
                          </section>
                          <section className='col-span-1 md:col-span-1'>
                            <Input
                              label='RUC'
                              labelPlacement='outside'
                              type='text'
                              name='ruc'
                              variant='bordered'
                              isInvalid={errors.ruc && touched.ruc}
                              color={errors.ruc && touched.ruc ? 'danger' : ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.ruc}
                              errorMessage={errors.ruc && touched.ruc ? errors.ruc : ''}
                              placeholder='RUC...'
                              className='read-only'
                              readOnly
                            />
                          </section>
                        </section>
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
                      </>
                    )}
                    {values.situacionTributaria === 'NO CONTRIBUYENTE' && (
                      <>
                        <section className='flex flex-col sm:flex-row items-end gap-2'>
                          <Input
                            label='Buscar por Identificación'
                            labelPlacement='outside'
                            type='number'
                            variant='bordered'
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                            placeholder='Escriba el nro. de identificación...'
                          />
                          <Button
                            color='primary'
                            disabled={searchLoading}
                            type='button'
                            loading={searchLoading}
                            className='w-full lg:w-auto'
                            onClick={() => buscarRuc('NO_CONTRIBUYENTE', setFieldValue)}
                            isLoading={searchLoading}>
                            Buscar
                          </Button>
                        </section>
                        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <section className='col-span-1 md:col-span-1'>
                            <Input
                              label='Nombres'
                              labelPlacement='outside'
                              type='text'
                              name='nombres'
                              variant='bordered'
                              isInvalid={errors.nombres && touched.nombres}
                              color={errors.nombres && touched.nombres ? 'danger' : ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.nombres}
                              errorMessage={errors.nombres && touched.nombres ? errors.nombres : ''}
                              placeholder='Nombres...'
                            />
                          </section>
                          <section className='col-span-1 md:col-span-1'>
                            <Input
                              label='Apellidos'
                              labelPlacement='outside'
                              type='text'
                              name='apellidos'
                              variant='bordered'
                              isInvalid={errors.apellidos && touched.apellidos}
                              color={errors.apellidos && touched.apellidos ? 'danger' : ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.apellidos}
                              errorMessage={errors.apellidos && touched.apellidos ? errors.apellidos : ''}
                              placeholder='Apellidos...'
                            />
                          </section>
                          <section className='col-span-1 md:col-span-1'>
                            <Input
                              label='Identificación'
                              labelPlacement='outside'
                              type='number'
                              name='identificacion'
                              variant='bordered'
                              isInvalid={errors.identificacion && touched.identificacion}
                              color={errors.identificacion && touched.identificacion ? 'danger' : ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.identificacion}
                              errorMessage={errors.identificacion && touched.identificacion ? errors.identificacion : ''}
                              placeholder='Identificacion...'
                            />
                          </section>
                          <section className='col-span-1 md:col-span-1'>
                            <Select
                              variant='bordered'
                              labelPlacement='outside'
                              label='Tipo Identificación'
                              size='md'
                              value={values.tipoIdentificacion}
                              defaultSelectedKeys={['CEDULA']}
                              onChange={(e) => setFieldValue('tipoIdentificacion', e.target.value)}
                              onBlur={handleBlur}
                            >
                              {tiposIdentificacionesNoContribuyente.map((el) => (
                                <SelectItem key={el.key}>
                                  {el.label}
                                </SelectItem>
                              ))}
                            </Select>
                          </section>
                        </section>
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
                      </>
                    )}
                    {values.situacionTributaria === 'NO DOMICILIADO' && (
                      <>
                        <section className='flex flex-col sm:flex-row items-end gap-2'>
                          <Input
                            label='Buscar por Identificación'
                            labelPlacement='outside'
                            type='number'
                            variant='bordered'
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                            placeholder='Escriba el nro. de identificación...'
                          />
                          <Button
                            color='primary'
                            disabled={searchLoading}
                            type='button'
                            loading={searchLoading}
                            className='w-full lg:w-auto'
                            onClick={() => buscarRuc('NO_DOMICILIADO', setFieldValue)}
                            isLoading={searchLoading}>
                            Buscar
                          </Button>
                        </section>
                        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <section className='col-span-1 md:col-span-1'>
                            <Input
                              label='Nombres'
                              labelPlacement='outside'
                              type='text'
                              name='nombres'
                              variant='bordered'
                              isInvalid={errors.nombres && touched.nombres}
                              color={errors.nombres && touched.nombres ? 'danger' : ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.nombres}
                              errorMessage={errors.nombres && touched.nombres ? errors.nombres : ''}
                              placeholder='Nombres...'
                            />
                          </section>
                          <section className='col-span-1 md:col-span-1'>
                            <Input
                              label='Apellidos'
                              labelPlacement='outside'
                              type='text'
                              name='apellidos'
                              variant='bordered'
                              isInvalid={errors.apellidos && touched.apellidos}
                              color={errors.apellidos && touched.apellidos ? 'danger' : ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.apellidos}
                              errorMessage={errors.apellidos && touched.apellidos ? errors.apellidos : ''}
                              placeholder='Apellidos...'
                            />
                          </section>
                          <section className='col-span-1 md:col-span-1'>
                            <Input
                              label='Identificación'
                              labelPlacement='outside'
                              type='number'
                              name='identificacion'
                              variant='bordered'
                              isInvalid={errors.identificacion && touched.identificacion}
                              color={errors.identificacion && touched.identificacion ? 'danger' : ''}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.identificacion}
                              errorMessage={errors.identificacion && touched.identificacion ? errors.identificacion : ''}
                              placeholder='Identificacion...'
                            />
                          </section>
                          <section className='col-span-1 md:col-span-1'>
                            <Select
                              variant='bordered'
                              labelPlacement='outside'
                              label='Tipo Identificación'
                              size='md'
                              value={values.tipoIdentificacion}
                              defaultSelectedKeys={['CEDULA']}
                              onChange={(e) => setFieldValue('tipoIdentificacion', e.target.value)}
                              onBlur={handleBlur}
                            >
                              {tiposIdentificacionesNoDomiciliado.map((el) => (
                                <SelectItem key={el.key}>
                                  {el.label}
                                </SelectItem>
                              ))}
                            </Select>
                          </section>
                        </section>
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
                      </>
                    )}
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
                          <SelectItem key={el.key}>
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
                    <section className='flex justify-center lg:justify-end mt-4'>
                      <Button
                        size='lg'
                        color='primary'
                        disabled={isSubmitting}
                        type='submit'
                        loading={isSubmitting}
                        className='w-full lg:w-1/3'
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
    </main>
  )
}

export default FacturaCreate
