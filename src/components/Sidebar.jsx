import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import factyble from '../assets/factyble3.webp'
import { sidebarItems } from '../utils/utils'

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsSidebarOpen(false)}></div>
      )}
      <div className={`bg-primary text-white fixed top-0 left-0 h-full w-64  p-4 transform transition-transform duration-300 ease-in-out z-50 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <header className='flex justify-center mb-4'>
          <img src={factyble} alt="Factyble" className='h-32 w-32' />
        </header>
        <nav>
          <ul>
            {
              sidebarItems.map(el => (
                <li className="mb-2 hover:bg-blue-700 hover:rounded-sm" key={el.key}>
                  <Link to={el.route} className="block p-2 text-sm" onClick={() => setIsSidebarOpen(false)}>{el.title}</Link>
                </li>
              ))
            }
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
