// src/components/Nav.jsx

import { useEffect, useState } from "react"
import { useNavigate  } from 'react-router-dom'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react"
import { jwtDecode } from 'jwt-decode'
import { Avatar } from "@nextui-org/react"
import { Tooltip } from "@nextui-org/tooltip";
import PropTypes from 'prop-types'
import UserIcon from '../icons/UserIcon'
import MenuIcon from '../icons/MenuIcon'
import LogoutIcon from "../icons/LogoutIcon"
import factyble from '../assets/factyble2.webp'

const Nav = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate ()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUser(decoded)
      } catch (error) {
        console.error('Error decoding token:', error)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin/login')
  }

  return (
    <Navbar className=" h-16" isBordered={true}>
      <NavbarContent>
        <Avatar
          color="secondary"
          className=" cursor-pointer"
          size="sm"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          showFallback
          fallback={<MenuIcon className="w-4 h-4 text-white" />}
        />
        <NavbarBrand>
          <img src={factyble} alt='Factyble' className="max-h-14 w-auto"/>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end">
        { user && (
          <NavbarItem className='flex items-center gap-2'>
            <p className='text-right'>{user.usuario}</p>
            <Avatar color="secondary" className='' size='sm' showFallback fallback={
              <UserIcon className="w-4 h-4 text-white" fill="currentColor" size={20} />
            }/>
          </NavbarItem>
        )}
        <NavbarItem className='flex items-center gap-2'>
            <Tooltip content="Cerrar sesión">
                <Avatar
                color="primary"
                className='cursor-pointer'
                size='sm'
                onClick={handleLogout}
                showFallback
                fallback={<LogoutIcon className="w-4 h-4 text-white" />}
                />
            </Tooltip>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}

Nav.propTypes = {
  isSidebarOpen: PropTypes.bool.isRequired,
  setIsSidebarOpen: PropTypes.func.isRequired,
}

export default Nav
