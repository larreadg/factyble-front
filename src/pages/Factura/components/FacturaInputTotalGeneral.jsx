import { useEffect } from "react"
import { calcularTotalGeneral, formatNumber } from "../../../utils/facturacion"
import { useFormikContext } from "formik"
import { Input } from "@nextui-org/input"
import PropTypes from 'prop-types'

function FacturaInputTotalGeneral({ label, labelPlacement, name, value, variant, className, readOnly }) {

  const {
    values: { items },
    setFieldValue,
  } = useFormikContext()

  useEffect(() => {
    const totalGeneral = calcularTotalGeneral(items)
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


FacturaInputTotalGeneral.propTypes = {
  label: PropTypes.string,
  labelPlacement: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.any,
  variant: PropTypes.string,
  className: PropTypes.string,
  readOnly: PropTypes.bool,
}
export default FacturaInputTotalGeneral