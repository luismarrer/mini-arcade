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
    const avatarSrc = `/images/avatars/avatar${config.avatar}.png`

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
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_15rem] short-landscape:grid-cols-[minmax(0,1fr)_13rem] short-landscape:gap-3">
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
