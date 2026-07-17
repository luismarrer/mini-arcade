import type { FC } from 'react'

interface PlayerInfoProps {
    movesRemaining: number
    score: number
    pairsFound: number
    totalPairs: number
}

const PlayerInfo: FC<PlayerInfoProps> = ({ movesRemaining, score, pairsFound, totalPairs }) => {
    return (
        <section className="grid grid-cols-3 gap-3 rounded-xl border border-[#465a7a] border-l-[3px] border-l-[#e34a7a] bg-[#172238] p-4 text-white lg:grid-cols-1">

            <section className="text-center lg:text-left">
                <h3 className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-[#91a8c8]">Moves</h3>
                <p className="m-0 text-2xl font-black text-[#6ec5f3]" aria-live="polite">{movesRemaining}</p>
            </section>

            <section className="text-center lg:text-left">
                <h3 className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-[#91a8c8]">Pairs</h3>
                <p className="m-0 text-2xl font-black text-[#f188aa]" aria-live="polite">{pairsFound}/{totalPairs}</p>
            </section>

            <section className="text-center lg:text-left">
                <h3 className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-[#91a8c8]">Score</h3>
                <p className="m-0 text-2xl font-black" aria-live="polite">{score}</p>
            </section>
        </section>
    )
}

export default PlayerInfo
