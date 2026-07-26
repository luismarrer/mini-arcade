import type { FC } from 'react'

interface PlayerInfoProps {
    movesRemaining: number
    score: number
    pairsFound: number
    totalPairs: number
    streak: number
}

const PlayerInfo: FC<PlayerInfoProps> = ({ movesRemaining, score, pairsFound, totalPairs, streak }) => {
    return (
        <section className="grid grid-cols-3 gap-3 rounded-xl border border-[#465a7a] border-l-[3px] border-l-[#ef476f] bg-[#172238] p-4 text-white lg:grid-cols-1 short-landscape:grid-cols-1 short-landscape:gap-2 short-landscape:p-3">

            <section className="text-center lg:text-left short-landscape:text-left">
                <h3 className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-[#91a8c8]">Attempts</h3>
                <p className="m-0 text-2xl font-black text-[#6ec5f3] short-landscape:text-xl" aria-live="polite">{movesRemaining}</p>
            </section>

            <section className="text-center lg:text-left short-landscape:text-left">
                <h3 className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-[#91a8c8]">Pairs</h3>
                <p className="m-0 text-2xl font-black text-[#f188aa] short-landscape:text-xl" aria-live="polite">{pairsFound}<span className="text-sm text-[#91a8c8]">/{totalPairs}</span></p>
            </section>

            <section className="text-center lg:text-left short-landscape:text-left">
                <h3 className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-[#91a8c8]">Points</h3>
                <p className="m-0 text-2xl font-black short-landscape:text-xl" aria-live="polite">{score}</p>
            </section>

            <p className={`col-span-3 m-0 border-t border-[#3b4d69] pt-3 text-center font-mono text-[0.62rem] uppercase tracking-[0.08em] lg:col-span-1 lg:text-left short-landscape:col-span-1 ${streak > 1 ? "text-[#ffb0c2]" : "text-[#7186a4]"}`}>
                {streak > 1 ? `${streak} match streak · +${(streak - 1) * 25} bonus` : "Chain matches for bonus points"}
            </p>
        </section>
    )
}

export default PlayerInfo
