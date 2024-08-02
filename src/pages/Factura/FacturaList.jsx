import { Card, CardBody } from '@nextui-org/react'
import CustomBreadcrumbs from "../../components/CustomBreadcrumbs"

function FacturaList() {

  const breadcrumbs = [
    { label: 'Inicio', link: '/' },
    { label: 'Facturas emitidas', link: null }
  ]

  return (
    <main className='w-full lg:w-3/4 lg:mx-auto'>
      <section className='grid grid-cols-1'>
        <CustomBreadcrumbs items={breadcrumbs} />
      </section>
      <section className='grid grid-col-1'>
        <Card className='p-4'>
          <CardBody>
            <p>Lista</p>
          </CardBody>
        </Card>
      </section>
    </main>
  )
}

export default FacturaList
