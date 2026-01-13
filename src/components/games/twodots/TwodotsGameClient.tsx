import type { FC, FormEvent, ChangeEvent } from "react"
import { useEffect, useState } from "react"
import GameContainer from "./GameContainer"
import PlayerInfo from "./PlayerInfo"
import TwodotsConfigForm from "./TwodotsConfigForm"

type Phase = "config" | "playing"

interface TwoDotsConfig {
    nick: string
    size: string
    avatar: number
}

const defaultConfig: TwoDotsConfig = {
    nick: "",
    size: "",
    avatar: 1,
}

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

        if (!config.size) {
            setError("You must select a board size")
            return
        }

        if (typeof window === "undefined") return

        const session = window.sessionStorage
        session.setItem("size", config.size)
        session.setItem("avatarImg", avatarSrc)

        setError("")
        setPhase("playing")
    }

    const handleSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setConfig((prev) => ({ ...prev, size: event.target.value }))
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
            <TwodotsConfigForm
                size={config.size}
                error={error}
                onSubmit={handleSubmit}
                onSizeChange={handleSizeChange}
            />
        )
    }

    return (
        <>
            <GameContainer />
            <PlayerInfo avatarSrc={avatarSrc} onBackToConfig={handleBackToConfig} />
        </>
    )
}

export default TwodotsGameClient
