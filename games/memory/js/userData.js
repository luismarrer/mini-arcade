// @ts-check

/**
 * Objeto para manejar los datos del usuario
 */
const userData = {
    /**
     * Guarda los datos del jugador en sessionStorage
     * @param {Object} data - Datos del jugador
     * @param {string} data.nick - Nombre del jugador
     * @param {string} data.avatar - Avatar seleccionado
     */
    save: (data) => {
        sessionStorage.setItem('memoryGamePlayer', JSON.stringify(data))
    },

    /**
     * Carga los datos del jugador desde sessionStorage
     * @returns {Object|null} Datos del jugador o null si no existen
     */
    load: () => {
        const data = sessionStorage.getItem('memoryGamePlayer')
        return data ? JSON.parse(data) : null
    },

    /**
     * Limpia los datos del jugador del sessionStorage
     */
    clear: () => {
        sessionStorage.removeItem('memoryGamePlayer')
    }
}

/**
 * Inicializa la captura de datos del formulario en index.html
 */
const initFormCapture = () => {
    const form = document.querySelector('form')
    if (!form) return

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        
        // Capturar datos del formulario
        const formData = new FormData(form)
        const playerData = {
            nick: String(formData.get('nick') || 'Jugador'),
            avatar: String(formData.get('avatar') || 'batman')
        }

        // Guardar en sessionStorage
        userData.save(playerData)
        
        // Navegar a game.html
        window.location.href = 'game.html'
    })
}

// Inicializar captura de formulario si estamos en index.html
if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFormCapture)
    } else {
        initFormCapture()
    }
}
