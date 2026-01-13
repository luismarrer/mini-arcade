import type { FC, FormEvent, ChangeEvent } from "react"
import { useState } from "react"
import TwodotsGame from "./TwodotsGame"
import TwodotsConfigForm from "./TwodotsConfigForm"

type Phase = "config" | "playing"

interface TwoDotsConfig {
    size: string
    avatar: number
}

const defaultConfig: TwoDotsConfig = {
    size: "",
    avatar: 1,
}

const TwodotsGameClient: FC = () => {
    const [phase, setPhase] = useState<Phase>("config")
    const [config, setConfig] = useState<TwoDotsConfig>(defaultConfig)
    const [error, setError] = useState<string>("")

    const handleBackToConfig = () => {
        setPhase("config")
        setConfig(defaultConfig)
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!config.size) {
            setError("You must select a board size")
            return
        }

        setError("")
        setPhase("playing")
    }

    const handleSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setConfig((prev) => ({ ...prev, size: event.target.value }))
    }

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
        <TwodotsGame
            config={config}
            onBackToConfig={handleBackToConfig}
        />
    )
}

export default TwodotsGameClient
