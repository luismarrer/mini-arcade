import type { FC, FormEvent, ChangeEvent } from "react"
import { useEffect, useState } from "react"

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
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    <label className="flex flex-col gap-2 font-medium text-white text-base">
                        Difficulty
                        <select
                            name="dificultad"
                            value={config.dificultad}
                            onChange={handleChange}
                            className="px-4 py-3 border border-slate-200 rounded-lg text-base bg-white text-slate-800 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                        >
                            <option value="baja">Low</option>
                            <option value="media">Medium</option>
                            <option value="alta">High</option>
                        </select>
                    </label>

                    <label className="flex flex-col gap-2 font-medium text-white text-base">
                        Number of cards
                        <select
                            name="tarjetas"
                            value={config.tarjetas}
                            onChange={handleChange}
                            className="px-4 py-3 border border-slate-200 rounded-lg text-base bg-white text-slate-800 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                        >
                            <option value="12">12</option>
                            <option value="16">16</option>
                            <option value="20">20</option>
                        </select>
                    </label>

                    <label className="flex flex-col gap-2 font-medium text-white text-base">
                        Artifacts
                        <select
                            name="artefactos"
                            value={config.artefactos}
                            onChange={handleChange}
                            className="px-4 py-3 border border-slate-200 rounded-lg text-base bg-white text-slate-800 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
                        >
                            <option value="">Select artifact</option>
                            <option value="destapar-todas">Reveal all</option>
                            <option value="mas-turnos">More turns</option>
                        </select>
                    </label>

                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-medium cursor-pointer transition-all duration-200 mt-3 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-blue-600/30">
                        Play
                    </button>
                </form>
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
