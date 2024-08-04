/**
 * Retorna el impuesto de un producto o servicio
 * @param {number} cantidad - Cantidad del producto
 * @param {number} precioUnitario - Precio unitario del producto
 * @param {number} tasa - Tasa de impuestos
 * @returns {number} - Impuesto total
 */
export const calcularImpuesto = (cantidad, precioUnitario, tasa) => {
    const iva = calcularConstanteIVA(tasa)
    if(iva === 0) return 0
    return Math.round(calcularPrecio(cantidad, precioUnitario) / iva)
}

/**
 * Calcula la constante de iva
 * @param {number} tasa - Tasa de impuestos
 * @returns {number} - Constante de iva
 */
export const calcularConstanteIVA = (tasa) => {
    switch(tasa){
        case '0%':
            return 0
        case '5%':
            return 21
        default:
            return 11
    }
}

/**
 * Retorna el precio de un producto o servicio
 * @param {number} cantidad - Cantidad del producto
 * @param {number} precioUnitario - Precio unitario del producto
 * @returns {number} - El precio total
 */
export const calcularPrecio = (cantidad, precioUnitario) => {
    cantidad = Number(cantidad)
    precioUnitario = Number(precioUnitario)
    if(isNaN(cantidad)) cantidad = 0
    if(isNaN(precioUnitario)) precioUnitario = 0
    return cantidad * precioUnitario
}

/**
 * Formatea un número con separadores de miles.
 * @param {number} num - El número a formatear.
 * @returns {string} - El número formateado con separadores de miles.
 */
export function formatNumber(num) {
    return new Intl.NumberFormat('es-ES', { useGrouping: true }).format(num)
}

/**
 * Obtiene el total general
 * @param {Object[]} items - items de facturacion
 * @returns {number} - Total general
 */
export function calcularTotalGeneral(items) {
    return items.reduce((total, item) => total + (Number(item.total) || 0), 0);
}

/**
 * Obtiene el total iva general
 * @param {Object[]} items - items de facturacion
 * @returns {number} - Total general
 */
export function calcularTotalGeneralIva(items) {
    return items.reduce((total, item) => total + (Number(item.impuesto) || 0), 0);
}