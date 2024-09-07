import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from '@nextui-org/react'
import { apiUrl, toastStyle } from '../../config/constants'
import { cancelarDocumentoValidationSchema } from '../../formValidations/facturaList'
import { Formik } from 'formik'
import EstadoChip from '../../components/EstadoChip'
import PropTypes from 'prop-types'
import axiosInstance from '../../services/axiosInstance'
import toast from 'react-hot-toast'

function FacturaListModalCancelar({ isOpen, onOpenChange, item, setReloadPage }) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <Formik
                            initialValues={{ motivo: '' }}
                            validationSchema={cancelarDocumentoValidationSchema}
                            onSubmit={(values, { setSubmitting }) => {
                                axiosInstance.post(`${apiUrl}/factura/cancelar`, {
                                    motivo: values.motivo,
                                    facturaId: item.id
                                })
                                    .then(() => {
                                        toast.success('El documento fue cancelado', {
                                            style: toastStyle
                                        });
                                        setSubmitting(false);
                                        onClose()
                                        setReloadPage(prev => !prev)
                                    })
                                    .catch(error => {
                                        let msg = 'No se puede cancelar el documento'
                                        const { response } = error

                                        if (response.data && response.data.message) {
                                            msg = response.data.message
                                        }
                                        toast.error(msg, {
                                            style: toastStyle
                                        });
                                        setSubmitting(false)
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
                                        Cancelación Doc. Nro: {item.numero_factura}
                                    </ModalHeader>
                                    <ModalBody>
                                        <section className='flex flex-col gap-2 font-poppins'>
                                            <section className='flex items-center gap-2'>
                                                <EstadoChip estado={item.sifen_estado} />
                                            </section>
                                            <section className='flex items-center gap-2'>
                                                <section className='w-1/4 text-xs text-default-900 font-bold'>CDC</section>
                                                <section className='w-3/4 text-xs text-default-900 truncate'>{item.cdc}</section>
                                            </section>
                                            {['Pendiente', 'Aprobado'].includes(item.sifen_estado) && (
                                                <section className='flex items-center gap-2'>
                                                    <section className='w-1/4 text-xs text-default-900 font-bold'>KUDE</section>
                                                    <a className='text-xs text-primary underline truncate w-3/4' href={`${apiUrl}/public/${item.factura_uuid}.pdf`} target='_blank'>{`${apiUrl}/public/${item.factura_uuid}.pdf`}</a>
                                                </section>
                                            )}
                                            <section className='flex items-center gap-2'>
                                                <section className='w-1/4 text-xs text-default-900 font-bold'>LINK</section>
                                                <a className='text-xs text-primary underline truncate w-3/4' href={item.linkqr} target='_blank'>{item.linkqr}</a>
                                            </section>
                                            <section className='flex items-center gap-2'>
                                                <section className='w-1/4 text-xs text-default-900 font-bold'>XML</section>
                                                <a className='text-xs text-primary underline truncate w-3/4' href={item.xml} target='_blank'>{item.xml}</a>
                                            </section>
                                            <p className='text-xs my-2 text-center font-poppins text-danger'>¿Estás seguro? Esta acción no puede deshacerse</p>
                                        </section>
                                        <section className='flex flex-col gap-2'>
                                            <form className='space-y-4 flex flex-col gap-2'>
                                                <section>
                                                    <Input
                                                        key='outside'
                                                        label='Motivo'
                                                        labelPlacement='outside'
                                                        type='text'
                                                        name='motivo'
                                                        variant='bordered'
                                                        isInvalid={errors && errors.motivo && touched.motivo}
                                                        color={errors && errors.motivo && touched.motivo ? 'danger' : ''}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.motivo}
                                                        errorMessage={errors.motivo}
                                                        placeholder='Motivo de cancelación...'
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
                                            color='danger'
                                            isDisabled={!isValid}
                                            type='submit'
                                            isLoading={isSubmitting}
                                            onPress={handleSubmit}
                                        >
                                            Sí, cancelar documento
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

FacturaListModalCancelar.propTypes = {
    isOpen: PropTypes.func,
    onOpenChange: PropTypes.func,
    setReloadPage: PropTypes.func,
    item: PropTypes.object
}

export default FacturaListModalCancelar