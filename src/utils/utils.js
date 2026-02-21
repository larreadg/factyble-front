export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error("Error al copiar al portapapeles: ", err)
    return false
  }
}

export const sidebarItems = [
  {
    key: 'op-1',
    title: 'Inicio',
    icon: null,
    route: '/'
  },
  {
    key: 'op-2',
    title: 'Emitir factura',
    icon: null,
    route: '/factura/add'
  },
  {
    key: 'op-3',
    title: 'Emitir nota de crédito',
    icon: null,
    route: '/nota-credito/add'
  },
  {
    key: 'op-4',
    title: 'Facturas emitidas',
    icon: null,
    route: '/factura'
  },
  {
    key: 'op-5',
    title: 'Notas de crédito emitidas',
    icon: null,
    route: '/nota-credito'
  },
  {
    key: 'op-6',
    title: 'Recibos emitidos',
    icon: null,
    route: '/nota-recibo'
  },
  {
    key: 'op-7',
    title: 'Emitir recibo',
    icon: null,
    route: '/recibo/add'
  },
]
