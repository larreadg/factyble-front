import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import factyble from '../assets/factyble3.webp'

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsSidebarOpen(false)}></div>
      )}
      <div className={`bg-primary text-white fixed top-0 left-0 h-full w-64  p-4 transform transition-transform duration-300 ease-in-out z-50 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <header className='flex justify-center mb-4'>
          <img src={factyble} alt="Factyble" className='h-32 w-32'/>
        </header>
        <nav>
          <ul>
            <li className="mb-2">
              <Link to="/" className="block p-2" onClick={() => setIsSidebarOpen(false)}>Inicio</Link>
            </li>
            <li className="mb-2">
              <Link to="/factura/create" className="block p-2" onClick={() => setIsSidebarOpen(false)}>Crear factura</Link>
            </li>
            <li className="mb-2">
              <Link to="/factura" className="block p-2" onClick={() => setIsSidebarOpen(false)}>Ver facturas</Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}

Sidebar.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  setIsSidebarOpen: PropTypes.func.isRequired,
}

export default Sidebar
