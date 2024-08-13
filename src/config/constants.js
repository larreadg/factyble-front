// export const apiUrl = 'http://216.225.192.54:12100'
export const apiUrl = 'http://localhost:8000'
export const appVersion = 'v1.0.1'
export const toastStyle = {
    borderRadius: '0.5rem',
    background: '#070a0f',
    color: '#fff',
}
export const itemsPerPage = 10
export const situacionesTributarias = [
    {
         key: 'CONTRIBUYENTE',
        label: 'CONTRIBUYENTE'
    },
    {
         key: 'NO_CONTRIBUYENTE',
        label: 'NO CONTRIBUYENTE'
    },
    // {
    //      key: 'NO_DOMICILIADO',
    //     label: 'NO DOMICILIADO'
    // },
]
export const condicionesVenta = [
    {
        key: 'CONTADO',
        label: 'CONTADO'
    },
    {
        key: 'CREDITO',
        label: 'CRÉDITO'
    },
]
export const tasas = [
    {
        key: '0%',
        label: 'EXENTO'
    },
    {
        key: '5%',
        label: 'IVA 5%'
    },
    {
        key: '10%',
        label: 'IVA 10%'
    },
]

export const tiposIdentificacionesNoContribuyente = [
    {
        key: 'CEDULA',
        label: 'CEDULA'
    },
    {
        key: 'CARNE_DE_RESIDENCIA',
        label: 'CARNÉ DE RESIDENCIA'
    },
]

export const tiposIdentificacionesNoDomiciliado = [
    {
        key: 'CEDULA',
        label: 'CEDULA'
    },
    {
        key: 'CARNE_DE_RESIDENCIA',
        label: 'CARNÉ DE RESIDENCIA'
    },
    {
        key: 'PASAPORTE',
        label: 'PASAPORTE'
    },
    {
        key: 'IDENTIFICACION_TRIBUTARIA',
        label: 'IDENTIFICACIÓN TRIBUTARIA'
    },
]

export const tiposCreditos = [
    {
        key: 'CUOTA',
        label: 'CUOTA'
    },
    {
        key: 'A_PLAZO',
        label: 'A PLAZO'
    },
]

export const tiposCreditosPeriodicidad = [
    {
        key: 'SEMANAL',
        label: 'SEMANAL'
    },
    {
        key: 'QUINCENAL',
        label: 'QUINCENAL'
    },
    {
        key: 'MENSUAL',
        label: 'MENSUAL'
    },
    {
        key: 'TRIMESTRAL',
        label: 'TRIMESTRAL'
    },
    {
        key: 'SEMESTRAL',
        label: 'SEMESTRAL'
    },
    {
        key: 'ANUAL',
        label: 'ANUAL'
    },
]

export const itemsPorPagina = 10