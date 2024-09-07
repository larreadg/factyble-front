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
    title: 'Inicio',
    icon: null,
    route: '/'
  },
  {
    title: 'Emitir factura',
    icon: null,
    route: '/factura/add'
  },
  {
    title: 'Emitir nota de crédito',
    icon: null,
    route: '/nota-credito/add'
  },
  {
    title: 'Facturas emitidas',
    icon: null,
    route: '/factura'
  },
  {
    title: 'Notas de crédito emitidas',
    icon: null,
    route: '/nota-credito'
  },
]