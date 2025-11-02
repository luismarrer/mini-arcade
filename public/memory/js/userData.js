// @ts-check

/**
 * Object to handle user data
 */
const userData = {
    /**
     * Saves player data to sessionStorage
     * @param {Object} data - Player data
     * @param {string} data.nick - Player name
     * @param {string} data.avatar - Selected avatar
     */
    save: (data) => {
        sessionStorage.setItem('memoryGamePlayer', JSON.stringify(data))
    },

    /**
     * Loads player data from sessionStorage
     * @returns {Object|null} Player data or null if it doesn't exist
     */
    load: () => {
        const data = sessionStorage.getItem('memoryGamePlayer')
        return data ? JSON.parse(data) : null
    },

    /**
     * Clears player data from sessionStorage
     */
    clear: () => {
        sessionStorage.removeItem('memoryGamePlayer')
    }
}

/**
 * Initializes form data capture on index.html
 */
const initFormCapture = () => {
    const form = document.querySelector('form')
    if (!form) return

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        
        // Capture form data
        const formData = new FormData(form)
        const playerData = {
            nick: String(formData.get('nick') || 'Player'),
            avatar: String(formData.get('avatar') || 'batman')
        }

        // Save to sessionStorage
        userData.save(playerData)
        
        // Navigate to game.html
        window.location.href = 'game.html'
    })
}

// Initialize form capture if we are on index.html
if (window.location.pathname.includes('index.html') || window.location.pathname.endsWith('/')) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFormCapture)
    } else {
        initFormCapture()
    }
}
