import { Route, Routes } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { useEffect } from 'react';
import { appVersion } from './config/constants';

function App() {

  useEffect(() => {
    document.title = `eFactura ${appVersion}`
  }, [])

  return (
    <Routes>
      <Route path="/*" element={<AppRoutes />} />
    </Routes>
  )
}

export default App
