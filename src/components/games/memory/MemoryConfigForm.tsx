import type { FC, FormEvent, ChangeEvent } from "react"

interface MemoryConfig {
    dificultad: string
    tarjetas: string
    artefactos: string
}

interface ConfigFormProps {
    config: MemoryConfig
    onConfigChange: (event: ChangeEvent<HTMLSelectElement>) => void
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const ConfigForm: FC<ConfigFormProps> = ({ config, onConfigChange, onSubmit }) => {
    return (
        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
            <label className="flex flex-col gap-2 font-medium text-white text-base">
                Difficulty
                <select
                    name="dificultad"
                    value={config.dificultad}
                    onChange={onConfigChange}
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
                    onChange={onConfigChange}
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
                    onChange={onConfigChange}
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
    )
}

export default ConfigForm
