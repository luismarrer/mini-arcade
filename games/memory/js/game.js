// @ts-check

/**
 * Este archivo contiene la lógica del juego
 */

import { $ } from './myjquery.js'
import { waitForElement } from './promises.js'

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
 * Actualiza la interfaz de artefactos disponibles
 */
// const actualizarArtefactos = () => {
//     const artefactosSelect = $("artefactos")
//     if (!artefactosSelect) return
    
//     // Agregar opciones disponibles
//     Object.entries(artefactosDisponibles).forEach(([tipo, cantidad]) => {
//         if (cantidad > 0) {
//             const option = document.createElement('option')
//             option.value = tipo
//             // option.textContent = `${getNombreArtefacto(tipo)} (${cantidad})`
//             artefactosSelect.appendChild(option)
//         }
//     })
// }

/**
 * Usar artefacto seleccionado
 */
const usarArtefacto = (tipo) => {

    // Ejecutar la funcionalidad del artefacto
    switch (tipo) {
        case 'Destapar todas las cartas':
            destaparTodasLasTarjetas()
            break
        case 'Destapar una carta':
            activarModoDestaparUna()
            break
        case 'Más turnos':
            agregarMasTurnos()
            break
        default:
            console.warn(`Artefacto desconocido: ${tipo}`)
    }
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
 * Activa el modo para destapar una tarjeta específica
 */
const activarModoDestaparUna = () => {
    const tarjetas = document.querySelectorAll('.tarjeta:not(.matched):not(.volteada)')
    
    if (tarjetas.length === 0) {
        alert('No hay tarjetas disponibles para destapar')
        return
    }

    // Agregar clase especial para indicar que se puede seleccionar
    tarjetas.forEach(tarjeta => {
        const htmlTarjeta = /** @type {HTMLElement} */ (tarjeta)
        htmlTarjeta.classList.add('seleccionable')
        htmlTarjeta.style.cursor = 'pointer'
        htmlTarjeta.style.border = '2px solid #ffeb3b'
    })

    // Crear función de manejo de clic temporal
    const manejarClicArtefacto = (event) => {
        const tarjeta = event.currentTarget
        
        // Remover listeners y estilos de todas las tarjetas
        tarjetas.forEach(t => {
            const htmlT = /** @type {HTMLElement} */ (t)
            htmlT.classList.remove('seleccionable')
            htmlT.style.cursor = ''
            htmlT.style.border = ''
            htmlT.removeEventListener('click', manejarClicArtefacto)
        })

        // Mostrar la tarjeta seleccionada por 2 segundos
        tarjeta.classList.add('volteada', 'artefacto-preview')
        setTimeout(() => {
            if (!tarjeta.classList.contains('matched')) {
                tarjeta.classList.remove('volteada', 'artefacto-preview')
            }
        }, 2000)
    }

    // Agregar listeners a todas las tarjetas seleccionables
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('click', manejarClicArtefacto)
    })

    alert('Haz clic en una tarjeta para destaparla temporalmente')
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
 * Reinicia el estado del juego
 */
const reiniciarJuego = async () => {
    // Resetear variables de estado
    tarjetasVolteadas = []
    bloqueado = false
    puntuacion = 0
    
    // Resetear contador de movimientos restantes a movimientos máximos
    movimientosRestantes = movimientosMaximos
    
    // Actualizar la interfaz
    actualizarMovimientosRestantes(movimientosRestantes)
    actualizarPuntuacion(puntuacion)
}


export { voltearTarjeta, reiniciarJuego, usarArtefacto}
