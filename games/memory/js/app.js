// @ts-check

/**
 * Este archivo inicializa el juego
 */

import { $ } from './myjquery.js'
import { voltearTarjeta } from './game.js'

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
        tarjetas: '10',
        dificultad: 'baja'
    }
}

/**
 * Obtiene el tiempo límite basado en la dificultad
 * @param {string} dificultad - Nivel de dificultad
 * @returns {number} Tiempo en milisegundos
 */
const getTiempoLimite = (dificultad) => {
    const tiempos = {
        baja: 2000,    // 2 segundos
        media: 1000,    // 1 segundo
        alta: 500      // 0.5 segundos
    }
    return tiempos[dificultad] || tiempos.baja
}

/**
 * Obtiene el número máximo de movimientos basado en la dificultad y el número de tarjetas
 * @param {string} dificultad - Nivel de dificultad
 * @param {number} numTarjetas - Número de tarjetas para el juego
 * @returns {number} Número máximo de movimientos
 */
const getMovimientosMaximos = (dificultad, numTarjetas) => {

    const pares = numTarjetas / 2

    const multipliers = {
        baja: 4,
        media: 3,
        alta: 2 
    }

    const movimientosMaximos = pares * multipliers[dificultad] || pares * multipliers.baja
    return Math.floor(movimientosMaximos)
}

/**
 * Muestra la información del personaje seleccionado
 * @param {string} avatar - El avatar seleccionado
 * @param {string} nick - El nick del jugador
 */
const mostrarPersonaje = (avatar, nick) => {
    const personajeArticle = $("player")
    if (!personajeArticle) return

    personajeArticle.innerHTML = `
        <img src="images/avatars/${avatar}.avif" alt="Avatar ${avatar} de ${nick}" width="100">
        <p id="nick">${nick}</p>
    `
}

const mostrarMovimientosRestantes = (movimientosRestantes) => {
    const movimientosRestantesSection = $("movimientos-restantes")
    if (!movimientosRestantesSection) return
    movimientosRestantesSection.innerHTML = `
        <h2>Movimientos restantes</h2>
        <p>${movimientosRestantes}</p>
    `
}

/**
 * Crea las tarjetas del tablero
 * @param {number} numTarjetas - Número de tarjetas para el juego
 * @param {HTMLElement} tablero - El tablero donde se crearán las tarjetas
 * @param {number} time - Tiempo en segundos que se espera antes de voltear las dos tarjetas volteadas
 */
const crearTarjetas = (numTarjetas, tablero, time) => {
    if (!tablero) return console.error("No se encontró el tablero")
    
    // Array de imágenes disponibles para las tarjetas
    const imagenes_tarjetas = [
        'alfred-pennyworth', 'bane', 'batwoman', 'bizarro', 'brainiac',
        'doomsday', 'krypto', 'lex-luthor', 'lois-lane', 'nightwing',
        'riddler', 'robin', 'scarecrow', 'the-joker', 'two-face'
    ]
    
    // Crear pares de tarjetas
    const pares = []
    const numPares = numTarjetas / 2
    
    // Seleccionar imágenes aleatorias para los pares
    const imagenesSeleccionadas = [...imagenes_tarjetas].sort(() => Math.random() - 0.5).slice(0, numPares)
    
    // Crear array con pares duplicados
    imagenesSeleccionadas.forEach(imagen => {
        pares.push(imagen, imagen)
    })
    
    // Mezclar las tarjetas
    const tarjetasMezcladas = pares.sort(() => Math.random() - 0.5)
    
    for (let i = 0; i < numTarjetas; i++) {
        const tarjeta = document.createElement('div')
        tarjeta.className = 'tarjeta'
        tarjeta.dataset.id = i.toString()
        tarjeta.dataset.content = tarjetasMezcladas[i]
        
        // Crear estructura interna para animación de volteo
        const tarjetaInner = document.createElement('div')
        tarjetaInner.className = 'tarjeta-inner'
        
        const tarjetaFront = document.createElement('div')
        tarjetaFront.className = 'tarjeta-front'
        
        const tarjetaBack = document.createElement('div')
        tarjetaBack.className = 'tarjeta-back'
        
        // Agregar imagen a la parte trasera de la tarjeta
        const imagen = document.createElement('img')
        imagen.src = `images/cards/${tarjetasMezcladas[i]}.avif`
        imagen.alt = tarjetasMezcladas[i]
        imagen.style.width = '100%'
        imagen.style.height = '100%'
        imagen.style.objectFit = 'cover'
        tarjetaBack.appendChild(imagen)
        
        tarjetaInner.appendChild(tarjetaFront)
        tarjetaInner.appendChild(tarjetaBack)
        tarjeta.appendChild(tarjetaInner)
        
        // Agregar evento de click
        tarjeta.addEventListener('click', () => voltearTarjeta(tarjeta, time))
        
        tablero.appendChild(tarjeta)
    }
}

/**
 * Crea el tablero de juego basado en el número de tarjetas
 * @param {number} numTarjetas - Número de tarjetas para el juego
 * @param {string} dificultad - Dificultad del juego (baja, media, alta). Se usa para calcular el tiempo de visibilidad de las tarjetas.
 */
const crearTablero = (numTarjetas, dificultad) => {
    const container = $("memory-game-table")
    if (!container) return console.error("No se encontró el contenedor")

    // Limpiar contenedor
    container.innerHTML = ''

    // Calcular dimensiones del grid
    const dimension = Math.round(Math.sqrt(numTarjetas))
    
    // Crear el tablero
    const tablero = document.createElement('div')
    tablero.id = 'tablero'
    tablero.style.display = 'grid'
    tablero.style.gridTemplateColumns = `repeat(${dimension}, 1fr)`
    tablero.style.gap = '10px'
    tablero.style.maxWidth = '400px'
    tablero.style.margin = '0 auto'

    // Calcular tiempo de visibilidad de las tarjetas
    const time = getTiempoLimite(dificultad)

    // Crear las tarjetas
    crearTarjetas(numTarjetas, tablero, time)


    container.appendChild(tablero)
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

    // Calcular número máximo de movimientos
    const movimientosMaximos = getMovimientosMaximos(dificultad, numTarjetas)

    // Mostrar información del jugador
    mostrarPersonaje(avatar, nick)
    mostrarMovimientosRestantes(movimientosMaximos)

    // Crear tablero
    crearTablero(numTarjetas, dificultad)
    
    // Configurar botones
    const btnReiniciar = $("reiniciar")
    const btnSalir = $("salir")

    if (btnReiniciar) {
        btnReiniciar.addEventListener('click', () => {
            crearTablero(numTarjetas, dificultad)
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
