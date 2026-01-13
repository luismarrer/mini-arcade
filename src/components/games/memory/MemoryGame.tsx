import type { FC } from "react"
import { useEffect } from "react"
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
            alert('This artifact has no available uses left')
            return
        }

        // Execute artifact functionality
        switch (artifact.id) {
            case 'reveal-all':
                revealAllCards()
                break
            case 'more-turns':
                addMoves(5)
                alert("You've gained 5 additional moves!")
                break
        }
    }

    const handleRestart = () => {
        resetGame()
        resetArtifact()
    }

    // Show game result alerts
    useEffect(() => {
        if (gameWon) {
            setTimeout(() => {
                alert('Congratulations! You completed the game.')
            }, 500)
        }
    }, [gameWon])

    useEffect(() => {
        if (gameLost) {
            alert('You lost! No more moves remaining.')
        }
    }, [gameLost])

    // Get player data from sessionStorage
    const getPlayerData = () => {
        if (typeof window === "undefined") return { nick: 'Hero123', avatar: 'batman' }
        const data = sessionStorage.getItem('memoryGamePlayer')
        return data ? JSON.parse(data) : { nick: 'Hero123', avatar: 'batman' }
    }

    const playerData = getPlayerData()
    const avatarSrc = `/images/memory/avatars/${playerData.avatar}.avif`

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2 text-white text-sm">
                <p>
                    Difficulty: <span className="font-semibold">{config.difficulty}</span>
                </p>
                <p>
                    Cards: <span className="font-semibold">{config.cards}</span>
                </p>
                {config.artifacts && config.artifacts !== '0' && (
                    <p>
                        Artifact: <span className="font-semibold">{artifact?.name || config.artifacts}</span>
                    </p>
                )}
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
                <PlayerInfo
                    avatarSrc={avatarSrc}
                    nickname={playerData.nick}
                    movesRemaining={movesRemaining}
                    score={score}
                />

                <section className="mx-auto bg-[#222f49] p-4 rounded-lg w-full">
                    <h2 className="text-white text-lg font-semibold mb-4">Game Board</h2>
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
