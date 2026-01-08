import type { FC } from 'react'

interface PlayerInfoProps {
    avatarSrc: string
    nickname: string
    movesRemaining: number
    score: number
}

const PlayerInfo: FC<PlayerInfoProps> = ({ avatarSrc, nickname, movesRemaining, score }) => {
    return (
        <section className="text-black bg-white rounded-lg p-4 flex flex-col gap-4">
            <article className="flex flex-col items-center gap-2">
                <img src="src/images/avatars/batman.avif" alt="Player avatar" width={100} />
                <h3 className="font-semibold">{nickname}</h3>
            </article>

            <section className="text-center">
                <h3 className="font-semibold">Remaining moves</h3>
                <p aria-live="polite">{movesRemaining}</p>
            </section>

            <section className="text-center">
                <h3 className="font-semibold">Score</h3>
                <p aria-live="polite">{score}</p>
            </section>
        </section>
    )
}

export default PlayerInfo
