import { Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'
import ProtectedRoute from '../components/ProtectedRoute'
import AppLayout from '../layouts/AppLayout'
import Inicio from '../pages/Inicio'
import FacturaList from '../pages/Factura/FacturaList'
import FacturaCreate from '../pages/Factura/FacturaCreate'
import MiNegocio from '../pages/MiNegocio'

function AppRoutes() {
  return (
    <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="" element={<Inicio />} />
              <Route path="factura">
                  <Route index element={<FacturaList />} />
                  <Route path="emitir" element={<FacturaCreate />} />
              </Route>
              <Route path="mi-negocio">
                  <Route index element={<MiNegocio />} />
              </Route>
            </Route>
        </Route>
    </Routes>
  )
}

export default AppRoutes
