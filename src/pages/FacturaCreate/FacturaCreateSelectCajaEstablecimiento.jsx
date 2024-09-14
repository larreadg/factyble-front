import { useFormikContext } from 'formik'
import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Select, SelectItem } from '@nextui-org/select'

function FacturaCreateSelectCajaEstablecimiento({ handleBlur, list }) {
    const {
        values,
        setFieldValue,
    } = useFormikContext()

    useEffect(() => {
        // Set the first item as the default selected value if the list is not empty
        if (list.length > 0 && !values.caja) {
            const defaultItem = list[0]
            setFieldValue('caja', defaultItem.codigo)
            setFieldValue('establecimiento', defaultItem.establecimiento.codigo)
        }
    }, [list, setFieldValue, values.caja])

    return (
        <Select
            isRequired
            variant='bordered'
            labelPlacement='outside'
            label='Establecimiento & Caja'
            size='md'
            value={values.caja}
            selectedKeys={values.caja ? [values.caja] : []}
            onChange={(e) => {
                const selectedValue = e.target.value
                const item = list.find(el => el.codigo === selectedValue)
                if(item){
                    setFieldValue('caja', selectedValue)
                    setFieldValue('establecimiento', item.establecimiento.codigo)
                }
            }}
            onBlur={handleBlur}
        >
            {list.map((el) => (
                <SelectItem key={el.codigo} value={el.codigo}>
                    {`${el.establecimiento.codigo} ${el.establecimiento.nombre} | ${el.codigo} ${el.nombre}`}
                </SelectItem>
            ))}
        </Select>
    )
}

FacturaCreateSelectCajaEstablecimiento.propTypes = {
    handleBlur: PropTypes.func,
    list: PropTypes.array,
}

export default FacturaCreateSelectCajaEstablecimiento