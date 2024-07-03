import { Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'
import ProtectedRoute from '../components/ProtectedRoute'
import AppLayout from '../layouts/AppLayout'
import Inicio from '../pages/Inicio'
import FacturaList from '../pages/Factura/FacturaList'
import FacturaCreate from '../pages/Factura/FacturaCreate'

function AppRoutes() {
  return (
    <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="" element={<Inicio />} />
              <Route path="factura">
                  <Route index element={<FacturaList />} />
                  <Route path="create" element={<FacturaCreate />} />
              </Route>
            </Route>
        </Route>
    </Routes>
  )
}

export default AppRoutes
