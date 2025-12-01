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

export { gameInfo }
