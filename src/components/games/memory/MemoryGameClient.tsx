import type { FC, FormEvent, ChangeEvent } from "react"
import { useEffect, useState } from "react"
import ConfigForm from "./ConfigForm"

type Phase = "config" | "playing"

interface MemoryConfig {
    dificultad: string
    tarjetas: string
    artefactos: string
}

const defaultConfig: MemoryConfig = {
    dificultad: "baja",
    tarjetas: "12",
    artefactos: "",
}

const MemoryGameClient: FC = () => {
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
            ) : (
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2 text-white text-sm">
                        <p>
                            Difficulty: <span className="font-semibold">{config.dificultad}</span>
                        </p>
                        <p>
                            Cards: <span className="font-semibold">{config.tarjetas}</span>
                        </p>
                        {config.artefactos && (
                            <p>
                                Artifact: <span className="font-semibold">{config.artefactos}</span>
                            </p>
                        )}
                    </div>

                    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
                        <section id="player-info" className="text-black bg-white rounded-lg p-4 flex flex-col gap-4">
                            <article id="player" className="flex flex-col items-center gap-2">
                                <img
                                    src="/images/memory/avatars/batman.avif"
                                    alt="Player avatar"
                                    width={100}
                                />
                                <h3 id="nick" className="font-semibold">
                                    Hero123
                                </h3>
                            </article>

                            <section id="movimientos-restantes" className="text-center">
                                <h3 className="font-semibold">Remaining moves</h3>
                                <p aria-live="polite" />
                            </section>

                            <section id="puntuacion" className="text-center">
                                <h3 className="font-semibold">Score</h3>
                                <p aria-live="polite">0</p>
                            </section>
                        </section>

                        <section id="memory-game" className="mx-auto bg-[#222f49] p-4 rounded-lg w-full">
                            <h2 className="text-white text-lg font-semibold mb-4">Game Board</h2>
                            <div
                                id="memory-game-table"
                                role="grid"
                                aria-label="Memory card board"
                                className="min-h-[200px]"
                            />
                            <nav className="mt-4 flex gap-4 justify-end">
                                <button id="reiniciar" type="button" className="px-4 py-2 rounded bg-blue-600 text-white">
                                    Restart Game
                                </button>
                                <button
                                    id="salir"
                                    type="button"
                                    className="px-4 py-2 rounded bg-slate-500 text-white"
                                    onClick={handleBackToConfig}
                                >
                                    Back to Config
                                </button>
                            </nav>
                        </section>
                    </div>
                </div>
            )}
        </section>
    )
}

export default MemoryGameClient
