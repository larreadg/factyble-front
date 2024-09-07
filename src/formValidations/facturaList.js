import * as Yup from 'yup'

export const reenviarEmailValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Debe ser un email válido')
      .required('El email es obligatorio'),
})

export const cancelarDocumentoValidationSchema = Yup.object().shape({
    motivo: Yup.string()
      .required('El motivo es obligatorio'),
})