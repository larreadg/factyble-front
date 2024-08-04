import { Link } from 'react-router-dom'
import { Card, CardBody } from '@nextui-org/react'
import emitirFacturaImg from '../assets/inicio_emitir_factura.svg'
import documentosEmitidosImg from '../assets/inicio_documentos_emitidos.svg'

function Inicio() {
  return (
    <main className='w-full lg:w-3/4 lg:mx-auto'>
      <section className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4'>
        <section>
        <Link to="/factura">
          <Card className='min-h-[20vh] border border-2 border-default-300  hover:border hover:border-2 hover:border-primary cursor-pointer py-2'>
            <CardBody className='flex flex-col items-center justify-center gap-4 '>
              <img src={emitirFacturaImg} alt='Crear factura' className='w-24 h-24'/>
              <h2 className='text-md text-gray-900 font-poppins'>Emitir factura</h2>
            </CardBody>
          </Card>
        </Link>
        </section>
        <section>
        <Link to="/documento">
          <Card className='min-h-[20vh] border border-2 border-default-300  hover:border hover:border-2 hover:border-primary cursor-pointer py-2'>
            <CardBody className='flex flex-col items-center justify-center gap-4 '>
              <img src={documentosEmitidosImg} alt='Documentos emitidos' className='w-24 h-24'/>
              <h2 className='text-md text-gray-900 font-poppins'>Documentos emitidos</h2>
            </CardBody>
          </Card>
        </Link>
        </section>
      </section>
    </main>
  )
}

export default Inicio
