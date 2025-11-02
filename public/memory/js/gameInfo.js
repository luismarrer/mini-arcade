// @ts-check

/**
 * Object to handle game information
 */
const gameInfo = {
    /**
     * Saves game configuration to sessionStorage
     * @param {Object} config - Game configuration
     * @param {string} config.tarjetas - Number of cards
     * @param {string} config.dificultad - Difficulty level
     */
    saveConfig: (config) => {
        sessionStorage.setItem('memoryGameConfig', JSON.stringify(config))
    },

    /**
     * Loads game configuration from sessionStorage
     * @returns {Object} Game configuration
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
     * Clears game configuration from sessionStorage
     */
    clearConfig: () => {
        sessionStorage.removeItem('memoryGameConfig')
    }
}

/**
 * Initializes game configuration capture from the form
 */
const initGameConfigCapture = () => {
    const form = document.querySelector('form')
    if (!form) return console.error("Form not found")

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        // Capture game configuration
        const formData = new FormData(form)
        const gameConfig = {
            tarjetas: String(formData.get('tarjetas') || '9'),
            dificultad: String(formData.get('dificultad') || 'baja'),
            artefactos: String(formData.get('artefactos') || '0')
        }

        // Save game configuration
        gameInfo.saveConfig(gameConfig)
    })
}

// Initialize configuration capture if we are on index.html
if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGameConfigCapture)
    } else {
        initGameConfigCapture()
    }
}

export { gameInfo }
