import { Navigate, Outlet } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const ProtectedRoute = () => {
  const token = localStorage.getItem('token')

  if (!token) {
    // Si no hay token, redirige al login
    return <Navigate to="/login" />
  }

  try {
    const decodedToken = jwtDecode(token)
    const currentTime = Date.now() / 1000 // en segundos

    if (decodedToken.exp < currentTime) {
      // Token expirado, redirigir al login
      localStorage.removeItem('token')
      return <Navigate to="/login" />
    }
  } catch (error) {
    // Si hay un error al decodificar el token, redirige al login
    console.error('Error decoding token:', error)
    localStorage.removeItem('token')
    return <Navigate to="/login" />
  }

  // Si el token es válido, renderiza el componente hijo
  return <Outlet />
}

export default ProtectedRoute

