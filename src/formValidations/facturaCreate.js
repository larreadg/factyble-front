import * as Yup from 'yup'

// Define el esquema de validación para cada item en el array
const facturaDetalleValidationSchema = Yup.object().shape({
  cantidad: Yup.number()
    .required('Cantidad es obligatoria')
    .min(1, 'Cantidad debe ser al menos 1')
    .typeError('Cantidad debe ser un número'),
  precioUnitario: Yup.number()
    .required('Precio Unitario es obligatorio')
    .min(1, 'Precio Unitario debe ser mayor a 0')
    .typeError('Precio Unitario debe ser un número'),
  tasa: Yup.string()
    .required('Tasa es obligatoria'),
  descripcion: Yup.string()
    .required('Descripción es obligatoria'),
  impuesto: Yup.number().required('Impuesto es obligatorio').typeError('Impuesto debe ser un número'),
  total: Yup.number().required('Total es obligatorio').typeError('Total debe ser un número'),
})

// Define el esquema de validación general que incluye el array de items para contribuyentes
export const facturaCreateValidationSchemaContribuyente = Yup.object().shape({
  situacionTributaria: Yup.string().required('Situación tributaria es obligatoria'),
  ruc: Yup.string().required('Ruc es obligatorio'),
  razonSocial: Yup.string().required('Razón Social es obligatoria'),
  email: Yup.string().email('El email no es válido').required('Email es obligatorio'),
  condicionVenta: Yup.string().required('Condición de venta es obligatorio'),
  items: Yup.array().of(facturaDetalleValidationSchema).min(1, 'Debe haber al menos un item'),
})

export const facturaCreateValidationSchemaNoContribuyente = Yup.object().shape({
  situacionTributaria: Yup.string().required('Situación tributaria es obligatoria'),
  identificacion: Yup.string().required('Identificación es obligatoria'),
  tipoIdentificacion: Yup.string().required('Tipo de identificación es obligatorio'),
  nombres: Yup.string().required('Nombres es obligatorio'),
  apellidos: Yup.string().required('Apellidos es obligatorio'),
  email: Yup.string().email('El email no es válido').required('Email es obligatorio'),
  condicionVenta: Yup.string().required('Condición de venta es obligatorio'),
  items: Yup.array().of(facturaDetalleValidationSchema).min(1, 'Debe haber al menos un item'),
})

export const facturaCreateValidationSchemaNoDomiciliado = Yup.object().shape({
  situacionTributaria: Yup.string().required('Situación tributaria es obligatoria'),
  identificacion: Yup.string().required('Identificación es obligatoria'),
  tipoIdentificacion: Yup.string().required('Tipo de identificación es obligatorio'),
  nombres: Yup.string().required('Nombres es obligatorio'),
  apellidos: Yup.string().required('Apellidos es obligatorio'),
  email: Yup.string().email('El email no es válido').required('Email es obligatorio'),
  condicionVenta: Yup.string().required('Condición de venta es obligatorio'),
  items: Yup.array().of(facturaDetalleValidationSchema).min(1, 'Debe haber al menos un item'),
})