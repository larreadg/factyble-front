export const apiUrl = 'http://localhost:8000'
export const toastStyle = {
    borderRadius: '0.5rem',
    background: '#070a0f',
    color: '#fff',
}
export const itemsPerPage = 10
export const situacionesTributarias = [
    {
        label: 'CONTRIBUYENTE'
    },
    {
        label: 'NO CONTRIBUYENTE'
    },
    {
        label: 'NO DOMICILIADO'
    },
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

export const itemsPorPagina = 10