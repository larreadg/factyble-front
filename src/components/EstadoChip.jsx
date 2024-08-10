import { Chip } from "@nextui-org/react"
import { CheckIcon } from "../icons/CheckIcon"
import { ClockIcon } from "../icons/ClockIcon"
import { CloseIcon } from "../icons/CloseIcon"
import { NoSymbolIcon } from "../icons/NoSymbolIcon"
import PropTypes from 'prop-types'

const estadoConfig = {
    null: {
        label: 'Pendiente',
        icon: <ClockIcon className='size-4' />,
        color: 'default',
    },
    Aprobado: {
        label: 'Aprobado',
        icon: <CheckIcon className='size-4' />,
        color: 'success',
    },
    Rechazado: {
        label: 'Rechazado',
        icon: <CloseIcon className='size-4' />,
        color: 'danger',
    },
    Cancelado: {
        label: 'Cancelado',
        icon: <NoSymbolIcon className='size-4' />,
        color: 'danger',
    },
}

function EstadoChip({ estado }) {

    const config = estadoConfig[estado] || estadoConfig.null

    return (
        <Chip
            startContent={config.icon}
            variant='solid'
            color={config.color}
            size='sm'
        >
            {config.label}
        </Chip>
    )
}

EstadoChip.propTypes = {
    estado: PropTypes.any
}

export default EstadoChip