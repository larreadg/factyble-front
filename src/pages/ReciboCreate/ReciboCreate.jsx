import { Card, CardBody, Textarea } from '@nextui-org/react'
import { useState, useEffect } from 'react'
import CustomBreadcrumbs from '../../components/CustomBreadcrumbs'
import { Formik, Field } from 'formik'
import { Divider } from '@nextui-org/divider'
import { jwtDecode } from 'jwt-decode'
import { Select, SelectItem } from '@nextui-org/select'
import { apiUrl, situacionesTributarias, toastStyle } from '../../config/constants'
import axiosInstance from '../../services/axiosInstance'
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import toast, { Toaster } from 'react-hot-toast'
import Loader from '../../components/Loader'
import { formatNumber } from '../../utils/facturacion'
import { Input } from '@nextui-org/input'
import { Button } from '@nextui-org/react';
import { buscarRuc } from '../../formValidations/buscarRuc'
import { clearSearchFields } from '../../formValidations/buscarRuc'
import FacturaCreateSelectCajaEstablecimiento from '../FacturaCreate/FacturaCreateSelectCajaEstablecimiento'
import { ReciboCreateValidationSchema } from '../../formValidations/ReciboCreate'
import { CheckSimpleIcon } from '../../icons/CheckSimpleIcon'
import { XMarkIcon } from '../../icons/XMarkIcon'


function ReciboCreate() {
    const [user, setUser] = useState(null)
    const [list, setList] = useState([])
    const [search, setSearch] = useState('')
    const [searchLoading, setSearchLoading] = useState(false)
    const [facturaInput, setFactura] = useState("");
    const [facturaMonto, setFacturaMonto] = useState("");
    const [, setChequeBanco] = useState("");
    const [chequeNumero, setChequeNumero] = useState("");
    const [chequeMonto, setChequeMonto] = useState("");
    const [, setChequeBancoKey] = useState("");
    const [chequeBancoLabel, setChequeBancoLabel] = useState("");

    const breadcrumbs = [
        { label: 'Inicio', link: '/' },
        { label: 'Emitir Recibo', link: null }
    ]

    const calcularTotal = (totalPagoEfectivo, cheques) => {
        const sumaCheques = cheques.reduce(
            (acc, cheque) => acc + Number(cheque.monto || 0),
            0
        );
        return Number(totalPagoEfectivo || 0) + sumaCheques;
    }

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
        <main className="w-full lg:w-3/4  lg:mx-auto">
            <section className='grid grid-cols-1'>
                <CustomBreadcrumbs items={breadcrumbs} />
            </section>
            <section className="grid grid-cols-1">
                <Card className="p-4">
                    <CardBody>
                        <Formik
                            initialValues={{
                                cheques: [],
                                totalEfectivo: 0,
                                concepto: "",
                                facturas: [],
                                caja: "001",
                                establecimiento: "001",
                                ruc: "",
                                razonSocial: "",
                                email: "",
                                situacionTributaria: "CONTRIBUYENTE",
                                nombres: "",
                                apellidos: "",
                            }}
                            validationSchema={ReciboCreateValidationSchema}
                            onSubmit={(values, { setSubmitting, resetForm }) => {
                                const payload = {
                                    ...values,
                                    totalEfectivo: Number(values.totalEfectivo) || 0,
                                }
                                console.log("Datos enviados:", payload);
                                if (values.situacionTributaria === 'NO_CONTRIBUYENTE' || values.situacionTributaria === 'NO_DOMICILIADO') {
                                    payload.razonSocial = `${values.apellidos}, ${values.nombres}`
                                    payload.ruc = values.identificacion
                                }
                                axiosInstance.post(`${apiUrl}/recibo`, payload)
                                    .then(() => {
                                        toast.success('Recibo emitido', { style: toastStyle, duration: 5000 })
                                        setSubmitting(false)
                                        resetForm()
                                        setSearch('')
                                    })
                                    .catch((error) => {
                                        const responseData = error?.response?.data
                                        const validationMessages = Array.isArray(responseData?.data)
                                            ? responseData.data
                                                .map((item) => item?.msg)
                                                .filter(Boolean)
                                            : []

                                        const errorMessages = validationMessages.length > 0
                                            ? validationMessages
                                            : [responseData?.message || error?.message || 'Error al crear Recibo']

                                        console.log(errorMessages)
                                        errorMessages.forEach((message) => {
                                            toast.error(message, { style: toastStyle, duration: 5000 })
                                        })
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
                                setFieldTouched,
                                isValid
                            }) => (
                                <form onSubmit={handleSubmit}>
                                    <section className="grid grid-cols-1 gap-4">
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
                                            <h1 className='font-bold text-secondary'>FACTURAS</h1>
                                            <Divider className="mt-4" />
                                        </section>
                                        <section className="flex items-center gap-2 mt-4">
                                            <Input
                                                variant="bordered"
                                                placeholder="Ingrese número de factura"
                                                value={facturaInput}
                                                onChange={(e) => setFactura(e.target.value)}
                                            />

                                            <Input
                                                type='number'
                                                variant="bordered"
                                                placeholder="Monto"
                                                value={facturaMonto}
                                                onChange={(e) => setFacturaMonto(e.target.value)}
                                            />
                                            <Button
                                                radius="full"
                                                className="w-8 h-10 bg-green-400 hover:bg-green-500 text-white"
                                                onClick={() => {
                                                    const nuevaFactura = {
                                                        numeroFactura: facturaInput,
                                                        montoAplicado: Number(facturaMonto),
                                                    };
                                                    if (nuevaFactura.numeroFactura && nuevaFactura.montoAplicado > 0) {
                                                        setFieldValue("facturas", [...values.facturas, nuevaFactura]);
                                                    }
                                                    setFactura("");
                                                    setFacturaMonto("");

                                                }}
                                                isIconOnly 
                                            >
                                                <CheckSimpleIcon className='size-4' />
                                            </Button>

                                        </section>
                                        <section>
                                            <p className='text-xs text-default-500'>
                                                Complete numero y monto, luego presione el boton de check para agregar la factura a la lista.
                                            </p>
                                        </section>
                                        <section className="flex flex-col gap-2">
                                            {values.facturas.map((factura, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <Input
                                                        variant="bordered"
                                                        value={`FACTURA: ${factura.numeroFactura} - MONTO: ${formatNumber(factura.montoAplicado)} GS.`}
                                                        readOnly
                                                        className="flex-1"
                                                        isDisabled
                                                    />
                                                    <Button
                                                        radius="full"
                                                        className="w-8 h-10 bg-red-400 hover:bg-red-500 text-white"
                                                        onClick={() => {
                                                            const nuevasFacturas = values.facturas.filter((_, i) => i !== index);
                                                            setFieldValue("facturas", nuevasFacturas);
                                                        }}
                                                        isIconOnly
                                                    >
                                                        <XMarkIcon className='size-4' />
                                                    </Button>
                                                </div>
                                            ))}
                                        </section>

                                        <section>
                                            <h1 className='font-bold text-secondary'>RECIBIMOS DE</h1>
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
                                                        onClick={() => buscarRuc('CONTRIBUYENTE', setFieldValue, setFieldTouched, search, setSearchLoading)}
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
                                                        onClick={() => buscarRuc(values.situacionTributaria, setFieldValue, setFieldTouched, search, setSearchLoading)}
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
                                            <h1 className='font-bold text-secondary'>DETALLES</h1>
                                            <Divider className="mt-4" />
                                        </section>
                                        <section style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                            <label htmlFor="totalPagoEfectivo" style={{ whiteSpace: "nowrap", flexShrink: 0 }}>Total pago en efectivo</label>
                                            <Field
                                                as={Input}
                                                isRequired
                                                id="totalEfectivo"
                                                type="number"
                                                name="totalEfectivo"
                                                variant="bordered"
                                            />

                                        </section>
                                        <section className="flex items-center gap-2 mt-4">
                                            <label htmlFor="Cheque">Cheque</label>
                                            <Autocomplete
                                                placeholder="Seleccione o escriba un banco"
                                                variant="bordered"
                                                defaultItems={[
                                                    { key: "1", label: "ZETA Banco" },
                                                    { key: "2", label: "Solar Banco S.A.E" },
                                                    { key: "3", label: "Ueno" },
                                                    { key: "4", label: "Banco Nacional de Fomento (BNF)" },
                                                    { key: "5", label: "Interfisa Banco" },
                                                    { key: "6", label: "Banco Atlas S.A" },
                                                    { key: "7", label: "BANCOP S.A" },
                                                    { key: "8", label: "Sudameris Bank S.A.E.C.A" },
                                                    { key: "9", label: "Banco GNB - Paraguay" },
                                                    { key: "10", label: "Banco Itaú Paraguay S.A" },
                                                    { key: "11", label: "Banco Familiar S.A.E.C.A" },
                                                    { key: "12", label: "Banco Continental S.A.E.C.A" },
                                                    { key: "13", label: "Banco BASA" },
                                                    { key: "14", label: "FINANCIERA FIC S.A.E.C.A" },
                                                    { key: "15", label: "Tu Financiera" },
                                                    { key: "16", label: "Financiera Paraguayo Japonesa S.A.E.C.A" },
                                                    { key: "17", label: "COOPEDUC Ltda." },
                                                    { key: "18", label: "Cooperativa del Sur Ltda." },
                                                    { key: "19", label: "Cooperativa 21 de Setiembre Ltda." },
                                                    { key: "20", label: "Cooperativa San Ignacio (COOPASI)" },
                                                    { key: "21", label: "Cooperativa Coopersam Ltda." },
                                                    { key: "22", label: "Cooperativa Alemán Concordia Ltda." },
                                                    { key: "23", label: "Cooperativa Reducto Ltda." },
                                                    { key: "24", label: "Cooperativa Mborayhu Ltda." },
                                                    { key: "25", label: "Cooperativa Nazareth Ltda." },
                                                    { key: "26", label: "Cooperativa Coodeñe Ltda." },
                                                    { key: "27", label: "Cooperativa Ñemby Ltda." },
                                                    { key: "28", label: "Cooperativa Ayacapé Ltda." },
                                                    { key: "29", label: "Cooperativa Coofy Ltda." },
                                                    { key: "30", label: "Cooperativa Mercado 4 Ltda." },
                                                    { key: "31", label: "Multiactiva 8 de Marzo Ltda." },
                                                    { key: "32", label: "Cooperativa Ypacarai Ltda." },
                                                    { key: "33", label: "Cooperativa San Juan Bautista Ltda." },
                                                    { key: "34", label: "Cooperativa Universitaria Ltda." },
                                                    { key: "35", label: "Cooperativa Coomecipar Ltda." },
                                                    { key: "36", label: "COPACONS Ltda." },
                                                    { key: "37", label: "Cooperativa Medalla Milagrosa Ltda." },
                                                    { key: "38", label: "Cooperativa Mburicao Ltda." },
                                                    { key: "39", label: "Cooperativa de las Fuerzas Armadas de la Nación Ltda." }
                                                ]}
                                                                                 
                                                onSelectionChange={(key) => {
                                                    const selected = key ? key : "";
                                                    setChequeBanco(selected);
                                                }}

                                                onInputChange={(value) => {
                                                    setChequeBancoKey("");
                                                    setChequeBancoLabel(value);
                                                }}

                                            >
                                                {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
                                            </Autocomplete>


                                            <Input
                                                variant="bordered"
                                                placeholder="Nro. de cheque"
                                                value={chequeNumero}
                                                onChange={(e) => setChequeNumero(e.target.value)}
                                            />
                                            <Input
                                                type='number'
                                                variant="bordered"
                                                placeholder="Total cheque"
                                                value={chequeMonto}
                                                onChange={(e) => setChequeMonto(e.target.value)}
                                            />
                                            <Button
                                                radius="full"
                                                className="w-8 h-10 bg-green-400 hover:bg-green-500 text-white"
                                                onClick={() => {
                                                    const nuevoCheque = {
                                                        banco: chequeBancoLabel,
                                                        numero: chequeNumero,
                                                        monto: Number(chequeMonto),
                                                    };
                                                    if (nuevoCheque.banco && nuevoCheque.numero && nuevoCheque.monto > 0) {
                                                        setFieldValue("cheques", [...values.cheques, nuevoCheque]);
                                                    }
                                                    setChequeBanco("");
                                                    setChequeNumero("");
                                                    setChequeMonto("");

                                                }}
                                                isIconOnly
                                            >
                                                <CheckSimpleIcon className='size-4' />
                                            </Button>
                                        </section>

                                        <section>
                                            <p className='text-xs text-default-500'>
                                                Complete banco, numero y total, luego presione el boton de check para agregar el cheque a la lista.
                                            </p>
                                        </section>
                                        {values.cheques.map((cheque, index) => (
                                            <section key={index} className="flex items-center gap-2">
                                                <Input
                                                    variant="bordered"
                                                    value={`BANCO: ${cheque.banco} - NRO: ${cheque.numero} - MONTO: ${formatNumber(cheque.monto)} GS.`}
                                                    readOnly
                                                    className="flex-1"
                                                    isDisabled
                                                />
                                                <Button
                                                    radius="full"
                                                    className="w-8 h-10 bg-red-400 hover:bg-red-500 text-white"
                                                    onClick={() => {
                                                        const nuevosCheques = values.cheques.filter((_, i) => i !== index);
                                                        setFieldValue("cheques", nuevosCheques);
                                                    }}
                                                    isIconOnly
                                                >
                                                    <XMarkIcon className='size-4' />
                                                </Button>
                                            </section>
                                        ))}

                                        <section>
                                            <h1 className='font-bold text-secondary'>TOTAL</h1>
                                            <Divider className="mt-4" />
                                        </section>
                                        <section style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                            <label htmlFor="totalGeneral" style={{ whiteSpace: "nowrap", flexShrink: 0 }}>Total General</label>
                                            <Input
                                                id="totalGeneral"
                                                name="totalGeneral"
                                                variant="bordered"
                                                value={formatNumber(calcularTotal(values.totalEfectivo, values.cheques)) + ' GS.'}
                                                isDisabled
                                            />

                                        </section>
                                        <Textarea
                                            isRequired
                                            label="Concepto"
                                            labelPlacement="outside"
                                            name="concepto"
                                            variant="bordered"
                                            isInvalid={errors.concepto && touched.concepto}
                                            color={errors.concepto && touched.concepto ? "danger" : ""}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.concepto}
                                            errorMessage={errors.concepto && touched.concepto ? errors.concepto : ""}
                                            placeholder="Ingrese el concepto..."
                                            className="w-full"
                                        />

                                    </section>

                                    <section className="flex justify-end gap-1 mt-6">
                                        <Button
                                            size="lg"
                                            color="primary"
                                            type="submit"
                                            className="w-full lg:w-1/3"
                                            isDisabled={!isValid}
                                        >
                                            Emitir Recibo
                                        </Button>

                                    </section>
                                    {isSubmitting && <Loader />}

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

export default ReciboCreate
