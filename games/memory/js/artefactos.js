// @ts-check

/**
 * Sistema de gestión de artefacto para el juego de memoria
 */

/**
 * @typedef {Object} Artefacto
 * @property {string} id - Identificador único del artefacto
 * @property {string} nombre - Nombre descriptivo del artefacto
 * @property {string} descripcion - Descripción de lo que hace el artefacto
 * @property {number} usosMaximos - Número máximo de usos permitidos
 * @property {number} usosRestantes - Número de usos restantes
 * @property {boolean} activo - Si el artefacto está disponible para usar
 */

/**
 * Definición de todos los artefactos disponibles
 */
const ARTEFACTOS_DISPONIBLES = {
    'destapar-todas': {
        id: 'destapar-todas',
        nombre: 'Destapar todas las cartas',
        descripcion: 'Muestra todas las cartas por 3 segundos',
        usosMaximos: 1,
        usosRestantes: 1,
        activo: true
    },
    'mas-turnos': {
        id: 'mas-turnos',
        nombre: 'Más turnos',
        descripcion: 'Agrega 5 movimientos adicionales',
        usosMaximos: 2,
        usosRestantes: 2,
        activo: true
    }
}

/**
 * Estado actual de los artefactos del jugador
 */
let estadoArtefactos = {}

/**
 * Inicializa el estado de los artefactos basado en la configuración del juego
 * @param {string} artefactoSeleccionado - ID del artefacto seleccionado en la configuración
 */
const inicializarEstadoArtefactos = (artefactoSeleccionado) => {
    // Limpiar estado anterior
    estadoArtefactos = {}
    
    // Si no hay artefacto seleccionado, no hacer nada
    if (!artefactoSeleccionado || artefactoSeleccionado === '0') {
        return
    }
    
    // Inicializar el artefacto seleccionado
    if (ARTEFACTOS_DISPONIBLES[artefactoSeleccionado]) {
        estadoArtefactos[artefactoSeleccionado] = {
            ...ARTEFACTOS_DISPONIBLES[artefactoSeleccionado]
        }
    }
}

/**
 * Obtiene el artefacto activo del jugador
 * @returns {Artefacto|null} El artefacto activo o null si no hay ninguno
 */
const getArtefactoActivo = () => {
    const artefactosActivos = Object.values(estadoArtefactos).filter(artefacto => 
        artefacto.activo && artefacto.usosRestantes > 0
    )
    
    return artefactosActivos.length > 0 ? artefactosActivos[0] : null
}

/**
 * Usa un artefacto, reduciendo sus usos restantes
 * @param {string} artefactoId - ID del artefacto a usar
 * @returns {boolean} true si se pudo usar el artefacto, false en caso contrario
 */
const usarArtefacto = (artefactoId) => {
    const artefacto = estadoArtefactos[artefactoId]
    
    // Reducir usos restantes
    artefacto.usosRestantes--
    
    // Si no quedan usos, desactivar el artefacto
    if (artefacto.usosRestantes <= 0) {
        artefacto.activo = false
    }
    
    return true
}

/**
 * Obtiene información de un artefacto específico
 * @param {string} artefactoId - ID del artefacto
 * @returns {Artefacto|null} Información del artefacto o null si no existe
 */
const getInfoArtefacto = (artefactoId) => {
    return estadoArtefactos[artefactoId] || null
}

/**
 * Verifica si un artefacto puede ser usado
 * @param {string} artefactoId - ID del artefacto
 * @returns {boolean} true si el artefacto puede ser usado
 */
const puedeUsarArtefacto = (artefactoId) => {
    const artefacto = estadoArtefactos[artefactoId]
    return artefacto && artefacto.activo && artefacto.usosRestantes > 0
}

/**
 * Reinicia el estado de todos los artefactos a su estado inicial
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
 * Obtiene el estado completo de los artefactos
 * @returns {Object} Estado actual de todos los artefactos
 */
const getEstadoArtefactos = () => {
    return { ...estadoArtefactos }
}

/**
 * Obtiene el texto de display para un artefacto (nombre + usos restantes)
 * @param {string} artefactoId - ID del artefacto
 * @returns {string} Texto para mostrar en la UI
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
