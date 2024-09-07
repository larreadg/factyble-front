import * as Yup from 'yup'

// Define el esquema de validación para cada item en el array
const notaCreditoDetalleValidationSchema = Yup.object().shape({
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

export const notaCreditoCreateValidationSchema = Yup.object().shape({
  cdc: Yup.string().required('CDC es obligatorio'),
  caja: Yup.string().required('Caja es obligatorio'),
  establecimiento: Yup.string().required('Establecimiento es obligatorio'),
  // Validación del array de items
  items: Yup.array().of(notaCreditoDetalleValidationSchema).min(1, 'Debe haber al menos un item'),
})