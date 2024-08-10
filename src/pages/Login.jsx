import { Input, Button } from '@nextui-org/react'
import { Card, CardHeader, CardBody } from '@nextui-org/card'
import { Formik } from 'formik'
import { useState } from 'react'
import { EyeSlashFilledIcon } from '../icons/EyeSlashFilledIcon'
import { EyeFilledIcon } from '../icons/EyeFilledIcon'
import { MailIcon } from '../icons/MailIcon'
import { LockClosedIcon } from '../icons/LockClosedIcon'
import { apiUrl, toastStyle } from '../config/constants'
import { useNavigate  } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import bgPattern from '../assets/pattern.webp'
import factyble from '../assets/factyble.webp'
import { loginValidationSchema } from '../formValidations/login'

function Login(){

    const [isVisible, setIsVisible] = useState(false)
    const [captchaUrl, setCaptchaUrl] = useState(`${apiUrl}/captcha?t=${new Date().getTime()}`)
    const navigate = useNavigate ()
    const toggleVisibility = () => setIsVisible(!isVisible)

    const reload = () => {
        setCaptchaUrl(`${apiUrl}/captcha?t=${new Date().getTime()}`)
    }

    return (
        <section className='flex justify-center items-center min-h-screen p-2 relative bg-cover bg-cente bg-primary'
        style={{ backgroundImage: `url(${bgPattern})` }}>
            {/* <section className='absolute inset-0 bg-black opacity-50'></section> */}
            <Card className='max-w-md w-full'>
                <CardHeader className='flex justify-center items-center gap-2'>
                    <img src={factyble} alt='Factyble' className='h-44 w-44'/>
                </CardHeader>
                <CardBody className='px-6 pb-12'>
                    <Formik
                    initialValues={{ email: '', password: '', captcha: '' }}
                    validationSchema={loginValidationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        axios.post(`${apiUrl}/usuario-realm/authenticate`, {
                            usuario: values.email,
                            password: values.password,
                            captcha: values.captcha
                          })
                          .then(response => {
                            const { data } = response
                            if(data.data && data.data.token){
                                localStorage.setItem('token', data.data.token)
                                navigate('/')
                            }
                            setSubmitting(false)
                          })
                          .catch(error => {
                            toast.error('Autenticación fallida', {
                                style: toastStyle
                            })
                            console.log(error)
                            setSubmitting(false)
                            reload()
                          })
                    }}
                    >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                    }) => (
                        <form onSubmit={handleSubmit} className='space-y-4 flex flex-col gap-2'>
                            <section>
                                <Input
                                    key='outside'
                                    label='Email'
                                    labelPlacement='outside'
                                    type='email'
                                    name='email'
                                    variant='bordered'
                                    isInvalid={errors.email && touched.email}
                                    color={errors.email && touched.email ? 'danger' : ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                    errorMessage={errors.email && touched.email ? errors.email : ''}
                                    placeholder='Email'
                                    startContent={
                                        <MailIcon className='text-2xl text-default-400 pointer-events-none flex-shrink-0' />
                                    }
                                />
                            </section>
                            <section>
                                <Input
                                    key='outside'
                                    label='Contraseña'
                                    labelPlacement='outside'
                                    type={isVisible ? 'text' : 'password'}
                                    name='password'
                                    variant='bordered'
                                    isInvalid={errors.password && touched.password}
                                    color={errors.password && touched.password ? 'danger' : ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    errorMessage={errors.password && touched.password ? errors.password : ''}
                                    placeholder='Password'
                                    startContent={
                                        <LockClosedIcon className='text-2xl text-default-400 pointer-events-none flex-shrink-0' />
                                    }
                                    endContent={
                                        <button className='focus:outline-none' type='button' onClick={toggleVisibility}>
                                        {isVisible ? (
                                            <EyeSlashFilledIcon className='text-2xl text-default-400 pointer-events-none' />
                                        ) : (
                                            <EyeFilledIcon className='text-2xl text-default-400 pointer-events-none' />
                                        )}
                                        </button>
                                    }
                                />
                            </section>
                            <section className='flex justify-center items-center gap-4'>
                                <img src={captchaUrl} alt='Captcha' className='border border-2 border-default-400 rounded-lg'/>
                            </section>
                            <section className='w-full lg:w-1/2 mx-auto'>
                                <Input
                                    name='captcha'
                                    variant='bordered'
                                    isInvalid={errors.captcha && touched.captcha}
                                    color={errors.captcha && touched.captcha ? 'danger' : ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.captcha}
                                    errorMessage={errors.captcha && touched.captcha ? errors.captcha : ''}
                                    placeholder='Captcha...'
                                />
                            </section>
                            <Button 
                            className='mb-4'
                            color='primary' 
                            isDisabled={(errors && errors.email) || isSubmitting} 
                            type='submit' 
                            fullWidth
                            isLoading={isSubmitting}>Iniciar Sesión</Button>
                        </form>
                    )}
                    </Formik>
                </CardBody>
            </Card>
            <Toaster />
        </section>
    )
}

export default Login
