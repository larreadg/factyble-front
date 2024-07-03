import { Input, Button } from '@nextui-org/react'
import { Card, CardHeader, CardBody } from '@nextui-org/card'
import { Formik } from 'formik'
import { useState } from 'react'
import { EyeSlashFilledIcon } from '../icons/EyeSlashFilledIcon'
import { EyeFilledIcon } from '../icons/EyeFilledIcon'
import { MailIcon } from '../icons/MailIcon'
import { LockClosedIcon } from '../icons/LockClosedIcon'
import { API_URL, TOAST_STYLE } from '../config/constants'
import { useNavigate  } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import bgPattern from '../assets/pattern.webp'
import factyble from '../assets/factyble.webp'

function Login(){

    const [isVisible, setIsVisible] = useState(false)
    const navigate = useNavigate ()
    const toggleVisibility = () => setIsVisible(!isVisible)

    return (
        <section className="flex justify-center items-center min-h-screen p-2 relative bg-cover bg-cente bg-primary"
        style={{ backgroundImage: `url(${bgPattern})` }}>
            {/* <section className="absolute inset-0 bg-black opacity-50"></section> */}
            <Card className="max-w-md w-full">
                <CardHeader className="flex justify-center items-center gap-2">
                    <img src={factyble} alt="Factyble" className='h-44 w-44'/>
                </CardHeader>
                <CardBody className='px-6 pb-12'>
                    <Formik
                    initialValues={{ email: '', password: '' }}
                    validate={values => {
                        const errors = {};
                        if (!values.email) {
                            errors.email = 'Required';
                        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
                            errors.email = 'Invalid email address';
                        }
                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        axios.post(`${API_URL}/usuario-realm/authenticate`, {
                            usuario: values.email,
                            password: values.password
                          })
                          .then(response => {
                            const { data } = response
                            if(data.data && data.data.token){
                                localStorage.setItem('token', data.data.token)
                                navigate('/admin')
                            }
                            setSubmitting(false)
                          })
                          .catch(error => {
                            toast.error('Autenticación fallida', {
                                style: TOAST_STYLE
                            })
                            console.log(error)
                            setSubmitting(false);
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
                        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col gap-2">
                            <section>
                                <Input
                                    key="outside"
                                    label="Email"
                                    labelPlacement="outside"
                                    type="email"
                                    name="email"
                                    variant="bordered"
                                    isInvalid={errors && errors.email && touched}
                                    color={errors && errors.email && touched ? "danger" : ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.email}
                                    errorMessage={errors.email}
                                    placeholder="Email"
                                    startContent={
                                        <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                    }
                                />
                            </section>
                            <section>
                                <Input
                                    key="outside"
                                    label="Contraseña"
                                    labelPlacement="outside"
                                    type={isVisible ? "text" : "password"}
                                    name="password"
                                    variant="bordered"
                                    isInvalid={errors && errors.password}
                                    color={errors && errors.password ? "danger" : ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.password}
                                    errorMessage={errors.password}
                                    placeholder="Password"
                                    startContent={
                                        <LockClosedIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                    }
                                    endContent={
                                        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                        {isVisible ? (
                                            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                        ) : (
                                            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                        )}
                                        </button>
                                    }
                                />
                            </section>
                            <Button 
                            className='mb-4'
                            color="primary" 
                            isDisabled={(errors && errors.email) || isSubmitting} 
                            type="submit" 
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
