import { useFormikContext } from 'formik'
import { calcularTotalGeneralIva, formatNumber } from '../../utils/facturacion'
import { useEffect } from 'react'
import { Input } from '@nextui-org/input'
import PropTypes from 'prop-types'

function FacturaCreateInputTotalGeneralIva({ label, labelPlacement, name, value, variant, className, readOnly }) {

    const {
        values: { items },
        setFieldValue,
    } = useFormikContext()

    useEffect(() => {
        const totalGeneral = calcularTotalGeneralIva(items)
        setFieldValue(name, totalGeneral)
    }, [items, setFieldValue, name])

    return (
        <>
            <Input
                value={formatNumber(value)}
                {...{ label, labelPlacement, name, variant, className, readOnly }}
            />
        </>
    )
}
FacturaCreateInputTotalGeneralIva.propTypes = {
    label: PropTypes.string,
    labelPlacement: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.any,
    variant: PropTypes.string,
    className: PropTypes.string,
    readOnly: PropTypes.bool,
}

export default FacturaCreateInputTotalGeneralIva