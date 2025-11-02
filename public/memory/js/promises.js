// @ts-check
import { $ } from './myjquery.js'

/**
 * Checks if an element exists and has content
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
                setTimeout(() => checkElement(section, element, resolve), 100) // Check every 100ms
            }
        }

/**
 * Waits for an element to be created
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
