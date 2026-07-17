import type { FC, FormEvent, ChangeEvent } from "react"

interface MemoryConfig {
    difficulty: string
    cards: string
    artifacts: string
}

interface ConfigFormProps {
    config: MemoryConfig
    onConfigChange: (event: ChangeEvent<HTMLSelectElement>) => void
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const ConfigForm: FC<ConfigFormProps> = ({ config, onConfigChange, onSubmit }) => {
    const labelClass = "flex flex-col gap-2 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[#bdc9dc]"
    const selectClass = "min-h-13 rounded-lg border border-[#465a7a] bg-[#121a2d] px-4 py-3 font-sans text-base normal-case tracking-normal text-white transition-colors hover:border-[#6d83a5] focus:border-[#4ba7df] focus:outline-none focus:ring-4 focus:ring-[#2387c4]/20"

    return (
        <form className="grid gap-5 md:grid-cols-3" onSubmit={onSubmit}>
            <label className={labelClass}>
                Difficulty
                <select
                    name="difficulty"
                    value={config.difficulty}
                    onChange={onConfigChange}
                    className={selectClass}
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </label>

            <label className={labelClass}>
                Number of cards
                <select
                    name="cards"
                    value={config.cards}
                    onChange={onConfigChange}
                    className={selectClass}
                >
                    <option value="12">12</option>
                    <option value="16">16</option>
                    <option value="20">20</option>
                </select>
            </label>

            <label className={labelClass}>
                Artifacts
                <select
                    name="artifacts"
                    value={config.artifacts}
                    onChange={onConfigChange}
                    className={selectClass}
                >
                    <option value="">Select artifact</option>
                    <option value="reveal-all">Reveal all</option>
                    <option value="more-turns">More turns</option>
                </select>
            </label>

            <button className="min-h-13 cursor-pointer rounded-lg border border-[#54aee3] bg-[#2387c4] px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.08em] text-white shadow-[0_7px_24px_rgba(35,135,196,0.25)] transition-all hover:-translate-y-0.5 hover:bg-[#2d9bdb] focus:outline-none focus:ring-4 focus:ring-[#2387c4]/30 md:col-span-3">
                Deal the cards
            </button>
        </form>
    )
}

export default ConfigForm
