// @ts-check

/**
 * Objeto para manejar la información del juego
 */
const gameInfo = {
    /**
     * Guarda la configuración del juego en sessionStorage
     * @param {Object} config - Configuración del juego
     * @param {string} config.tarjetas - Número de tarjetas
     * @param {string} config.dificultad - Nivel de dificultad
     */
    saveConfig: (config) => {
        sessionStorage.setItem('memoryGameConfig', JSON.stringify(config))
    },

    /**
     * Carga la configuración del juego desde sessionStorage
     * @returns {Object} Configuración del juego
     */
    loadConfig: () => {
        const data = sessionStorage.getItem('memoryGameConfig')
        return data ? JSON.parse(data) : {
            tarjetas: '9',
            dificultad: 'baja'
        }
    },

    /**
     * Obtiene el tiempo límite basado en la dificultad
     * @param {string} dificultad - Nivel de dificultad
     * @returns {number} Tiempo en segundos
     */
    getTiempoLimite: (dificultad) => {
        const tiempos = {
            baja: 120,    // 2 minutos
            media: 90,    // 1.5 minutos
            alta: 60      // 1 minuto
        }
        return tiempos[dificultad] || tiempos.baja
    },

    /**
     * Obtiene la puntuación base según la dificultad
     * @param {string} dificultad - Nivel de dificultad
     * @returns {number} Puntuación base
     */
    getPuntuacionBase: (dificultad) => {
        const puntuaciones = {
            baja: 100,
            media: 200,
            alta: 300
        }
        return puntuaciones[dificultad] || puntuaciones.baja
    },

    /**
     * Calcula la puntuación final basada en tiempo y movimientos
     * @param {string} dificultad - Nivel de dificultad
     * @param {number} tiempoUsado - Tiempo usado en segundos
     * @param {number} movimientos - Número de movimientos realizados
     * @returns {number} Puntuación final
     */
    calcularPuntuacion: (dificultad, tiempoUsado, movimientos) => {
        const base = gameInfo.getPuntuacionBase(dificultad)
        const tiempoLimite = gameInfo.getTiempoLimite(dificultad)
        
        // Bonus por tiempo restante
        const bonusTiempo = Math.max(0, (tiempoLimite - tiempoUsado) * 10)
        
        // Penalización por movimientos extra
        const movimientosOptimos = parseInt(gameInfo.loadConfig().tarjetas) / 2
        const penalizacionMovimientos = Math.max(0, (movimientos - movimientosOptimos) * 5)
        
        return Math.max(0, base + bonusTiempo - penalizacionMovimientos)
    },

    /**
     * Limpia la configuración del juego del sessionStorage
     */
    clearConfig: () => {
        sessionStorage.removeItem('memoryGameConfig')
    }
}

/**
 * Inicializa la captura de configuración del juego desde el formulario
 */
const initGameConfigCapture = () => {
    const form = document.querySelector('form')
    if (!form) return console.error("No se encontró el formulario")

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        // Capturar configuración del juego
        const formData = new FormData(form)
        const gameConfig = {
            tarjetas: String(formData.get('tarjetas') || '9'),
            dificultad: String(formData.get('dificultad') || 'baja')
        }

        // Guardar configuración del juego
        gameInfo.saveConfig(gameConfig)
    })
}

// Inicializar captura de configuración si estamos en index.html
if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGameConfigCapture)
    } else {
        initGameConfigCapture()
    }
}