// @ts-check

/**
 * This file initializes the game
 */

import { $ } from './myjquery.js'
import { voltearTarjeta, reiniciarJuego, usarArtefacto } from './game.js'
import { gameInfo } from './gameInfo.js'
import { inicializarEstadoArtefactos, getArtefactoActivo, getTextoArtefacto, puedeUsarArtefacto } from './artefactos.js'

/**
 * Gets player data from sessionStorage
 * @returns {Object} The player data
 */
const getPlayerData = () => {
    const data = sessionStorage.getItem('memoryGamePlayer')
    return data ? JSON.parse(data) : {
        nick: 'Player',
        avatar: 'batman'
    }
}

/**
 * Gets game configuration from sessionStorage
 * @returns {Object} The game configuration
 */
const getGameConfig = () => {
    const data = sessionStorage.getItem('memoryGameConfig')
    return data ? JSON.parse(data) : {
        tarjetas: '12',
        dificultad: 'baja'
    }
}

/**
 * Gets the time limit based on difficulty
 * @param {string} dificultad - Difficulty level
 * @returns {number} Time in milliseconds
 */
const getTiempoLimite = (dificultad) => {
    const tiempos = {
        baja: 2000,    // 2 seconds
        media: 1000,    // 1 second
        alta: 500      // 0.5 seconds
    }
    return tiempos[dificultad] || tiempos.baja
}

/**
 * Gets the maximum number of moves based on difficulty and number of cards
 * @param {string} dificultad - Difficulty level
 * @param {number} numTarjetas - Number of cards for the game
 * @returns {number} Maximum number of moves
 */
const getMovimientosMaximos = (dificultad, numTarjetas) => {

    const pares = numTarjetas / 2

    const multipliers = {
        baja: 5,
        media: 4,
        alta: 3 
    }

    const movimientosMaximos = pares * multipliers[dificultad] || pares * multipliers.baja
    return Math.floor(movimientosMaximos)
}

/**
 * Gets the selected artifact ID from configuration
 * @returns {string|null} Selected artifact ID or null
 */
const getArtefactoSeleccionado = () => {
    const config = gameInfo.loadConfig()
    const artefactos = config.artefactos
    
    if (!artefactos || artefactos === '0') return null
    return artefactos
}

/**
 * Displays the selected character information
 * @param {string} avatar - The selected avatar
 * @param {string} nick - The player's nickname
 */
const mostrarPersonaje = (avatar, nick) => {
    const personajeArticle = $("player")
    if (!personajeArticle) return

    personajeArticle.innerHTML = `
        <img src="/images/memory/avatars/${avatar}.avif" alt="Avatar ${avatar} for ${nick}" width="100">
        <h2 id="nick">${nick}</h2>
    `
}

/**
 * Displays the number of remaining moves
 * @param {number} movimientosRestantes - Number of remaining moves
 */
const mostrarMovimientosRestantes = (movimientosRestantes) => {
    const movimientosRestantesSection = $("movimientos-restantes")
    if (!movimientosRestantesSection) return
    movimientosRestantesSection.innerHTML = `
        <h2>Remaining moves</h2>
        <p>${movimientosRestantes}</p>
    `
}

/**
 * Creates the board cards
 * @param {number} numTarjetas - Number of cards for the game
 * @param {HTMLElement} tablero - The board where cards will be created
 * @param {number} time - Time in seconds to wait before flipping the two flipped cards
 */
const crearTarjetas = (numTarjetas, tablero, time) => {
    if (!tablero) return console.error("Board not found")
    
    // Array of available images for cards
    const imagenes_tarjetas = [
        'alfred-pennyworth', 'bane', 'batwoman', 'bizarro', 'brainiac',
        'doomsday', 'krypto', 'lex-luthor', 'lois-lane', 'nightwing',
        'riddler', 'robin', 'scarecrow', 'the-joker', 'two-face'
    ]
    
    // Create pairs of cards
    const pares = []
    const numPares = numTarjetas / 2
    
    // Select random images for pairs
    const imagenesSeleccionadas = [...imagenes_tarjetas].sort(() => Math.random() - 0.5).slice(0, numPares)
    
    // Create array with duplicate pairs
    imagenesSeleccionadas.forEach(imagen => {
        pares.push(imagen, imagen)
    })
    
    // Shuffle the cards
    const tarjetasMezcladas = pares.sort(() => Math.random() - 0.5)
    
    for (let i = 0; i < numTarjetas; i++) {
        const tarjeta = document.createElement('div')
        tarjeta.className = 'tarjeta'
        tarjeta.dataset.id = i.toString()
        tarjeta.dataset.content = tarjetasMezcladas[i]
        
        // Create internal structure for flip animation
        const tarjetaInner = document.createElement('div')
        tarjetaInner.className = 'tarjeta-inner'
        
        const tarjetaFront = document.createElement('div')
        tarjetaFront.className = 'tarjeta-front'
        
        const tarjetaBack = document.createElement('div')
        tarjetaBack.className = 'tarjeta-back'
        
        // Add image to the back of the card
        const imagen = document.createElement('img')
        imagen.src = `/images/memory/cards/${tarjetasMezcladas[i]}.avif`
        imagen.alt = tarjetasMezcladas[i]
        imagen.style.width = '100%'
        imagen.style.height = '100%'
        imagen.style.objectFit = 'cover'
        tarjetaBack.appendChild(imagen)
        
        tarjetaInner.appendChild(tarjetaFront)
        tarjetaInner.appendChild(tarjetaBack)
        tarjeta.appendChild(tarjetaInner)
        
        // Add click event
        tarjeta.addEventListener('click', () => voltearTarjeta(tarjeta, time))
        
        tablero.appendChild(tarjeta)
    }
}

/**
 * Initializes the artifact system if one was selected
 */
const inicializarArtefacto = () => {
    const artefactoSeleccionadoId = getArtefactoSeleccionado()
    if (!artefactoSeleccionadoId) return
    
    // Initialize artifact state
    inicializarEstadoArtefactos(artefactoSeleccionadoId)
    
    // Get active artifact
    const artefactoActivo = getArtefactoActivo()
    if (!artefactoActivo) return
    
    // Create use artifact button
    const artefactoButton = document.createElement('button')
    artefactoButton.id = 'artefacto'
    artefactoButton.textContent = getTextoArtefacto(artefactoActivo.id)
    
    artefactoButton.addEventListener('click', () => {
        if (puedeUsarArtefacto(artefactoActivo.id)) {
            usarArtefacto(artefactoActivo.id)
        }
    })

    // Add artifact button after exit button
    const buttonSalir = $("salir")
    if (buttonSalir) {
        buttonSalir.parentNode?.insertBefore(artefactoButton, buttonSalir.nextSibling)
    }
}

/**
 * Creates the game board based on the number of cards
 * @param {number} numTarjetas - Number of cards for the game
 * @param {string} dificultad - Game difficulty (baja, media, alta). Used to calculate card visibility time.
 */
const crearTablero = (numTarjetas, dificultad) => {
    const container = $("memory-game-table")
    if (!container) return console.error("Container not found")

    // Clear container
    container.innerHTML = ''

    // Calculate grid dimensions
    const dimension = Math.round(Math.sqrt(numTarjetas))
    
    // Create board
    const tablero = document.createElement('div')
    tablero.id = 'tablero'
    tablero.style.display = 'grid'
    tablero.style.gridTemplateColumns = `repeat(${dimension}, 1fr)`
    tablero.style.gap = '10px'
    tablero.style.maxWidth = '400px'
    tablero.style.margin = '0 auto'

    // Calculate card visibility time
    const time = getTiempoLimite(dificultad)

    // Create cards
    crearTarjetas(numTarjetas, tablero, time)


    container.appendChild(tablero)
}

/**
 * Initializes the game
 */
const inicializarJuego = () => {
    const playerData = getPlayerData()
    const gameConfig = getGameConfig()
    const numTarjetas = parseInt(gameConfig.tarjetas)
    const { avatar, nick } = playerData
    const { dificultad } = gameConfig

    // Calculate maximum number of moves
    const movimientosMaximos = getMovimientosMaximos(dificultad, numTarjetas)

    // Display player information
    mostrarPersonaje(avatar, nick)
    mostrarMovimientosRestantes(movimientosMaximos)

    // Create board
    crearTablero(numTarjetas, dificultad)
    
    // Configure buttons
    const btnReiniciar = $("reiniciar")
    const btnSalir = $("salir")

    if (btnReiniciar) {
        btnReiniciar.addEventListener('click', async () => {
            await reiniciarJuego()
            crearTablero(numTarjetas, dificultad)
        })
    }

    // Initialize artifact system
    inicializarArtefacto()
    // 
}

// Expose manual initializer for React island
// eslint-disable-next-line no-undef
window.MemoryGame = {
    init: inicializarJuego,
}
