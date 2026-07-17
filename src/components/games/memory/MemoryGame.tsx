import type { FC } from "react"
import { useMemoryGame } from "./hooks/useMemoryGame"
import { useArtifacts } from "./hooks/useArtifacts"
import PlayerInfo from "./PlayerInfo"
import GameBoard from "./GameBoard"
import GameControls from "./GameControls"
import type { CardImage } from "./MemoryGameClient"

interface MemoryConfig {
    difficulty: string
    cards: string
    artifacts: string
}

interface MemoryGameBoardProps {
    config: MemoryConfig
    onBackToConfig: () => void
    cardImages: CardImage[]
}

const MemoryGameBoard: FC<MemoryGameBoardProps> = ({ config, onBackToConfig, cardImages }) => {
    const numCards = parseInt(config.cards)

    const {
        cards,
        movesRemaining,
        score,
        gameWon,
        gameLost,
        flipCard,
        resetGame,
        addMoves,
        revealAllCards,
    } = useMemoryGame({
        difficulty: config.difficulty,
        numCards,
        cardImages,
    })

    const {
        artifact,
        canUseArtifact,
        useArtifact,
        resetArtifact,
        getArtifactText,
    } = useArtifacts(config.artifacts || null)

    // Handle artifact usage
    const handleUseArtifact = () => {
        if (!artifact || !canUseArtifact()) return

        const success = useArtifact()
        if (!success) {
            return
        }

        // Execute artifact functionality
        switch (artifact.id) {
            case 'reveal-all':
                revealAllCards()
                break
            case 'more-turns':
                addMoves(5)
                break
        }
    }

    const handleRestart = () => {
        resetGame()
        resetArtifact()
    }

    // Get player data from sessionStorage
    const getPlayerData = () => {
        if (typeof window === "undefined") return { nick: 'Hero123', avatar: 'batman' }
        const data = sessionStorage.getItem('memoryGamePlayer')
        return data ? JSON.parse(data) : { nick: 'Hero123', avatar: 'batman' }
    }

    const playerData = getPlayerData()
    const avatarSrc = playerData.avatar.startsWith('avatar')
        ? `/images/avatars/${playerData.avatar}.png`
        : `/images/avatars/${playerData.avatar}.avif`

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-2 font-mono text-[0.66rem] uppercase tracking-[0.08em] text-[#bdc9dc]">
                <p className="m-0 rounded-full border border-[#465a7a] bg-[#172238] px-3 py-1.5">
                    Difficulty · <span className="font-semibold">{config.difficulty}</span>
                </p>
                <p className="m-0 rounded-full border border-[#465a7a] bg-[#172238] px-3 py-1.5">
                    Cards · <span className="font-semibold">{config.cards}</span>
                </p>
                {config.artifacts && config.artifacts !== '0' && (
                    <p className="m-0 rounded-full border border-[#aa5cc7] bg-[#3b214c] px-3 py-1.5 text-[#f0c9ff]">
                        Artifact · <span className="font-semibold">{artifact?.name || config.artifacts}</span>
                    </p>
                )}
            </div>

            {(gameWon || gameLost) && (
                <div role="status" className={`rounded-lg border px-4 py-3 font-semibold ${gameWon ? 'border-[#4fbf90] bg-[#16392f] text-[#a4f3d2]' : 'border-[#e34a7a] bg-[#451d2d] text-[#ffc2d5]'}`}>
                    {gameWon ? 'Board cleared — every pair found.' : 'No moves left. Reset the deck and try another route.'}
                </div>
            )}

            <div className="grid items-start gap-5 lg:grid-cols-[11rem_minmax(0,1fr)]">
                <PlayerInfo
                    movesRemaining={movesRemaining}
                    score={score}
                    pairsFound={score}
                    totalPairs={numCards / 2}
                />

                <section className="mx-auto w-full rounded-xl border border-[#3b4d69] bg-[#121a2d] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-5">
                    <GameBoard cards={cards} onCardClick={flipCard} cardImages={cardImages} />
                    <GameControls
                        onRestart={handleRestart}
                        onBack={onBackToConfig}
                        artifact={artifact}
                        canUseArtifact={canUseArtifact()}
                        onUseArtifact={handleUseArtifact}
                        getArtifactText={getArtifactText}
                    />
                </section>
            </div>
        </div>
    )
}

export default MemoryGameBoard
