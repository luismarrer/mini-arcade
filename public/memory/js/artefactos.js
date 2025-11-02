// @ts-check

/**
 * Artifact management system for the memory game
 */

/**
 * @typedef {Object} Artefacto
 * @property {string} id - Unique identifier of the artifact
 * @property {string} nombre - Descriptive name of the artifact
 * @property {string} descripcion - Description of what the artifact does
 * @property {number} usosMaximos - Maximum number of uses allowed
 * @property {number} usosRestantes - Number of remaining uses
 * @property {boolean} activo - If the artifact is available to use
 */

/**
 * Definition of all available artifacts
 */
const ARTEFACTOS_DISPONIBLES = {
    'destapar-todas': {
        id: 'destapar-todas',
        nombre: 'Reveal all cards',
        descripcion: 'Shows all cards for 3 seconds',
        usosMaximos: 1,
        usosRestantes: 1,
        activo: true
    },
    'mas-turnos': {
        id: 'mas-turnos',
        nombre: 'More turns',
        descripcion: 'Adds 5 additional moves',
        usosMaximos: 2,
        usosRestantes: 2,
        activo: true
    }
}

/**
 * Current state of player artifacts
 */
let estadoArtefactos = {}

/**
 * Initializes artifact state based on game configuration
 * @param {string} artefactoSeleccionado - ID of the selected artifact in configuration
 */
const inicializarEstadoArtefactos = (artefactoSeleccionado) => {
    // Clear previous state
    estadoArtefactos = {}
    
    // If no artifact selected, do nothing
    if (!artefactoSeleccionado || artefactoSeleccionado === '0') {
        return
    }
    
    // Initialize the selected artifact
    if (ARTEFACTOS_DISPONIBLES[artefactoSeleccionado]) {
        estadoArtefactos[artefactoSeleccionado] = {
            ...ARTEFACTOS_DISPONIBLES[artefactoSeleccionado]
        }
    }
}

/**
 * Gets the player's active artifact
 * @returns {Artefacto|null} The active artifact or null if there is none
 */
const getArtefactoActivo = () => {
    const artefactosActivos = Object.values(estadoArtefactos).filter(artefacto => 
        artefacto.activo && artefacto.usosRestantes > 0
    )
    
    return artefactosActivos.length > 0 ? artefactosActivos[0] : null
}

/**
 * Uses an artifact, reducing its remaining uses
 * @param {string} artefactoId - ID of the artifact to use
 * @returns {boolean} true if the artifact could be used, false otherwise
 */
const usarArtefacto = (artefactoId) => {
    const artefacto = estadoArtefactos[artefactoId]
    
    // Reduce remaining uses
    artefacto.usosRestantes--
    
    // If no uses left, deactivate the artifact
    if (artefacto.usosRestantes <= 0) {
        artefacto.activo = false
    }
    
    return true
}

/**
 * Gets information about a specific artifact
 * @param {string} artefactoId - ID of the artifact
 * @returns {Artefacto|null} Artifact information or null if it doesn't exist
 */
const getInfoArtefacto = (artefactoId) => {
    return estadoArtefactos[artefactoId] || null
}

/**
 * Checks if an artifact can be used
 * @param {string} artefactoId - ID of the artifact
 * @returns {boolean} true if the artifact can be used
 */
const puedeUsarArtefacto = (artefactoId) => {
    const artefacto = estadoArtefactos[artefactoId]
    return artefacto && artefacto.activo && artefacto.usosRestantes > 0
}

/**
 * Resets the state of all artifacts to their initial state
 */
const reiniciarArtefactos = () => {
    Object.keys(estadoArtefactos).forEach(artefactoId => {
        const artefactoOriginal = ARTEFACTOS_DISPONIBLES[artefactoId]
        if (artefactoOriginal) {
            estadoArtefactos[artefactoId] = {
                ...artefactoOriginal
            }
        }
    })
}

/**
 * Gets the complete state of artifacts
 * @returns {Object} Current state of all artifacts
 */
const getEstadoArtefactos = () => {
    return { ...estadoArtefactos }
}

/**
 * Gets the display text for an artifact (name + remaining uses)
 * @param {string} artefactoId - ID of the artifact
 * @returns {string} Text to display in the UI
 */
const getTextoArtefacto = (artefactoId) => {
    const artefacto = estadoArtefactos[artefactoId]
    if (!artefacto) return ''
    
    return `${artefacto.nombre} (${artefacto.usosRestantes})`
}

export {
    inicializarEstadoArtefactos,
    getArtefactoActivo,
    usarArtefacto,
    getInfoArtefacto,
    puedeUsarArtefacto,
    reiniciarArtefactos,
    getEstadoArtefactos,
    getTextoArtefacto,
    ARTEFACTOS_DISPONIBLES
}
