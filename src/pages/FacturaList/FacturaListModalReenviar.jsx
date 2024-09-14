import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react'
import { apiUrl, toastStyle } from '../../config/constants'
import { Formik } from 'formik'
import { reenviarEmailValidationSchema } from '../../formValidations/facturaList'
import { MailIcon } from '../../icons/MailIcon'
import axiosInstance from '../../services/axiosInstance'
import PropTypes from 'prop-types'
import toast from 'react-hot-toast'

function FacturaListModalReenviar({ isOpen, onOpenChange, item }) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <Formik
                            initialValues={{ email: '' }}
                            validationSchema={reenviarEmailValidationSchema}
                            onSubmit={(values, { setSubmitting }) => {
                                axiosInstance.post(`${apiUrl}/factura/reenviar`, {
                                    email: values.email,
                                    facturaId: item.id
                                })
                                    .then(() => {
                                        toast.success('Documento reenviado', {
                                            style: toastStyle
                                        });
                                        setSubmitting(false);
                                        onClose(); // Cerrar modal después de enviar el formulario con éxito
                                    })
                                    .catch(error => {
                                        toast.error('Error al reenviar documento', {
                                            style: toastStyle
                                        });
                                        console.log(error);
                                        setSubmitting(false);
                                    });
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
                                isValid
                            }) => (
                                <>
                                    <ModalHeader className='flex flex-col gap-1 text-default-900'>
                                        Reenviar Factura Nro: {item.numero_factura}
                                    </ModalHeader>
                                    <ModalBody>
                                        <section className='flex flex-col gap-2 font-poppins'>
                                            <form className='space-y-4 flex flex-col gap-2'>
                                                <section>
                                                    <Input
                                                        key='outside'
                                                        label='Email'
                                                        labelPlacement='outside'
                                                        type='email'
                                                        name='email'
                                                        variant='bordered'
                                                        isInvalid={errors && errors.email && touched.email}
                                                        color={errors && errors.email && touched.email ? 'danger' : ''}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.email}
                                                        errorMessage={errors.email}
                                                        placeholder='Email'
                                                        startContent={
                                                            <MailIcon className='text-2xl text-default-400 pointer-events-none flex-shrink-0' />
                                                        }
                                                    />
                                                </section>
                                            </form>
                                        </section>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color='danger' variant='light' onPress={onClose}>
                                            Cerrar
                                        </Button>
                                        <Button
                                            color='primary'
                                            isDisabled={!isValid}
                                            type='submit'
                                            isLoading={isSubmitting}
                                            onPress={handleSubmit}
                                        >
                                            Reenviar factura
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </Formik>

                    </>
                )}
            </ModalContent>
        </Modal >
    )
}

FacturaListModalReenviar.propTypes = {
    isOpen: PropTypes.bool,
    onOpenChange: PropTypes.func,
    item: PropTypes.object
}

export default FacturaListModalReenviar