import type { FC, FormEvent, ChangeEvent } from "react"
import { useEffect, useState } from "react"
import ConfigForm from "./MemoryConfigForm"
import GameBoard from "./MemoryGame"

type Phase = "config" | "playing"

interface MemoryConfig {
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

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
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
        <section className="mx-auto mt-16 bg-[#222f49] p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-5xl flex flex-col gap-8">
            {phase === "config" ? (
                <ConfigForm config={config} onConfigChange={handleChange} onSubmit={handleSubmit} />
            ) : <GameBoard config={config} onBackToConfig={handleBackToConfig} cardImages={cards} />}
        </section>
    )
}

export default MemoryGameClient
