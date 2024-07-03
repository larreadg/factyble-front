import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Nav from '../components/Nav'
import Sidebar from '../components/Sidebar'
import bgPattern from '../assets/pattern2.webp'

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  return (
    <section className="flex flex-col min-h-screen overflow-x-hidden relative bg-cover bg-center" style={{ backgroundImage: `url(${bgPattern})` }}>
      <Nav isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
      <main className="flex-grow  p-4">
        <Outlet />
      </main>
    </section>
  )
}

export default AppLayout
