import CustomBreadcrumbs from "../components/CustomBreadcrumbs"

function MiNegocio() {

    const breadcrumbs = [
        { label: 'Inicio', link: '/' },
        { label: 'Mi Negocio', link: null }
    ]

    return (
        <>
            <section className='grid grid-cols-1'>
                <CustomBreadcrumbs items={breadcrumbs} />
            </section>
            <p>MiNegocio</p>
        </>
    )
}

export default MiNegocio
