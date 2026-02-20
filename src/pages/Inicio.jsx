import { Link } from 'react-router-dom'
import { Card, CardBody } from '@nextui-org/react'
import emitirFacturaImg from '../assets/inicio_emitir_factura.svg'
import facturasEmitidasImg from '../assets/inicio_facturas_emitidas.svg'
import emitirNCImg from '../assets/inicio_emitir_nc.svg'
import ncEmitidasImg from '../assets/inicio_nc_emitidas.svg'
import recibosEmitidosImg from '../assets/inicio_recibos_emitidos.svg'

function Inicio() {
  return (
    <main className='w-full lg:w-3/4 lg:mx-auto'>
      <section className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-4'>
        <section>
          <Link to="/factura/add">
            <Card className='min-h-[20vh] border border-2 border-default-300  hover:border hover:border-2 hover:border-primary cursor-pointer py-2'>
              <CardBody className='flex flex-col items-center justify-center gap-4 '>
                <img src={emitirFacturaImg} alt='Crear factura' className='w-24 h-24' />
                <h2 className='text-md text-gray-900 font-poppins'>Emitir factura</h2>
              </CardBody>
            </Card>
          </Link>
        </section>
        <section>
          <Link to="/nota-credito/add">
            <Card className='min-h-[20vh] border border-2 border-default-300  hover:border hover:border-2 hover:border-primary cursor-pointer py-2'>
              <CardBody className='flex flex-col items-center justify-center gap-4 '>
                <img src={emitirNCImg} alt='Emitir Nota de Crédito' className='w-24 h-24' />
                <h2 className='text-md text-gray-900 font-poppins'>Emitir nota de crédito</h2>
              </CardBody>
            </Card>
          </Link>
        </section>
        <section>
          <Link to="/factura">
            <Card className='min-h-[20vh] border border-2 border-default-300  hover:border hover:border-2 hover:border-primary cursor-pointer py-2'>
              <CardBody className='flex flex-col items-center justify-center gap-4 '>
                <img src={facturasEmitidasImg} alt='Facturas emitidas' className='w-24 h-24' />
                <h2 className='text-md text-gray-900 font-poppins'>Facturas emitidas</h2>
              </CardBody>
            </Card>
          </Link>
        </section>
        <section>
          <Link to="/nota-credito">
            <Card className='min-h-[20vh] border border-2 border-default-300  hover:border hover:border-2 hover:border-primary cursor-pointer py-2'>
              <CardBody className='flex flex-col items-center justify-center gap-4 '>
                <img src={ncEmitidasImg} alt='Notas de crédito emitidas' className='w-24 h-24' />
                <h2 className='text-md text-gray-900 font-poppins'>Notas de crédito emitidas</h2>
              </CardBody>
            </Card>
          </Link>
        </section>
        <section>
          <Link to="/recibo">
            <Card className='min-h-[20vh] border border-2 border-default-300  hover:border hover:border-2 hover:border-primary cursor-pointer py-2'>
              <CardBody className='flex flex-col items-center justify-center gap-4 '>
                <img src={recibosEmitidosImg} alt='Recibos emitidos' className='w-24 h-24' />
                <h2 className='text-md text-gray-900 font-poppins'>Recibos emitidos</h2>
              </CardBody>
            </Card>
          </Link>
        </section>
      </section>
    </main>
  )
}

export default Inicio
