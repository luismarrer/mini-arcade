// @ts-check
import { $ } from './myjquery.js'

/**
 * Verifica si un elemento existe y tiene contenido
 * 
 * @param {HTMLElement | null} section 
 * @param {string} element 
 * @param {Function} resolve
 */
const checkElement = (section = $("movimientos-restantes"), element = "p", resolve) => {
            if (!section) {
                setTimeout(() => checkElement($("movimientos-restantes"), element, resolve), 100)
                return
            }
            const Element = section.querySelector(element)
            if (Element && Element.textContent) {
                return resolve(Element.textContent)
            } else {
                setTimeout(() => checkElement(section, element, resolve), 100) // Revisar cada 100ms
            }
        }

/**
 * Espera a que un elemento sea creado
 * @param {HTMLElement | null} section 
 * @param {string} element 
 * @returns {Promise<string>} 
 */
const waitForElement = (section = $("movimientos-restantes"), element = "p") => {
    return new Promise((resolve) => {
        checkElement(section, element, resolve)
    })
}

export { waitForElement }
