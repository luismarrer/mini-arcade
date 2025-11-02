// @ts-check

/**
 * This file contains the game logic
 */

import { $ } from './myjquery.js'
import { waitForElement } from './promises.js'
import { usarArtefacto as consumirArtefacto, getTextoArtefacto, reiniciarArtefactos, getArtefactoActivo, puedeUsarArtefacto } from './artefactos.js'

// Game state
let tarjetasVolteadas = []
let bloqueado = false
let movimientosRestantes = 0
let puntuacion = 0
let movimientosMaximos = 0

/**
 * Promise to get the maximum number of moves
 * @returns {Promise<number>} Maximum number of moves
 */
const getMovimientosMaximos = async () => {
    // The remaining moves section
    const movimientosRestantesSection = $("movimientos-restantes")
    
    // Wait for the <p> element to be created with the maximum number of moves
    const movimientosMaximosEncontrados = await waitForElement(movimientosRestantesSection, "p")

    // Convert the maximum number of moves to integer
    const movimientosMaximos = parseInt(movimientosMaximosEncontrados)
    return movimientosMaximos
}

// Initialize the remaining moves counter with the maximum possible moves. The maximum possible moves come from the resolved promise. 
getMovimientosMaximos().then(maxMovimientos => {
    movimientosMaximos = maxMovimientos
    movimientosRestantes = movimientosMaximos
})

/**
 * Updates the number of remaining moves
 * @param {number} movimientosRestantes - Number of remaining moves
 */
const actualizarMovimientosRestantes = (movimientosRestantes) => {
    const movimientosRestantesSection = $("movimientos-restantes")
    if (!movimientosRestantesSection) return
    movimientosRestantesSection.innerHTML = `
        <h2>Remaining moves</h2>
        <p>${movimientosRestantes}</p>
    `
}

/**
 * Updates the score
 * @param {number} puntuacion - Score
 */
const actualizarPuntuacion = (puntuacion) => {
    const puntuacionSection = $("puntuacion")
    if (!puntuacionSection) return
    puntuacionSection.innerHTML = `
        <h2>Score</h2>
        <p>${puntuacion}</p>
    `
}

/**
 * Use selected artifact
 * @param {string} artefactoId - ID of the artifact to use
 */
const usarArtefacto = (artefactoId) => {
    // Check if the artifact can be used
    if (!puedeUsarArtefacto(artefactoId)) {
        alert('This artifact has no available uses left')
        return
    }
    
    // Consume the artifact use
    const exito = consumirArtefacto(artefactoId)
    if (!exito) {
        console.warn(`Could not use artifact: ${artefactoId}`)
        return
    }
    
    // Execute artifact functionality
    switch (artefactoId) {
        case 'destapar-todas':
            destaparTodasLasTarjetas()
            break
        case 'mas-turnos':
            agregarMasTurnos()
            break
        default:
            console.warn(`Unknown artifact: ${artefactoId}`)
    }
    
    // Update artifact button UI
    actualizarBotonArtefacto()
}

/**
 * Reveals all cards temporarily
 */
const destaparTodasLasTarjetas = () => {
    const tarjetas = document.querySelectorAll('.tarjeta:not(.matched)')
    
    // Show all cards for 3 seconds
    tarjetas.forEach(tarjeta => {
        tarjeta.classList.add('volteada', 'artefacto-preview')
    })

    setTimeout(() => {
        tarjetas.forEach(tarjeta => {
            if (!tarjeta.classList.contains('matched')) {
                tarjeta.classList.remove('volteada', 'artefacto-preview')
            }
        })
    }, 3000)
}

/**
 * Adds more turns to the game
 */
const agregarMasTurnos = () => {
    const turnosExtra = 5
    movimientosRestantes += turnosExtra
    actualizarMovimientosRestantes(movimientosRestantes)
    alert(`You've gained ${turnosExtra} additional moves!`)
}

/**
 * Flips a card
 * @param {HTMLElement} tarjeta - The card to flip
 * @param {number} time - Time in seconds to wait before flipping the two flipped cards
 */
const voltearTarjeta = (tarjeta, time) => {

    // Don't allow flipping if the game is locked, the card is already flipped or matched
    if (bloqueado || tarjeta.classList.contains('volteada') || tarjeta.classList.contains('matched')) return
    
    // Each time a card is flipped, a move is subtracted until reaching 0
    if (movimientosRestantes <= 0) return alert('You lost!')
    movimientosRestantes--
    actualizarMovimientosRestantes(movimientosRestantes)

    // Don't allow more than 2 cards flipped
    if (tarjetasVolteadas.length >= 2) return
    
    tarjeta.classList.add('volteada')
    tarjetasVolteadas.push(tarjeta)

    
    // If there are 2 cards flipped, check if they match
    if (tarjetasVolteadas.length === 2) {
        verificarCoincidencia(time)
    }
}

/**
 * Checks if the two flipped cards match
 * @param {number} time - Time in seconds to wait before flipping the two flipped cards
 */
const verificarCoincidencia = (time) => {
    bloqueado = true
    const [tarjeta1, tarjeta2] = tarjetasVolteadas
    
    // Check if cards have the same content
    const coinciden = tarjeta1.dataset.content === tarjeta2.dataset.content
    
    setTimeout(() => {
        if (coinciden) {
            // Mark as matched
            tarjeta1.classList.add('matched')
            tarjeta2.classList.add('matched')
            puntuacion++
            actualizarPuntuacion(puntuacion)
        } else {
            // Flip back
            tarjeta1.classList.remove('volteada')
            tarjeta2.classList.remove('volteada')
        }
        
        // Reset state
        tarjetasVolteadas = []
        bloqueado = false
        
        // Check if the game is over
        verificarFinDelJuego()
    }, time) // Wait time seconds before resetting
}

/**
 * Checks if all cards have been matched
 */
const verificarFinDelJuego = () => {
    const todasLasTarjetas = document.querySelectorAll('.tarjeta')
    const tarjetasEmparejadas = document.querySelectorAll('.tarjeta.matched')
    
    if (todasLasTarjetas.length === tarjetasEmparejadas.length) {
        setTimeout(() => {
            alert('Congratulations! You completed the game.')
        }, 500)
    }
}

/**
 * Updates the artifact button with the current state
 */
const actualizarBotonArtefacto = () => {
    const botonArtefacto = /** @type {HTMLButtonElement} */ (document.getElementById('artefacto'))
    if (!botonArtefacto) return
    
    const artefactoActivo = getArtefactoActivo()
    if (!artefactoActivo) {
        // No artifacts available, hide or disable button
        botonArtefacto.disabled = true
        botonArtefacto.textContent = 'No artifacts available'
        return
    }
    
    // Update button text
    botonArtefacto.textContent = getTextoArtefacto(artefactoActivo.id)
    botonArtefacto.disabled = !puedeUsarArtefacto(artefactoActivo.id)
}

/**
 * Resets the game state
 */
const reiniciarJuego = async () => {
    // Reset state variables
    tarjetasVolteadas = []
    bloqueado = false
    puntuacion = 0
    
    // Reset remaining moves counter to maximum moves
    movimientosRestantes = movimientosMaximos
    
    // Reset artifacts
    reiniciarArtefactos()
    
    // Update interface
    actualizarMovimientosRestantes(movimientosRestantes)
    actualizarPuntuacion(puntuacion)
    actualizarBotonArtefacto()
}


export { voltearTarjeta, reiniciarJuego, usarArtefacto}
