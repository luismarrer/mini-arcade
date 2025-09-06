/**
 * JS Para la comprobación de datos del Formulario de entrada
 */

let nickInput
let tamanoInput
let emailInput
let formEntrada
let error
let avatarItems
let avatarCont
let selectedAvatar = 1

/**
 * Comprueba los datos correctos del formualrio de entrada
 * @param  {EventObject} event Evento que salta al realizar submit
 */
function comprobarForm(event){

    if(nickInput.value.match(/(?<!\S)[0-9]/)) {
        nickInput.focus()
        event.preventDefault()
        error.style.display="block"
        error.innerText="El campo de nick no puede comenzar con un numero"
        return false
    } else if(tamanoInput.value=="0") {
        tamanoInput.focus()
        event.preventDefault()
        error.style.display="block"
        error.innerText="Se debe seleccionar un tamaño de panel"
        return false
    }
    datosUsuario(nickInput,tamanoInput,emailInput,avatarCont)
    historicoUsuarios(nickInput)
    error.style.display="none"
    return true
}

/**
 * Handles avatar selection when clicking on avatar buttons
 * @param {Event} event - Click event from avatar button
 */
const selectAvatar = (event) => {
    const button = event.currentTarget
    const avatarNumber = button.dataset.avatar
    
    avatarItems.forEach(item => item.classList.remove('selected'))
    
    button.classList.add('selected')
    
    avatarCont.src = `./images/avatars/avatar${avatarNumber}.png`
    selectedAvatar = avatarNumber
}

/**
 * Carga de objetos del DOM comprobaciones y eventos del formulario
 */
function domCargado(){
    nickInput=document.getElementById("nick")
    tamanoInput=document.getElementById("tamano")
    formEntrada=document.getElementById("formEntrada")
    error=document.getElementById("error")

    // Comprobar si hay algún error de juego.html
    if (sessionStorage.getItem('error') != null) {
        error.innerText=sessionStorage.getItem('error')
        sessionStorage.removeItem('error')
    }

    formEntrada.addEventListener('submit',comprobarForm)

    // Avatar selection events
    avatarItems = document.querySelectorAll('.avatarItem')
    for (const item of avatarItems) {
        item.addEventListener('click', selectAvatar)
    }
    
    avatarCont = document.getElementById('avatarImg')
    
    // Set first avatar as selected by default
    if (avatarItems.length > 0) {
        avatarItems[0].classList.add('selected')
    }
}

document.addEventListener('DOMContentLoaded', domCargado)
