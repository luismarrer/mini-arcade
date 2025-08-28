// @ts-check
const $ = (id) => document.getElementById(id)

/**
 * Obtiene los datos del jugador desde sessionStorage
 * @returns {Object} Los datos del jugador
 */
const getPlayerData = () => {
    const data = sessionStorage.getItem('memoryGamePlayer')
    return data ? JSON.parse(data) : {
        nick: 'Jugador',
        avatar: 'batman'
    }
}

/**
 * Obtiene la configuración del juego desde sessionStorage
 * @returns {Object} La configuración del juego
 */
const getGameConfig = () => {
    const data = sessionStorage.getItem('memoryGameConfig')
    return data ? JSON.parse(data) : {
        tarjetas: '9',
        dificultad: 'baja'
    }
}

/**
 * Crea el tablero de juego basado en el número de tarjetas
 * @param {number} numTarjetas - Número de tarjetas para el juego
 */
const crearTablero = (numTarjetas) => {
    const container = $("memory-game-table")
    if (!container) return console.error("No se encontró el contenedor");

    // Limpiar contenedor
    container.innerHTML = 'asdfas'

    // Calcular dimensiones del grid
    const dimension = Math.sqrt(numTarjetas)
    
    // Crear el tablero
    const tablero = document.createElement('div')
    tablero.id = 'tablero'
    tablero.style.display = 'grid'
    tablero.style.gridTemplateColumns = `repeat(${dimension}, 1fr)`
    tablero.style.gap = '10px'
    tablero.style.maxWidth = '400px'
    tablero.style.margin = '0 auto'

    // Crear las tarjetas
    for (let i = 0; i < numTarjetas; i++) {
        const tarjeta = document.createElement('div')
        tarjeta.className = 'tarjeta'
        tarjeta.dataset.id = i.toString()
        
        // Crear estructura interna para animación de volteo
        const tarjetaInner = document.createElement('div')
        tarjetaInner.className = 'tarjeta-inner'
        
        const tarjetaFront = document.createElement('div')
        tarjetaFront.className = 'tarjeta-front'
        
        const tarjetaBack = document.createElement('div')
        tarjetaBack.className = 'tarjeta-back'
        tarjetaBack.textContent = '★'
        
        tarjetaInner.appendChild(tarjetaFront)
        tarjetaInner.appendChild(tarjetaBack)
        tarjeta.appendChild(tarjetaInner)
        
        // Agregar evento de click
        tarjeta.addEventListener('click', () => voltearTarjeta(tarjeta))
        
        tablero.appendChild(tarjeta)
    }

    container.appendChild(tablero)
};

/**
 * Voltea una tarjeta
 * @param {HTMLElement} tarjeta - La tarjeta a voltear
 */
const voltearTarjeta = (tarjeta) => {
    if (tarjeta.classList.contains('volteada') || tarjeta.classList.contains('matched')) return
    
    tarjeta.classList.add('volteada')
}

/**
 * Muestra la información del personaje seleccionado
 * @param {string} avatar - El avatar seleccionado
 */
const mostrarPersonaje = (avatar, nick) => {
    const personajeArticle = $("player")
    if (!personajeArticle) return

    personajeArticle.innerHTML = `
        <img src="images/avatars/${avatar}.png" alt="Avatar">
        <p id="nick">${nick}</p>
    `
}

/**
 * Inicializa el juego cuando se carga la página
 */
const inicializarJuego = () => {
    const playerData = getPlayerData()
    const gameConfig = getGameConfig()
    const numTarjetas = parseInt(gameConfig.tarjetas)
    const { avatar, nick } = playerData
    const { dificultad } = gameConfig

    // Mostrar información del jugador
    mostrarPersonaje(avatar, nick)

    // Crear tablero
    crearTablero(numTarjetas)
    
    // Configurar botones
    const btnIniciar = $("iniciar")
    const btnReiniciar = $("reiniciar")
    const btnSalir = $("salir")

    if (btnIniciar) {
        btnIniciar.addEventListener('click', () => {
            crearTablero(numTarjetas)
            btnIniciar.style.display = 'none'
        })
    }

    if (btnReiniciar) {
        btnReiniciar.addEventListener('click', () => {
            crearTablero(numTarjetas)
        })
    }

    if (btnSalir) {
        btnSalir.addEventListener('click', () => {
            window.location.href = 'index.html'
        })
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarJuego)
} else {
    inicializarJuego()
}
