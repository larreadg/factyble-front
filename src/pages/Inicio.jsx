import { Link } from 'react-router-dom'
import { Card, CardBody } from '@nextui-org/react'
import crearFacturaImg from '../assets/icon-add.webp'
import listarFacturasImg from '../assets/icon-list.webp'

function Inicio() {
  return (
    <main className='w-full lg:w-3/4 lg:mx-auto'>
      <section className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        <section>
        <Link to="/factura/emitir">
          <Card className='min-h-[20vh] hover:border hover:border-2 border-primary cursor-pointer py-2'>
            <CardBody className='flex flex-col items-center justify-center gap-4 '>
              <img src={crearFacturaImg} alt='Crear factura' className='w-16 h-auto'/>
              <h2 className='text-lg text-gray-900 font-poppins'>Emitir factura</h2>
            </CardBody>
          </Card>
        </Link>
        </section>
        <section>
        <Link to="/factura">
          <Card className='min-h-[20vh] hover:border hover:border-2 border-primary cursor-pointer py-2'>
            <CardBody className='flex flex-col items-center justify-center gap-4 '>
              <img src={listarFacturasImg} alt='Listar facturas' className='w-16 h-auto'/>
              <h2 className='text-lg text-gray-900 font-poppins'>Facturas emitidas</h2>
            </CardBody>
          </Card>
        </Link>
        </section>
      </section>
    </main>
  )
}

export default Inicio
