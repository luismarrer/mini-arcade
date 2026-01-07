import type { FC } from 'react'
import type { Artifact } from './hooks/useArtifacts'

interface GameControlsProps {
    onRestart: () => void
    onBack: () => void
    artifact: Artifact | null
    canUseArtifact: boolean
    onUseArtifact: () => void
    getArtifactText: () => string
}

const GameControls: FC<GameControlsProps> = ({
    onRestart,
    onBack,
    artifact,
    canUseArtifact,
    onUseArtifact,
    getArtifactText,
}) => {
    return (
        <nav className="mt-4 flex gap-4 justify-end flex-wrap">
            <button
                type="button"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                onClick={onRestart}
            >
                Restart Game
            </button>

            {artifact && (
                <button
                    type="button"
                    className={`px-4 py-2 rounded text-white transition-colors ${
                        canUseArtifact
                            ? 'bg-purple-600 hover:bg-purple-700'
                            : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    onClick={onUseArtifact}
                    disabled={!canUseArtifact}
                >
                    {getArtifactText()}
                </button>
            )}

            <button
                type="button"
                className="px-4 py-2 rounded bg-slate-500 text-white hover:bg-slate-600 transition-colors"
                onClick={onBack}
            >
                Back to Config
            </button>
        </nav>
    )
}

export default GameControls
