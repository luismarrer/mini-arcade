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
            dificultad: 'baja',
            artefactos: '0'
        }
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
            dificultad: String(formData.get('dificultad') || 'baja'),
            artefactos: String(formData.get('artefactos') || '0')
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

export { gameInfo }
