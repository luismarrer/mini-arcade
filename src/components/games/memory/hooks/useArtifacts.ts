import { useState, useCallback } from 'react'

export interface Artifact {
    id: string
    nombre: string
    descripcion: string
    usosMaximos: number
    usosRestantes: number
    activo: boolean
}

const AVAILABLE_ARTIFACTS: Record<string, Artifact> = {
    'destapar-todas': {
        id: 'destapar-todas',
        nombre: 'Reveal all cards',
        descripcion: 'Shows all cards for 3 seconds',
        usosMaximos: 1,
        usosRestantes: 1,
        activo: true,
    },
    'mas-turnos': {
        id: 'mas-turnos',
        nombre: 'More turns',
        descripcion: 'Adds 5 additional moves',
        usosMaximos: 2,
        usosRestantes: 2,
        activo: true,
    },
}

export const useArtifacts = (selectedArtifactId: string | null) => {
    const [artifact, setArtifact] = useState<Artifact | null>(() => {
        if (!selectedArtifactId || selectedArtifactId === '0') return null
        
        const available = AVAILABLE_ARTIFACTS[selectedArtifactId]
        return available ? { ...available } : null
    })

    const canUseArtifact = useCallback(() => {
        return artifact !== null && artifact.activo && artifact.usosRestantes > 0
    }, [artifact])

    const useArtifact = useCallback(() => {
        if (!artifact || !canUseArtifact()) return false

        setArtifact((prev) => {
            if (!prev) return null
            
            const newUsesRemaining = prev.usosRestantes - 1
            return {
                ...prev,
                usosRestantes: newUsesRemaining,
                activo: newUsesRemaining > 0,
            }
        })

        return true
    }, [artifact, canUseArtifact])

    const resetArtifact = useCallback(() => {
        if (!selectedArtifactId || selectedArtifactId === '0') {
            setArtifact(null)
            return
        }

        const available = AVAILABLE_ARTIFACTS[selectedArtifactId]
        if (available) {
            setArtifact({ ...available })
        }
    }, [selectedArtifactId])

    const getArtifactText = useCallback(() => {
        if (!artifact) return 'No artifacts available'
        return `${artifact.nombre} (${artifact.usosRestantes}/${artifact.usosMaximos})`
    }, [artifact])

    return {
        artifact,
        canUseArtifact,
        useArtifact,
        resetArtifact,
        getArtifactText,
    }
}
