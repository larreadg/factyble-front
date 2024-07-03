import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const useAxiosInterceptor = (axiosInstance) => {
  const navigate = useNavigate()

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          navigate('/admin/login')
        }
        return Promise.reject(error)
      }
    )

    // Cleanup the interceptor when the component unmounts
    return () => {
      axiosInstance.interceptors.response.eject(interceptor)
    }
  }, [axiosInstance, navigate])
}

export default useAxiosInterceptor
