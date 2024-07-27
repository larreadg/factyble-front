import * as Yup from 'yup'

// Define el esquema de validación para cada item en el array
const facturaDetalleValidationSchema = Yup.object().shape({
  cantidad: Yup.number()
    .required('Cantidad es obligatoria')
    .min(1, 'Cantidad debe ser al menos 1')
    .typeError('Cantidad debe ser un número'),
  precioUnitario: Yup.number()
    .required('Precio Unitario es obligatorio')
    .min(0, 'Precio Unitario no puede ser negativo')
    .typeError('Precio Unitario debe ser un número'),
  tasa: Yup.string()
    .required('Tasa es obligatoria'),
  descripcion: Yup.string()
    .required('Descripción es obligatoria'),
  impuesto: Yup.number().required('Impuesto es obligatorio').typeError('Impuesto debe ser un número'),
  total: Yup.number().required('Total es obligatorio').typeError('Total debe ser un número'),
})

// Define el esquema de validación general que incluye el array de items
export const facturaCreateValidationSchema = Yup.object().shape({
  situacionTributaria: Yup.string().required('Situación tributaria es obligatoria'),
  ruc: Yup.string().required('Ruc es obligatorio'),
  razonSocial: Yup.string().required('Razón Social es obligatoria'),
  domicilio: Yup.string().required('Domicilio es obligatorio'),
  email: Yup.string().email('El email no es válido').required('Email es obligatorio'),
  condicionVenta: Yup.string().required('Condición de venta es obligatorio'),
  items: Yup.array().of(facturaDetalleValidationSchema).min(1, 'Debe haber al menos un item'),
})