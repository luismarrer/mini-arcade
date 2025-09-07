// @ts-check

/**
 * JS Para el juego Masterdots
 */

let iniciadoMarcado=false
let adyacentes=[]
let idMarcados=[]
let classMarcada
let idInterval = 0
let tamano = 0
let puntuacion = 0

/**
 * Devuelve un numero random entre 0 y max
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 * @param  {} max
 */
const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
}

/**
 * Pinta el panel del juego
 */
const pintarPanelJuego = () => {
    const tamanoPanel=sessionStorage.getItem('tamano')
    if (!tamanoPanel) {
        // Redirigir a la página de inicio
        location.href="index.html" 
        return
    }
    tamano = parseInt(tamanoPanel)
    const juegoElement = document.getElementById("juego")
    if (!juegoElement) {
        console.error("Element with ID 'juego' not found")
        return
    }
    juegoElement.style.gridTemplateColumns="repeat("+tamano+", 1fr)"
    juegoElement.style.gridTemplateRows="repeat("+tamano+", 1fr)"

    // Elementos de forma automatica
    let items = ""
    let color = ["rojo","verde"]
    let colorRnd = 0
    for (let index = 0; index < (parseInt(tamanoPanel)*parseInt(tamanoPanel)); index++) {
        if (index%2>0) colorRnd=getRandomInt(2)
        items+=`<div class="containerItem"><div id="${index}" class="item ${color[colorRnd]}"></div></div>`
    }
    juegoElement.innerHTML=items
}

/**
 * Muestra los datos del usuario
 */
const mostrarDatosUsuario = () => {
    const avatar=sessionStorage.getItem('avatarImg')
    const nick=sessionStorage.getItem('nick')
    const tamano=sessionStorage.getItem('tamano')
    
    const avatarElement = /** @type {HTMLImageElement} */ (document.getElementById("avatarImg"))
    const nickElement = /** @type {HTMLInputElement} */ (document.getElementById("nick"))
    const tamanoElement = /** @type {HTMLInputElement} */ (document.getElementById("tamano"))
    
    if (avatarElement && avatar) avatarElement.src = avatar
    if (nickElement && nick) nickElement.innerText = `Nick: ${nick}`
    if (tamanoElement && tamano) tamanoElement.innerText = `Tamaño: ${tamano}x${tamano}`
}

/**
 * Calcula el array de los adyacentes
 * @param  {Number} idMarcado número marcado
 */
const calcularAdyacentes = (idMarcado) => {
    adyacentes=[]
    //Adyacente superior
    if((idMarcado-tamano)>=0) adyacentes.push(idMarcado-tamano)
    //Adyacente inferior
    if((idMarcado+tamano)<(tamano*tamano)) adyacentes.push(idMarcado+tamano)
    //Adyacente izquierda
    if((idMarcado%tamano)>0) adyacentes.push(idMarcado-1)
    //Adyacente derecha
    if(((idMarcado+1)%tamano)>0) adyacentes.push(idMarcado+1)

}

/**
 * Funcion que realiza el conteo hacia atrás del juego
 * En segundos
 */
const cuentaAtras = () => {

    // Inicializar el temporizador
    let tmpoRestante = 60
    // Elemento del temporizador
    const tmpoElement = /** @type {HTMLInputElement} */ (document.getElementById("tmpo"))
    if (!tmpoElement) return console.error("Element with ID 'tmpo' not found")

    // bucle del temporizador
    idInterval = setInterval(() => {
        tmpoRestante--
        if (tmpoRestante < 0) {
            clearInterval(idInterval)
            tmpoRestante = 0
            finJuego()
        }
        tmpoElement.innerText = `Tiempo restante: ${tmpoRestante}`
    }, 1000)
}

/**
 * Fin del juego
 */
const finJuego = () => {
    const items=document.getElementsByClassName('item')
    for (let item of items) {
        item.removeEventListener('mousedown',comenzarMarcar)
        item.removeEventListener('mouseover',continuarMarcando)
    }
    document.removeEventListener('mouseup',finalizarMarcado)

    // Cambiar la visibilidad de los paneles
    const juegoAcabadoElement = document.getElementById("juegoAcabado")
    const juegoElement = document.getElementById("juego")
    if (juegoAcabadoElement) {
        juegoAcabadoElement.style.display="block"
    }
    const nuevaPartidaElement = document.getElementById("nuevaPartida")
    if (nuevaPartidaElement) {
        nuevaPartidaElement.addEventListener("click",(e)=>location.reload())
    }
}

/**
 * Añadir los eventos al juego
 */
const programarEventosJuego = () => {
    const items=document.getElementsByClassName('item')
    for (let item of items) {
        item.addEventListener('mousedown',comenzarMarcar)
        item.addEventListener('mouseover',continuarMarcando)
    }
    document.addEventListener('mouseup',finalizarMarcado)

    // Cuenta atrás
    cuentaAtras()
}

/**
 * Iniciar el marcado de los dots
 * @param {Event} event
 */
const comenzarMarcar = (event) => {
    const item = /** @type {HTMLElement} */ (event.target)
    const containerItem = item?.parentElement
    if (!item || !containerItem) return
    
    if (item.classList.contains('rojo')) {
        classMarcada='rojo'
        containerItem.classList.add('rojo')
    } else {
        classMarcada='verde'
        containerItem.classList.add('verde')
    }

    if (!iniciadoMarcado) iniciadoMarcado=true

    //Guardo los marcados
    idMarcados.push(parseInt(item.id))
    //Comienzo a calcular adyacentes
    calcularAdyacentes(parseInt(item.id))
}

/**
 * Continuar el marcado de los dots
 * @param {Event} event
 */
const continuarMarcando = (event) => {
    if (iniciadoMarcado) {
        const item = /** @type {HTMLElement} */ (event.target)
        const containerItem = item?.parentElement
        if (!item || !containerItem) return
        
        let idNuevo=parseInt(item.id)
        //Es adyacente?
        if(adyacentes.includes(idNuevo)&&item.classList.contains(classMarcada))
        {
            if(item.classList.contains('rojo')) containerItem.classList.add('rojo')
            else containerItem.classList.add('verde')
            //Guardo los marcados
            idMarcados.push(parseInt(item.id))
            calcularAdyacentes(parseInt(item.id))
        }

    }
 }

/**
 * Finalizaría el marcado de los dots
 * @param {Event} event
 */
const finalizarMarcado = (event) => {
    iniciadoMarcado=false
    adyacentes=[]

    // recuperar puntuacion
    const puntuacionElement = /** @type {HTMLInputElement} */ (document.getElementById("puntuacion"))
    if (!puntuacionElement) return console.error("Element with ID 'puntuacion' not found")
    
    

    if(idMarcados.length > 1 && puntuacionElement){
        puntuacion += idMarcados.length
        puntuacionElement.innerText = `Puntuación: ${puntuacion}`
    }

    // Trabajar con los marcados
    for (let index = 0; index < idMarcados.length; index++) {
        //Capturar el objeto
        let itemMarcado=document.getElementById(idMarcados[index].toString())
        if (itemMarcado && itemMarcado.parentElement) {
            itemMarcado.parentElement.classList.remove(classMarcada)
        }
        //Cambiar el color de los objetos de forma rnd
        let color=["rojo","verde"]
        let colorRnd=getRandomInt(2)
        if (itemMarcado) {
            itemMarcado.classList.remove(classMarcada)
            itemMarcado.classList.add(color[colorRnd])
        }
    }
    idMarcados=[]
 }

 /**
 * Inicializa el juego
 */
const initGame = () => {
    pintarPanelJuego()
    mostrarDatosUsuario()
    programarEventosJuego()
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame)
} else {
    initGame()
}
