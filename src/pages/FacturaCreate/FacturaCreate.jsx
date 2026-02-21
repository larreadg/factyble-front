import { useEffect, useState } from 'react'
import { Button } from '@nextui-org/button'
import { Divider } from '@nextui-org/divider'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Card, CardBody, Textarea, Autocomplete, AutocompleteItem } from '@nextui-org/react'
import { Select, SelectItem } from '@nextui-org/select'
import { Input } from '@nextui-org/input'
import { Formik, FieldArray } from 'formik'
import { apiUrl, condicionesVenta, situacionesTributarias, tasas, tiposCreditos, tiposCreditosPeriodicidad, tiposIdentificacionesNoContribuyente, tiposIdentificacionesNoDomiciliado, toastStyle, paises } from '../../config/constants'
import { calcularImpuesto, calcularPrecio, formatNumber } from '../../utils/facturacion'
import { PlusIcon } from '../../icons/PlusIcon'
import { MinusIcon } from '../../icons/MinusIcon'
import { facturaCreateValidationSchema } from '../../formValidations/facturaCreate'
import toast, { Toaster } from 'react-hot-toast'
import CustomBreadcrumbs from '../../components/CustomBreadcrumbs'
import axiosInstance from '../../services/axiosInstance'
import Loader from '../../components/Loader'
import FacturaInputTotalGeneral from './FacturaCreateInputTotalGeneral'
import FacturaInputTotalGeneralIva from './FacturaCreateInputTotalGeneralIva'
import FacturaCreateSelectCajaEstablecimiento from './FacturaCreateSelectCajaEstablecimiento'
import { jwtDecode } from 'jwt-decode'

function FacturaCreate() {
  const [user, setUser] = useState(null)
  const [list, setList] = useState([])
  const [search, setSearch] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const { isOpen: isOpenConfirmarCreacion, onOpen: onOpenConfirmarCreacion, onOpenChange: onOpenChangeConfirmarCreacion } = useDisclosure()
  const breadcrumbs = [
    { label: 'Inicio', link: '/' },
    { label: 'Emitir factura', link: null }
  ]

  const buscarRuc = (situacionTributaria, setFieldValue, setFieldTouched) => {
    if (search) {
      clearSearchFields(setFieldValue, setFieldTouched)
      setSearchLoading(true)
      axiosInstance
        .get(`${apiUrl}/buscar?ruc=${search}&situacionTributaria=${situacionTributaria}`)
        .then((response) => {
          setSearchLoading(false)
          if (response.data) {
            const { data } = response.data
            if (data !== null) {

              if (situacionTributaria === 'CONTRIBUYENTE') {
                const { ruc, razon_social: razonSocial, email } = data
                setFieldValue('ruc', ruc)
                setFieldValue('razonSocial', razonSocial)
                setFieldValue('tipoIdentificacion', 'RUC')
                email !== null && setFieldValue('email', email)
              } else if (situacionTributaria === 'NO_CONTRIBUYENTE' || situacionTributaria === 'NO_DOMICILIADO') {

                const { nombres, apellidos, documento, tipo_identificacion: tipoIdentificacion, email, pais, direccion } = data
                nombres !== null && setFieldValue('nombres', nombres)
                apellidos !== null && setFieldValue('apellidos', apellidos)
                documento !== null && setFieldValue('identificacion', documento)
                tipoIdentificacion !== null && setFieldValue('tipoIdentificacion', tipoIdentificacion)
                pais !== null && setFieldValue('pais', pais)
                direccion !== null && setFieldValue('direccion', direccion)
                email !== null && setFieldValue('email', email)

              }
              toast.success('Datos encontrados', { style: toastStyle })

            } else {
              toast.error('Datos no encontrados', { style: toastStyle })
            }
          }
        })
        .catch((error) => {
          setSearchLoading(false)
          console.error('Datos no encontrados:', error)
          toast.error('Datos no encontrados', { style: toastStyle })
        })
    }
  }

  const clearSearchFields = (setFieldValue, setFieldTouched, clearInput = false) => {
    const attrs = ['ruc', 'razonSocial', 'nombres', 'apellidos', 'identificacion', 'tipoIdentificacion']
    for (let attr of attrs) {
      setFieldValue(attr, '')
      setFieldTouched(attr, false)
    }
    clearInput && setSearch('')
  }

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
                situacionTributaria: 'CONTRIBUYENTE',
                identificacion: '',
                tipoIdentificacion: '',
                nombres: '',
                apellidos: '',
                ruc: '',
                razonSocial: '',
                direccion: '',
                email: '',
                pais: 'PRY',
                condicionVenta: 'CONTADO',
                totalIva: 0,
                total: 0,
                tipoCredito: 'CUOTA',
                cantidadCuota: 1,
                periodicidad: 'MENSUAL',
                plazoDescripcion: '',
                items: [
                  { cantidad: 1, precioUnitario: 0, tasa: '10%', impuesto: 0, total: 0, descripcion: '' }
                ],
                establecimiento: '',
                caja: ''
              }}
              validationSchema={facturaCreateValidationSchema}
              onSubmit={(values, { setSubmitting, resetForm }) => {

                if (values.situacionTributaria === 'NO_CONTRIBUYENTE' || values.situacionTributaria === 'NO_DOMICILIADO') {
                  values.razonSocial = `${values.apellidos}, ${values.nombres}`
                  values.ruc = values.identificacion
                }
                return
                // axiosInstance.post(`${apiUrl}/factura`, { ...values })
                //   .then(() => {
                //     toast.success('Factura emitida', { style: toastStyle, duration: 5000 })
                //     setSubmitting(false)
                //     resetForm()
                //     setSearch('')
                //   })
                //   .catch((error) => {
                //     let errorMsg = error.message || `Error al crear factura`
                //     if(error && error.response){
                //       const { data: { message } } = error.response
                //       errorMsg = message
                //     }
                //     toast.error(errorMsg, { style: toastStyle, duration: 5000 })
                //     setSubmitting(false)
                //   })
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
                setFieldTouched,
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
                      <h1 className='font-bold text-secondary'>PUNTO DE EMISIÓN</h1>
                      <Divider className="mt-4" />
                    </section>
                    <section>
                      <FacturaCreateSelectCajaEstablecimiento
                        list={list}
                        onBlur={handleBlur} />
                    </section>
                    <section>
                      <h1 className='font-bold text-secondary'>DATOS DEL CLIENTE</h1>
                      <Divider className="mt-4" />
                    </section>
                    <section>
                      <Select
                        isRequired
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
                          <SelectItem key={el.key}>
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
                            className='w-full sm:w-1/4'
                            onClick={() => buscarRuc('CONTRIBUYENTE', setFieldValue, setFieldTouched)}
                            isLoading={searchLoading}>
                            Buscar
                          </Button>
                          <Button
                            color='default'
                            type='button'
                            className='w-full sm:w-1/4'
                            onClick={() => { clearSearchFields(setFieldValue, setFieldTouched, true) }}>
                            Limpiar
                          </Button>
                        </section>
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <section className='col-span-1 md:col-span-2'>
                            <Input
                              isRequired
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
                            />
                          </section>
                          <section className='col-span-1 md:col-span-1'>
                            <Input
                              isRequired
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
                            />
                          </section>
                        </section>
                        <section>
                          <Input
                            label='Dirección'
                            labelPlacement='outside'
                            type='text'
                            name='direccion'
                            variant='bordered'
                            isInvalid={errors.direccion && touched.direccion}
                            color={errors.direccion && touched.direccion ? 'danger' : ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.direccion}
                            errorMessage={errors.direccion && touched.direccion ? errors.direccion : ''}
                            placeholder='Dirección...'
                          />
                        </section>
                        <section>
                          <Input
                            isRequired
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
                    {['NO_DOMICILIADO', 'NO_CONTRIBUYENTE'].includes(values.situacionTributaria) && (
                      <>
                        <section className='flex flex-col sm:flex-row items-end gap-2'>
                          <Input
                            label='Buscar por Identificación'
                            labelPlacement='outside'
                            type='text'
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
                            className='w-full sm:w-1/4'
                            onClick={() => buscarRuc(values.situacionTributaria, setFieldValue, setFieldTouched)}
                            isLoading={searchLoading}>
                            Buscar
                          </Button>
                          <Button
                            color='default'
                            type='button'
                            className='w-full sm:w-1/4'
                            onClick={() => { clearSearchFields(setFieldValue, setFieldTouched, true) }}
                          >
                            Limpiar
                          </Button>
                        </section>
                        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <section className='col-span-1 md:col-span-2'>
                            <Input
                              isRequired
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
                          <section className='col-span-1 md:col-span-2'>
                            <Input
                              isRequired
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
                          <section className='col-span-1 md:col-span-2'>
                            <Input
                              isRequired
                              label='Identificación'
                              labelPlacement='outside'
                              type='text'
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
                          <section className='col-span-1 md:col-span-2'>
                            {
                              values.situacionTributaria === 'NO_DOMICILIADO' && (
                                <>
                                  <Select
                                    isRequired
                                    variant='bordered'
                                    labelPlacement='outside'
                                    label='Tipo Identificación'
                                    size='md'
                                    value={values.tipoIdentificacion}
                                    selectedKeys={values.tipoIdentificacion !== '' ? [values.tipoIdentificacion] : ['IDENTIFICACION_TRIBUTARIA']}
                                    onChange={(e) => setFieldValue('tipoIdentificacion', e.target.value)}
                                    onBlur={handleBlur}
                                  >
                                    {tiposIdentificacionesNoDomiciliado.map((el) => (
                                      <SelectItem key={el.key}>
                                        {el.label}
                                      </SelectItem>
                                    ))}
                                  </Select>
                                </>
                              )
                            }
                            {
                              values.situacionTributaria === 'NO_CONTRIBUYENTE' && (
                                <>
                                  <Select
                                    isRequired
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
                                </>
                              )
                            }
                          </section>
                          <section className='col-span-1 md:col-span-2'>
                            <Autocomplete
                              name='pais' 
                              isRequired
                              variant='bordered'
                              labelPlacement='outside'
                              label='País'
                              size='md'
                              selectedKey={values.pais}
                              defaultItems={paises}
                              onSelectionChange={(e) => setFieldValue('pais', e)}
                              onBlur={handleBlur}
                              isClearable={false}
                            >
                              {(item) => <AutocompleteItem key={item.code}>{item.name}</AutocompleteItem>}
                            </Autocomplete>
                          </section>
                        </section>
                        <section>
                          <Input
                            isRequired
                            label='Dirección'
                            labelPlacement='outside'
                            type='text'
                            name='direccion'
                            variant='bordered'
                            isInvalid={errors.direccion && touched.direccion}
                            color={errors.direccion && touched.direccion ? 'danger' : ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.direccion}
                            errorMessage={errors.direccion && touched.direccion ? errors.direccion : ''}
                            placeholder='Dirección...'
                          />
                        </section>
                        <section>
                          <Input
                            isRequired
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
                        isRequired
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
                    {values.condicionVenta === 'CREDITO' && (
                      <section className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <section>
                          <Select
                            isRequired
                            variant='bordered'
                            labelPlacement='outside'
                            label='Tipo Crédito'
                            size='md'
                            value={values.tipo}
                            defaultSelectedKeys={[values.tipoCredito]}
                            onChange={(e) => setFieldValue('tipoCredito', e.target.value)}
                            onBlur={handleBlur}
                          >
                            {tiposCreditos.map((el) => (
                              <SelectItem key={el.key}>
                                {el.label}
                              </SelectItem>
                            ))}
                          </Select>
                        </section>
                        {values.tipoCredito === 'CUOTA' && (
                          <>
                            <section>
                              <Input
                                isRequired
                                label='Cantidad cuotas'
                                labelPlacement='outside'
                                type='number'
                                name='cantidadCuota'
                                variant='bordered'
                                value={values.cantidadCuota}
                                isInvalid={errors.cantidadCuota && touched.cantidadCuota}
                                color={errors.cantidadCuota && touched.cantidadCuota ? 'danger' : ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                errorMessage={errors.cantidadCuota && touched.cantidadCuota ? errors.cantidadCuota : ''}
                                placeholder='Cantidad de cuotas...'
                              />
                            </section>
                            <section>
                              <Select
                                isRequired
                                variant='bordered'
                                labelPlacement='outside'
                                label='Periodicidad'
                                size='md'
                                value={values.periodicidad}
                                defaultSelectedKeys={[values.periodicidad]}
                                onChange={(e) => setFieldValue('periodicidad', e.target.value)}
                                onBlur={handleBlur}
                              >
                                {tiposCreditosPeriodicidad.map((el) => (
                                  <SelectItem key={el.key}>
                                    {el.label}
                                  </SelectItem>
                                ))}
                              </Select>
                            </section>
                          </>
                        )}
                        {values.tipoCredito === 'A_PLAZO' && (
                          <>
                            <section className='col-span-1 md:col-span-2'>
                              <Input
                                isRequired
                                label='Descripción (hasta 15 caracteres)'
                                labelPlacement='outside'
                                type='text'
                                name='plazoDescripcion'
                                variant='bordered'
                                value={values.plazoDescripcion}
                                isInvalid={errors.plazoDescripcion && touched.plazoDescripcion}
                                color={errors.plazoDescripcion && touched.plazoDescripcion ? 'danger' : ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                errorMessage={errors.plazoDescripcion && touched.plazoDescripcion ? errors.plazoDescripcion : ''}
                                placeholder='Ej: Plazo a 30 días...'
                              />
                            </section>
                          </>
                        )}
                      </section>
                    )}
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
                                      isRequired
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
                                      isRequired
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
                                      isRequired
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
                                    <Textarea
                                      isRequired
                                      placeholder='Descripción del producto o servicio...'
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

export default FacturaCreate
