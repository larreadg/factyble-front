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

export const facturaCreateValidationSchema = Yup.object().shape({
  situacionTributaria: Yup.string().required('Situación tributaria es obligatoria'),
  
  // Validaciones para contribuyentes
  ruc: Yup.string()
    .nullable()
    .test(
      'ruc-required',
      'RUC es obligatorio cuando la situación tributaria es contribuyente',
      function (value) {
        const { situacionTributaria } = this.parent;
        return situacionTributaria !== 'CONTRIBUYENTE' || !!value;
      }
    ),
  razonSocial: Yup.string()
    .nullable()
    .test(
      'razonSocial-required',
      'Razón Social es obligatoria cuando la situación tributaria es contribuyente',
      function (value) {
        const { situacionTributaria } = this.parent;
        return situacionTributaria !== 'CONTRIBUYENTE' || !!value;
      }
    ),
  
  // Validaciones para no contribuyentes o no domiciliados
  nombres: Yup.string()
    .nullable()
    .test(
      'nombres-required',
      'Nombres es obligatorio cuando la situación tributaria es no contribuyente o no domiciliado',
      function (value) {
        const { situacionTributaria } = this.parent;
        return situacionTributaria === 'CONTRIBUYENTE' || !!value;
      }
    ),
  apellidos: Yup.string()
    .nullable()
    .test(
      'apellidos-required',
      'Apellidos es obligatorio cuando la situación tributaria es no contribuyente o no domiciliado',
      function (value) {
        const { situacionTributaria } = this.parent;
        return situacionTributaria === 'CONTRIBUYENTE' || !!value;
      }
    ),
  identificacion: Yup.string()
    .nullable()
    .test(
      'identificacion-required',
      'Identificación es obligatoria cuando la situación tributaria es no contribuyente o no domiciliado',
      function (value) {
        const { situacionTributaria } = this.parent;
        return situacionTributaria === 'CONTRIBUYENTE' || !!value;
      }
    ),
  tipoIdentificacion: Yup.string()
    .nullable()
    .test(
      'tipoIdentificacion-required',
      'Tipo de Identificación es obligatorio cuando la situación tributaria es no contribuyente o no domiciliado',
      function (value) {
        const { situacionTributaria } = this.parent;
        return situacionTributaria === 'CONTRIBUYENTE' || !!value;
      }
    ),
  
  // Validaciones para el campo email y condicionVenta
  email: Yup.string().email('El email no es válido').required('Email es obligatorio'),
  condicionVenta: Yup.string().required('Condición de venta es obligatoria'),

  // Validaciones condicionales previas para tipoCredito, cantidadCuota, periodicidad, plazoDescripcion
  tipoCredito: Yup.string()
    .nullable()
    .test(
      'tipoCredito-required',
      'Tipo de crédito es obligatorio cuando la condición de venta es crédito',
      function (value) {
        const { condicionVenta } = this.parent;
        return condicionVenta !== 'CREDITO' || !!value;
      }
    ),
  cantidadCuota: Yup.number()
    .nullable()
    .test(
      'cantidadCuota-required',
      'Cantidad de cuotas es obligatoria cuando el tipo de crédito es cuota',
      function (value) {
        const { condicionVenta, tipoCredito } = this.parent;
        return condicionVenta !== 'CREDITO' || tipoCredito !== 'CUOTA' || !!value;
      }
    ),
  periodicidad: Yup.string()
    .nullable()
    .test(
      'periodicidad-required',
      'Periodicidad es obligatoria cuando el tipo de crédito es cuota',
      function (value) {
        const { condicionVenta, tipoCredito } = this.parent;
        return condicionVenta !== 'CREDITO' || tipoCredito !== 'CUOTA' || !!value;
      }
    ),
  plazoDescripcion: Yup.string()
    .nullable()
    .test(
      'plazoDescripcion-required',
      'Descripción del plazo es obligatoria cuando el tipo de crédito es a plazo',
      function (value) {
        const { condicionVenta, tipoCredito } = this.parent;
        return condicionVenta !== 'CREDITO' || tipoCredito !== 'A_PLAZO' || !!value;
      }
    ),
  
  // Validación del array de items
  items: Yup.array().of(facturaDetalleValidationSchema).min(1, 'Debe haber al menos un item'),
})