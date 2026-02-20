import { Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'
import ProtectedRoute from '../components/ProtectedRoute'
import AppLayout from '../layouts/AppLayout'
import Inicio from '../pages/Inicio'
import FacturaCreate from '../pages/FacturaCreate/FacturaCreate'
import NotaCreditoCreate from '../pages/NotaCreditoCreate/NotaCreditoCreate'
import FacturaList from '../pages/FacturaList/FacturaList'
import NotaCreditoList from '../pages/NotaCreditoList/NotaCreditoList'
import ReciboCreate from '../pages/ReciboCreate/ReciboCreate'

function AppRoutes() {
  return (
    <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="" element={<Inicio />} />
              <Route path="factura">
                <Route path="add" element={<FacturaCreate />} />
                <Route index element={<FacturaList />} />
              </Route>
              <Route path="nota-credito">
                <Route index element={<NotaCreditoList />} />
                <Route path="add" element={<NotaCreditoCreate />} />
              </Route>
              <Route path="recibo">
                <Route path="add" element={<ReciboCreate />} />
              </Route>
            </Route>
        </Route>
    </Routes>
  )
}

export default AppRoutes
