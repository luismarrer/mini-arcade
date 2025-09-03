// Estado del juego
let tarjetasVolteadas = []
let bloqueado = false

/**
 * Voltea una tarjeta
 * @param {HTMLElement} tarjeta - La tarjeta a voltear
 * @param {number} time - Tiempo en segundos que se espera antes de voltear las dos tarjetas volteadas
 */
const voltearTarjeta = (tarjeta, time) => {

    // No permitir voltear si el juego está bloqueado, la tarjeta ya está volteada o emparejada
    if (bloqueado || tarjeta.classList.contains('volteada') || tarjeta.classList.contains('matched')) return
    
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

export { voltearTarjeta }
