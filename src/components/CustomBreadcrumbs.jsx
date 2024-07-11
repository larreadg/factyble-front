import PropTypes from 'prop-types'
import { Breadcrumbs, BreadcrumbItem } from '@nextui-org/breadcrumbs'
import { Link } from 'react-router-dom'

const CustomBreadcrumbs = ({ items }) => {
  return (
    <Breadcrumbs className='p-4' variant='solid'>
      {items.map((item, index) => (
        item.link ? (
          <BreadcrumbItem key={index}>
            <Link to={item.link}>{item.label}</Link>
          </BreadcrumbItem>
        ) : (
          <BreadcrumbItem key={index}>{item.label}</BreadcrumbItem>
        )
      ))}
    </Breadcrumbs>
  )
}

CustomBreadcrumbs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      link: PropTypes.string,
    })
  ).isRequired,
}

export default CustomBreadcrumbs
