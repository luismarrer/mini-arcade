import type { FC } from "react"
import { useTwodotsGame } from "./hooks/useTwodotsGame"
import PlayerInfo from "./PlayerInfo"
import GameBoard from "./GameBoard"

interface TwodotsConfig {
    size: string
    avatar: number
}

interface TwodotsGameBoardProps {
    config: TwodotsConfig
    onBackToConfig: () => void
}

const TwodotsGame: FC<TwodotsGameBoardProps> = ({ config, onBackToConfig }) => {
    const size = parseInt(config.size)
    const avatarSrc = `/images/twodots/avatars/avatar${config.avatar}.png`

    const {
        dots,
        score,
        timeRemaining,
        isGameOver,
        startMarking,
        continueMarking,
        finishMarking,
        resetGame,
    } = useTwodotsGame({ size })

    return (
        <div className="flex flex-wrap gap-8 items-start">
            <GameBoard
                dots={dots}
                size={size}
                isGameOver={isGameOver}
                onStartMarking={startMarking}
                onContinueMarking={continueMarking}
                onFinishMarking={finishMarking}
                onPlayAgain={resetGame}
            />
            <PlayerInfo
                avatarSrc={avatarSrc}
                size={size}
                score={score}
                timeRemaining={timeRemaining}
                onBackToConfig={onBackToConfig}
            />
        </div>
    )
}

export default TwodotsGame
