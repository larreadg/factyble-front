import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react'
import { apiUrl } from '../../config/constants'
import EstadoChip from '../../components/EstadoChip'
import PropTypes from 'prop-types'

function NotaCreditoListModalInfo({ isOpen, onOpenChange, item }) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className='flex flex-col gap-1 text-default-900'>Nota de Crédito Nro: {item.numero_nota_credito}</ModalHeader>
                        <ModalBody>
                            <section className='flex flex-col gap-2 font-poppins'>
                                <section className='flex items-center gap-2'>
                                    <EstadoChip estado={item.sifen_estado} />
                                </section>

                                {['Rechazado', 'Cancelado'].includes(item.sifen_estado) && (
                                    <p className='text-xs text-danger'>{item.sifen_estado_mensaje}</p>
                                )}
                                <section className='flex items-center gap-2'>
                                    <section className='w-1/4 text-xs text-default-900 font-bold'>CDC</section>
                                    <section className='w-3/4 text-xs text-default-900 truncate'>{item.cdc}</section>
                                </section>
                                {['Pendiente', 'Aprobado'].includes(item.sifen_estado) && (
                                    <section className='flex items-center gap-2'>
                                        <section className='w-1/4 text-xs text-default-900 font-bold'>KUDE</section>
                                        <a className='text-xs text-primary underline truncate w-3/4' href={`${apiUrl}/public/${item.nota_credito_uuid}.pdf`} target='_blank'>{`${apiUrl}/public/${item.nota_credito_uuid}.pdf`}</a>
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
                            </section>
                        </ModalBody>
                        <ModalFooter>
                            <Button color='danger' variant='light' onPress={onClose}>
                                Cerrar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

NotaCreditoListModalInfo.propTypes = {
    isOpen: PropTypes.bool,
    onOpenChange: PropTypes.func, 
    item: PropTypes.object
}

export default NotaCreditoListModalInfo