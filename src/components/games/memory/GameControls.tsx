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
        <nav className="mt-5 flex flex-wrap justify-end gap-2 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.06em]">
            <button
                type="button"
                className="rounded-md border border-[#54aee3] bg-[#2387c4] px-4 py-2.5 text-white transition-colors hover:bg-[#2d9bdb] focus:outline-none focus:ring-2 focus:ring-[#6ec5f3]"
                onClick={onRestart}
            >
                Restart Game
            </button>

            {artifact && (
                <button
                    type="button"
                    className={`rounded-md border px-4 py-2.5 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#d291e8] ${
                        canUseArtifact
                            ? 'border-[#aa5cc7] bg-[#74328e] hover:bg-[#873ca4]'
                            : 'cursor-not-allowed border-[#465a7a] bg-[#2a3850] opacity-50'
                    }`}
                    onClick={onUseArtifact}
                    disabled={!canUseArtifact}
                >
                    {getArtifactText()}
                </button>
            )}

            <button
                type="button"
                className="rounded-md border border-[#52647f] bg-[#1b2840] px-4 py-2.5 text-[#dbe5f3] transition-colors hover:bg-[#2a3850] focus:outline-none focus:ring-2 focus:ring-[#91a8c8]"
                onClick={onBack}
            >
                Back to Config
            </button>
        </nav>
    )
}

export default GameControls
