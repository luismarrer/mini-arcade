import type { FC } from 'react'

interface PlayerInfoProps {
    movesRemaining: number
    score: number
    pairsFound: number
    totalPairs: number
}

const PlayerInfo: FC<PlayerInfoProps> = ({ movesRemaining, score, pairsFound, totalPairs }) => {
    return (
        <section className="text-black bg-white rounded-lg p-4 flex flex-col gap-4">

            <section className="text-center">
                <h3 className="font-semibold">Moves</h3>
                <p aria-live="polite">{movesRemaining}</p>
            </section>

            <section className="text-center">
                <h3 className="font-semibold">Pairs</h3>
                <p aria-live="polite">{pairsFound}/{totalPairs}</p>
            </section>

            <section className="text-center">
                <h3 className="font-semibold">Score</h3>
                <p aria-live="polite">{score}</p>
            </section>
        </section>
    )
}

export default PlayerInfo
