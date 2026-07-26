import type { FC, FormEvent, ChangeEvent } from "react"
import { useEffect, useState } from "react"
import ConfigForm from "./MemoryConfigForm"
import GameBoard from "./MemoryGame"

type Phase = "config" | "playing"

export interface MemoryConfig {
    difficulty: string
    cards: string
    artifacts: string
}

const defaultConfig: MemoryConfig = {
    difficulty: "low",
    cards: "12",
    artifacts: "",
}

export type CardImage = {
  id: string;
  alt: string;
  src: string;
  srcSet: string;
  sizes: string;
  width: number;
  height: number;
}

const MemoryGameClient: FC<{ cards: CardImage[] }> = ({ cards }) => {
    const [phase, setPhase] = useState<Phase>("config")
    const [config, setConfig] = useState<MemoryConfig>(defaultConfig)

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target
        setConfig((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (typeof window === "undefined") return

        window.sessionStorage.setItem("memoryGameConfig", JSON.stringify(config))
        setPhase("playing")
    }

    useEffect(() => {
        if (phase !== "playing") return
        if (typeof window === "undefined") return

        let cancelled = false

        const tryInit = () => {
            if (cancelled) return
            const globalAny = window as unknown as {
                MemoryGame?: { init?: () => void }
            }
            if (globalAny.MemoryGame?.init) {
                globalAny.MemoryGame.init()
                return
            }
            window.setTimeout(tryInit, 50)
        }

        tryInit()

        return () => {
            cancelled = true
        }
    }, [phase])

    const handleBackToConfig = () => {
        setPhase("config")
    }

    return (
        <section className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-[#465a7a] bg-[#18243a] shadow-[0_24px_70px_rgba(4,9,22,0.45)] short-landscape:my-0">
            <div className="h-1 bg-linear-to-r from-[#2387c4] via-[#6ec5f3] to-[#ef476f]" />
            <div className="flex flex-col gap-7 p-4 sm:p-7 short-landscape:gap-3 short-landscape:p-3">
                {phase === "config" && (
                    <header className="grid gap-4 border-b border-[#465a7a] pb-5 sm:grid-cols-[auto_1fr] sm:items-end">
                        <div className="grid size-14 place-items-center rounded-xl border border-[#6ec5f3] bg-[linear-gradient(145deg,#277fbc,#245da4_55%,#273364)] text-2xl font-black italic tracking-[-0.16em] text-white shadow-[0_8px_20px_rgba(3,11,29,0.35)]">
                            M<span className="text-[#ef476f]">/</span>
                        </div>
                        <div>
                            <span className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#91a8c8]">
                                Case file · DC deck
                            </span>
                            <h2 className="mt-1 text-3xl font-black uppercase italic tracking-[-0.04em] text-white sm:text-4xl">
                                Build your board
                            </h2>
                            <p className="mt-1 mb-0 max-w-xl text-sm leading-6 text-[#bdc9dc]">
                                Choose the pressure, board size and one optional advantage.
                            </p>
                        </div>
                    </header>
                )}
                {phase === "config" ? (
                    <ConfigForm config={config} onConfigChange={handleChange} onSubmit={handleSubmit} />
                ) : <GameBoard config={config} onBackToConfig={handleBackToConfig} cardImages={cards} />}
            </div>
        </section>
    )
}

export default MemoryGameClient
