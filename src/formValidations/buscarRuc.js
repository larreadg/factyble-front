import axiosInstance from '../services/axiosInstance'
import { toast } from 'react-hot-toast'
import { toastStyle, apiUrl } from '../config/constants'

export const buscarRuc = (situacionTributaria, setFieldValue, setFieldTouched, search, setSearchLoading) => {
  if (search) {
    clearSearchFields(setFieldValue, setFieldTouched)
    setSearchLoading(true)
    axiosInstance
      .get(`${apiUrl}/buscar?ruc=${search}&situacionTributaria=${situacionTributaria}`)
      .then((response) => {
        setSearchLoading(false)
        if (response.data) {
          const { data } = response.data
          if (data !== null) {

            if (situacionTributaria === 'CONTRIBUYENTE') {
              const { ruc, razon_social: razonSocial, email } = data
              setFieldValue('ruc', ruc)
              setFieldValue('razonSocial', razonSocial)
              setFieldValue('tipoIdentificacion', 'RUC')
              email !== null && setFieldValue('email', email)
            } else if (situacionTributaria === 'NO_CONTRIBUYENTE' || situacionTributaria === 'NO_DOMICILIADO') {
              
              const { nombres, apellidos, documento, tipo_identificacion: tipoIdentificacion, email, pais, direccion } = data
              nombres !== null && setFieldValue('nombres', nombres)
              apellidos !== null && setFieldValue('apellidos', apellidos)
              documento !== null && setFieldValue('identificacion', documento)
              tipoIdentificacion !== null && setFieldValue('tipoIdentificacion', tipoIdentificacion)
              pais !== null && setFieldValue('pais', pais)
              direccion !== null && setFieldValue('direccion', direccion)
              email !== null && setFieldValue('email', email)

            }
            toast.success('Datos encontrados', { style: toastStyle })

          } else {
            toast.error('Datos no encontrados', { style: toastStyle })
          }
        }
      })
      .catch((error) => {
        setSearchLoading(false)
        console.error('Datos no encontrados:', error)
        toast.error('Datos no encontrados', { style: toastStyle })
      })
  }
}

export const clearSearchFields = (setFieldValue, setFieldTouched, clearInput = false) => {
  const attrs = ['ruc', 'razonSocial', 'nombres', 'apellidos', 'identificacion', 'tipoIdentificacion']
  for (let attr of attrs) {
    setFieldValue(attr, '')
    setFieldTouched(attr, false)
  }
  clearInput && setSearch('')
}