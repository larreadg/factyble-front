import * as Yup from 'yup'


export const ReciboCreateValidationSchema = Yup.object().shape({
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
  
  // Validaciones para NO CONTRIBUYENTE o NO DOMICILIADO
  nombres: Yup.string()
    .nullable()
    .test(
      'nombres-required',
      'Nombres es obligatorio cuando la situación tributaria es NO CONTRIBUYENTE o NO DOMICILIADO',
      function (value) {
        const { situacionTributaria } = this.parent;
        return situacionTributaria === 'CONTRIBUYENTE' || !!value;
      }
    ),
  apellidos: Yup.string()
    .nullable()
    .test(
      'apellidos-required',
      'Apellidos es obligatorio cuando la situación tributaria es NO CONTRIBUYENTE o NO DOMICILIADO',
      function (value) {
        const { situacionTributaria } = this.parent;
        return situacionTributaria === 'CONTRIBUYENTE' || !!value;
      }
    ),
  identificacion: Yup.string()
    .nullable()
    .test(
      'identificacion-required',
      'Identificación es obligatoria cuando la situación tributaria es NO CONTRIBUYENTE o NO DOMICILIADO',
      function (value) {
        const { situacionTributaria } = this.parent;
        return situacionTributaria === 'CONTRIBUYENTE' || !!value;
      }
    ),

  
  // Validaciones para el campo email y condicionVenta
  email: Yup.string().email('El email no es válido').required('Email es obligatorio'),

})