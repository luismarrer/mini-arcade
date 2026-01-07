// @ts-check

/**
 * JS Para la comprobación de datos del Formulario de entrada
 */

let avatarItems
let avatarCont
let selectedAvatar = 1
import { datosUsuario } from "./datosUsuario.js";

/**
 * Comprueba los datos correctos del formualrio de entrada
 * @param  {Event} event Evento que salta al realizar submit
 */
const comprobarForm = (event, error) => {
    let nickInput = /** @type {HTMLInputElement} */ (document.getElementById("nick"))
    let tamanoInput = /** @type {HTMLSelectElement} */ (document.getElementById("tamano"))

    // Check if required elements exist
    if (!nickInput || !tamanoInput || !error) {
        console.error("Required form elements not found")
        event.preventDefault()
        return false
    }

    if (nickInput.value.match(/(?<!\S)[0-9]/)) {
        nickInput.focus()
        event.preventDefault()
        error.style.display="block"
        error.innerText="El campo de nick no puede comenzar con un numero"
        return false
    } else if (tamanoInput.value=="0") {
        tamanoInput.focus()
        event.preventDefault()
        error.style.display="block"
        error.innerText="Se debe seleccionar un tamaño de panel"
        return false
    }

    datosUsuario(nickInput.value, parseInt(tamanoInput.value), avatarCont.src)
    error.style.display="none"
    return true
}

/**
 * Handles avatar selection when clicking on avatar buttons
 * @param {Event} event - Click event from avatar button
 */
const selectAvatar = (event) => {
    const button = /** @type {HTMLElement} */ (event.currentTarget)
    if (!button) {
        console.error('No button found in selectAvatar event')
        return
    }
    
    const avatarNumber = button.dataset.avatar
    
    if (!avatarNumber) {
        console.error('No avatar number found in dataset')
        return
    }
    
    avatarItems.forEach(item => item.classList.remove('selected'))
    
    button.classList.add('selected')
    
    avatarCont.src = `./images/avatars/avatar${avatarNumber}.png`
    selectedAvatar = parseInt(avatarNumber)
}

// Drag & Drop
/**
 * Handles drag start event for avatar items
 * @param {DragEvent} event - Drag start event
 */
const handleDragStart = (event) => {
    const target = /** @type {HTMLElement} */ (event.currentTarget)
    const avatarNumber = target.dataset.avatar
    
    if (!avatarNumber) {
        console.error('No avatar number found in dataset')
        return
    }
    
    if (!event.dataTransfer) {
        console.error('DataTransfer not available')
        return
    }
    
    event.dataTransfer.setData('text/plain', avatarNumber)
    target.style.opacity = '0.5'
}

/**
 * Handles drag end event for avatar items
 * @param {DragEvent} event - Drag end event
 */
const handleDragEnd = (event) => {
    const target = /** @type {HTMLElement} */ (event.currentTarget)
    target.style.opacity = '1'
}

/**
 * Handles drag over event for drop zone
 * @param {DragEvent} event - Drag over event
 */
const handleDragOver = (event) => {
    event.preventDefault()
    const target = /** @type {HTMLElement} */ (event.currentTarget)
    target.classList.add('drag-over')
}

/**
 * Handles drag leave event for drop zone
 * @param {DragEvent} event - Drag leave event
 */
const handleDragLeave = (event) => {
    const target = /** @type {HTMLElement} */ (event.currentTarget)
    target.classList.remove('drag-over')
}

/**
 * Handles drop event for avatar container
 * @param {DragEvent} event - Drop event
 */
const handleDrop = (event) => {
    event.preventDefault()
    const target = /** @type {HTMLElement} */ (event.currentTarget)
    target.classList.remove('drag-over')
    
    if (!event.dataTransfer) {
        console.error('DataTransfer not available')
        return
    }
    
    const avatarNumber = event.dataTransfer.getData('text/plain')
    
    if (avatarNumber) {
        // Update selected avatar
        avatarItems.forEach(item => item.classList.remove('selected'))
        const selectedItem = document.querySelector(`[data-avatar="${avatarNumber}"]`)
        if (selectedItem) {
            selectedItem.classList.add('selected')
        }
        
        // Update avatar image
        avatarCont.src = `./images/avatars/avatar${avatarNumber}.png`
        selectedAvatar = parseInt(avatarNumber)
    }
}

/**
 * Carga de objetos del DOM comprobaciones y eventos del formulario
 */
const domCargado = () => {

    let formEntrada = /** @type {HTMLFormElement} */ (document.getElementById("formEntrada"))
    let error = /** @type {HTMLElement} */ (document.getElementById("error"))
    
    // Check if required elements exist
    if (!formEntrada || !error) {
        console.error("Required DOM elements not found")
        return
    }
    
    // Comprobar si hay algún error de juego.html
    const errorMessage = sessionStorage.getItem('error')
    if (errorMessage != null) {
        error.innerText = errorMessage
        sessionStorage.removeItem('error')
    }

    formEntrada.addEventListener('submit', (event)=>comprobarForm(event,error))

    // Avatar selection events
    avatarItems = document.querySelectorAll('.avatarItem')
    for (const item of avatarItems) {
        // Cast to HTMLElement to access draggable property and drag events
        const htmlElement = /** @type {HTMLElement} */ (item)
        
        // Click events
        htmlElement.addEventListener('click', selectAvatar)
        
        // Drag & drop events
        htmlElement.draggable = true
        htmlElement.addEventListener('dragstart', handleDragStart)
        htmlElement.addEventListener('dragend', handleDragEnd)
    }
    avatarCont = document.getElementById('avatarImg')
    
    // Set up drop zone for avatar container
    const avatarContainer = document.getElementById('avatarContainer')
    if (avatarContainer) {
        avatarContainer.addEventListener('dragover', handleDragOver)
        avatarContainer.addEventListener('dragleave', handleDragLeave)
        avatarContainer.addEventListener('drop', handleDrop)
    }
    
    // Set first avatar as selected by default
    if (avatarItems.length > 0) {
        avatarItems[0].classList.add('selected')
    }
}

// Event listener for DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', domCargado)
} else {
    domCargado()
}
