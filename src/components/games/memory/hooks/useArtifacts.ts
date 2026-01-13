import { useState, useCallback } from 'react'

export interface Artifact {
    id: string
    name: string
    description: string
    maxUses: number
    remainingUses: number
    active: boolean
}

const AVAILABLE_ARTIFACTS: Record<string, Artifact> = {
    'reveal-all': {
        id: 'reveal-all',
        name: 'Reveal all cards',
        description: 'Shows all cards for 3 seconds',
        maxUses: 1,
        remainingUses: 1,
        active: true,
    },
    'more-turns': {
        id: 'more-turns',
        name: 'More turns',
        description: 'Adds 5 additional moves',
        maxUses: 2,
        remainingUses: 2,
        active: true,
    },
}

export const useArtifacts = (selectedArtifactId: string | null) => {
    const [artifact, setArtifact] = useState<Artifact | null>(() => {
        if (!selectedArtifactId || selectedArtifactId === '0') return null
        
        const available = AVAILABLE_ARTIFACTS[selectedArtifactId]
        return available ? { ...available } : null
    })

    const canUseArtifact = useCallback(() => {
        return artifact !== null && artifact.active && artifact.remainingUses > 0
    }, [artifact])

    const useArtifact = useCallback(() => {
        if (!artifact || !canUseArtifact()) return false

        setArtifact((prev) => {
            if (!prev) return null
            
            const newUsesRemaining = prev.remainingUses - 1
            return {
                ...prev,
                remainingUses: newUsesRemaining,
                active: newUsesRemaining > 0,
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
        return `${artifact.name} (${artifact.remainingUses}/${artifact.maxUses})`
    }, [artifact])

    return {
        artifact,
        canUseArtifact,
        useArtifact,
        resetArtifact,
        getArtifactText,
    }
}
