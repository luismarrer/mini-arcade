import type { FC, FormEvent, ChangeEvent } from "react"
import { useEffect, useState } from "react"

type Phase = "config" | "playing"

interface TwoDotsConfig {
    nick: string
    tamano: string
    avatar: number
}

const defaultConfig: TwoDotsConfig = {
    nick: "",
    tamano: "",
    avatar: 1,
}

const avatars = [1, 2, 3, 4, 5, 6] as const

const TwodotsGameClient: FC = () => {
    const [phase, setPhase] = useState<Phase>("config")
    const [config, setConfig] = useState<TwoDotsConfig>(defaultConfig)
    const [error, setError] = useState<string>("")


    const avatarSrc = `/images/twodots/avatars/avatar${config.avatar}.png`

    const handleBackToConfig = () => {
        setPhase("config")
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!config.tamano) {
            setError("You must select a board size")
            return
        }

        if (typeof window === "undefined") return

        const session = window.sessionStorage
        session.setItem("tamano", config.tamano)
        session.setItem("avatarImg", avatarSrc)

        setError("")
        setPhase("playing")
    }

    const handleSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setConfig((prev) => ({ ...prev, tamano: event.target.value }))
    }

    useEffect(() => {
        if (phase !== "playing") return
        if (typeof window === "undefined") return

        let cancelled = false

        const tryInit = () => {
            if (cancelled) return
            const globalAny = window as unknown as {
                TwodotsGame?: { init?: () => void }
            }
            if (globalAny.TwodotsGame?.init) {
                globalAny.TwodotsGame.init()
                return
            }
            window.setTimeout(tryInit, 50)
        }

        tryInit()

        return () => {
            cancelled = true
        }
    }, [phase])

    if (phase === "config") {
        return (
            <section className="mx-auto mt-16 bg-[#222f49] p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-xl flex flex-col gap-6">
                {error && (
                    <p
                        id="error"
                        className="text-sm font-normal text-red-600 bg-red-100 border-l-4 border-red-500 px-3 py-2 rounded"
                    >
                        {error}
                    </p>
                )}

                <form id="formEntrada" className="flex flex-col gap-6 text-white" onSubmit={handleSubmit}>
                    <fieldset className="flex flex-col gap-2">
                        <label htmlFor="tamano">Board size</label>
                        <select
                            name="tamano"
                            id="tamano"
                            className="text-white bg-[#1a2537] border border-[#3a4a64] rounded px-3 py-2"
                            required
                            value={config.tamano}
                            onChange={handleSizeChange}
                        >
                            <option value="">--Please choose a size--</option>
                            <option value="4">4x4</option>
                            <option value="5">5x5</option>
                            <option value="6">6x6</option>
                        </select>
                    </fieldset>

                    <button
                        type="submit"
                        id="jugar"
                        className="mt-2 w-full rounded-md bg-emerald-500 px-4 py-3 text-sm font-semibold tracking-wide text-white shadow-md hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#222f49] transition-colors"
                    >
                        PLAY
                    </button>
                </form>
            </section>
        )
    }

    return (
        <>
            <section id="contenedorJuego">
                <h2 className="visually-hidden">Game area</h2>
                <section id="gameArea">
                    <div id="juegoAcabado" role="region" aria-label="Game over">
                        <div className="juegoAcabadoTexto">
                            <h3>Game over!</h3>
                            <button id="nuevaPartida">Play again</button>
                        </div>
                    </div>
                    <div id="juego" role="grid" aria-label="Two Dots game board" />
                </section>
                <header id="tituloJuego">
                    <h1>Two Dots</h1>
                </header>
            </section>
            <aside id="contenedorUsuario">
                <h2>Player information</h2>
                <section id="usuarioInfo" role="region" aria-label="Player information">
                    <img src={avatarSrc} id="avatarImg" alt="Player avatar" />
                    <p id="nick" aria-label="Player name" />
                    <div className="user-stats">
                        <p id="tamano" aria-label="Board size" />
                        <p id="puntuacion" aria-label="Current score">
                            Score: 0
                        </p>
                        <p id="tmpo" aria-label="Remaining time">
                            Remaining time: 60
                        </p>
                    </div>
                </section>
                <nav className="mt-4">
                    <button
                        type="button"
                        className="px-4 py-2 rounded bg-slate-600 text-white hover:bg-slate-700 transition-colors"
                        onClick={handleBackToConfig}
                    >
                        Back to configuration
                    </button>
                </nav>
            </aside>
        </>
    )
}

export default TwodotsGameClient
