import * as Yup from 'yup'

export const reenviarEmailValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Debe ser un email válido')
      .required('El email es obligatorio'),
})