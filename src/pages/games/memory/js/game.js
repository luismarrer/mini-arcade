// @ts-check

/**
 * Este archivo contiene la lógica del juego
 */

import { $ } from './myjquery.js'
import { waitForElement } from './promises.js'
import { usarArtefacto as consumirArtefacto, getTextoArtefacto, reiniciarArtefactos, getArtefactoActivo, puedeUsarArtefacto } from './artefactos.js'

// Estado del juego
let tarjetasVolteadas = []
let bloqueado = false
let movimientosRestantes = 0
let puntuacion = 0
let movimientosMaximos = 0

/**
 * Promesa de conseguir el número máximo de movimientos
 * @returns {Promise<number>} Número máximo de movimientos
 */
const getMovimientosMaximos = async () => {
    // La sección de movimientos restantes
    const movimientosRestantesSection = $("movimientos-restantes")
    
    // Esperar a que el elemento <p> sea creado con el número máximo de movimientos
    const movimientosMaximosEncontrados = await waitForElement(movimientosRestantesSection, "p")

    // Convertir el número máximo de movimientos a entero
    const movimientosMaximos = parseInt(movimientosMaximosEncontrados)
    return movimientosMaximos
}

// Inicializar el contador de movimientos restantes con el máximo de movimientos pósibles. El máximo de movimientos posible sale de la promesa resuelta. 
getMovimientosMaximos().then(maxMovimientos => {
    movimientosMaximos = maxMovimientos
    movimientosRestantes = movimientosMaximos
})

/**
 * Actualiza el número de movimientos restantes
 * @param {number} movimientosRestantes - Número de movimientos restantes
 */
const actualizarMovimientosRestantes = (movimientosRestantes) => {
    const movimientosRestantesSection = $("movimientos-restantes")
    if (!movimientosRestantesSection) return
    movimientosRestantesSection.innerHTML = `
        <h2>Movimientos restantes</h2>
        <p>${movimientosRestantes}</p>
    `
}

/**
 * Actualiza la puntuación
 * @param {number} puntuacion - Puntuación
 */
const actualizarPuntuacion = (puntuacion) => {
    const puntuacionSection = $("puntuacion")
    if (!puntuacionSection) return
    puntuacionSection.innerHTML = `
        <h2>Puntuación</h2>
        <p>${puntuacion}</p>
    `
}

/**
 * Usar artefacto seleccionado
 * @param {string} artefactoId - ID del artefacto a usar
 */
const usarArtefacto = (artefactoId) => {
    // Verificar si se puede usar el artefacto
    if (!puedeUsarArtefacto(artefactoId)) {
        alert('Este artefacto ya no tiene usos disponibles')
        return
    }
    
    // Consumir el uso del artefacto
    const exito = consumirArtefacto(artefactoId)
    if (!exito) {
        console.warn(`No se pudo usar el artefacto: ${artefactoId}`)
        return
    }
    
    // Ejecutar la funcionalidad del artefacto
    switch (artefactoId) {
        case 'destapar-todas':
            destaparTodasLasTarjetas()
            break
        case 'mas-turnos':
            agregarMasTurnos()
            break
        default:
            console.warn(`Artefacto desconocido: ${artefactoId}`)
    }
    
    // Actualizar la UI del botón de artefacto
    actualizarBotonArtefacto()
}

/**
 * Destapa todas las tarjetas temporalmente
 */
const destaparTodasLasTarjetas = () => {
    const tarjetas = document.querySelectorAll('.tarjeta:not(.matched)')
    
    // Mostrar todas las tarjetas por 3 segundos
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
 * Agrega más turnos al juego
 */
const agregarMasTurnos = () => {
    const turnosExtra = 5
    movimientosRestantes += turnosExtra
    actualizarMovimientosRestantes(movimientosRestantes)
    alert(`¡Has ganado ${turnosExtra} movimientos adicionales!`)
}

/**
 * Voltea una tarjeta
 * @param {HTMLElement} tarjeta - La tarjeta a voltear
 * @param {number} time - Tiempo en segundos que se espera antes de voltear las dos tarjetas volteadas
 */
const voltearTarjeta = (tarjeta, time) => {

    // No permitir voltear si el juego está bloqueado, la tarjeta ya está volteada o emparejada
    if (bloqueado || tarjeta.classList.contains('volteada') || tarjeta.classList.contains('matched')) return
    
    // Cada vez que se volte una tarjeta se resta un movimiento hasta llegar a 0
    if (movimientosRestantes <= 0) return alert('¡Has perdido!')
    movimientosRestantes--
    actualizarMovimientosRestantes(movimientosRestantes)

    // No permitir más de 2 tarjetas volteadas
    if (tarjetasVolteadas.length >= 2) return
    
    tarjeta.classList.add('volteada')
    tarjetasVolteadas.push(tarjeta)

    
    // Si hay 2 tarjetas volteadas, verificar si coinciden
    if (tarjetasVolteadas.length === 2) {
        verificarCoincidencia(time)
    }
}

/**
 * Verifica si las dos tarjetas volteadas coinciden
 * @param {number} time - Tiempo en segundos que se espera antes de voltear las dos tarjetas volteadas
 */
const verificarCoincidencia = (time) => {
    bloqueado = true
    const [tarjeta1, tarjeta2] = tarjetasVolteadas
    
    // Verificar si las tarjetas tienen el mismo contenido
    const coinciden = tarjeta1.dataset.content === tarjeta2.dataset.content
    
    setTimeout(() => {
        if (coinciden) {
            // Marcar como emparejadas
            tarjeta1.classList.add('matched')
            tarjeta2.classList.add('matched')
            puntuacion++
            actualizarPuntuacion(puntuacion)
        } else {
            // Voltear de vuelta
            tarjeta1.classList.remove('volteada')
            tarjeta2.classList.remove('volteada')
        }
        
        // Resetear estado
        tarjetasVolteadas = []
        bloqueado = false
        
        // Verificar si el juego ha terminado
        verificarFinDelJuego()
    }, time) // Esperar time segundos antes de resetear
}

/**
 * Verifica si todas las tarjetas han sido emparejadas
 */
const verificarFinDelJuego = () => {
    const todasLasTarjetas = document.querySelectorAll('.tarjeta')
    const tarjetasEmparejadas = document.querySelectorAll('.tarjeta.matched')
    
    if (todasLasTarjetas.length === tarjetasEmparejadas.length) {
        setTimeout(() => {
            alert('¡Felicidades! Has completado el juego.')
        }, 500)
    }
}

/**
 * Actualiza el botón de artefacto con el estado actual
 */
const actualizarBotonArtefacto = () => {
    const botonArtefacto = /** @type {HTMLButtonElement} */ (document.getElementById('artefacto'))
    if (!botonArtefacto) return
    
    const artefactoActivo = getArtefactoActivo()
    if (!artefactoActivo) {
        // No hay artefactos disponibles, ocultar o deshabilitar el botón
        botonArtefacto.disabled = true
        botonArtefacto.textContent = 'Sin artefactos disponibles'
        return
    }
    
    // Actualizar el texto del botón
    botonArtefacto.textContent = getTextoArtefacto(artefactoActivo.id)
    botonArtefacto.disabled = !puedeUsarArtefacto(artefactoActivo.id)
}

/**
 * Reinicia el estado del juego
 */
const reiniciarJuego = async () => {
    // Resetear variables de estado
    tarjetasVolteadas = []
    bloqueado = false
    puntuacion = 0
    
    // Resetear contador de movimientos restantes a movimientos máximos
    movimientosRestantes = movimientosMaximos
    
    // Reiniciar artefactos
    reiniciarArtefactos()
    
    // Actualizar la interfaz
    actualizarMovimientosRestantes(movimientosRestantes)
    actualizarPuntuacion(puntuacion)
    actualizarBotonArtefacto()
}


export { voltearTarjeta, reiniciarJuego, usarArtefacto}
