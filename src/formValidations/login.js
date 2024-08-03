import * as Yup from 'yup'

export const loginValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Debe ser un email válido')
      .required('El email es obligatorio'),
    password: Yup.string()
      .required('La contraseña es obligatoria'),
    captcha: Yup.string()
      .required('La captcha es obligatoria')
})