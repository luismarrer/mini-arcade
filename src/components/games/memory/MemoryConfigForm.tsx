import type { FC, FormEvent, ChangeEvent } from "react"
import type { MemoryConfig } from "./MemoryGameClient"

interface ConfigFormProps {
    config: MemoryConfig
    onConfigChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const ConfigForm: FC<ConfigFormProps> = ({ config, onConfigChange, onSubmit }) => {
    const difficultyOptions = [
        { value: "low", label: "Rookie", detail: "Long reveal · more attempts" },
        { value: "medium", label: "Detective", detail: "Balanced reveal and attempts" },
        { value: "high", label: "Vigilante", detail: "Fast reveal · fewer attempts" },
    ]
    const cardOptions = [
        { value: "12", label: "12", detail: "6 pairs" },
        { value: "16", label: "16", detail: "8 pairs" },
        { value: "20", label: "20", detail: "10 pairs" },
    ]
    const artifactOptions = [
        { value: "", label: "No assist", detail: "Play it straight", mark: "—" },
        { value: "reveal-all", label: "X-ray scan", detail: "Reveal the board once", mark: "◎" },
        { value: "more-turns", label: "Second wind", detail: "+5 attempts, twice", mark: "+5" },
    ]
    const optionClass = (checked: boolean) => `relative flex min-h-20 cursor-pointer flex-col justify-between rounded-xl border p-3 transition-all focus-within:ring-2 focus-within:ring-[#6ec5f3] ${
        checked
            ? "border-[#6ec5f3] bg-[#203f62] shadow-[inset_0_0_0_1px_rgba(110,197,243,0.22),0_8px_24px_rgba(3,11,29,0.25)]"
            : "border-[#3b4d69] bg-[#121a2d] hover:-translate-y-0.5 hover:border-[#607797]"
    }`

    return (
        <form className="grid gap-6" onSubmit={onSubmit}>
            <fieldset>
                <legend className="mb-2.5 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[#91a8c8]">
                    01 · Pressure
                </legend>
                <div className="grid gap-2 sm:grid-cols-3">
                    {difficultyOptions.map((option) => (
                        <label key={option.value} className={optionClass(config.difficulty === option.value)}>
                            <input className="sr-only" type="radio" name="difficulty" value={option.value} checked={config.difficulty === option.value} onChange={onConfigChange} />
                            <span className="font-bold text-white">{option.label}</span>
                            <span className="text-xs text-[#aebdd2]">{option.detail}</span>
                            <i className={`absolute top-3 right-3 size-2 rounded-full ${config.difficulty === option.value ? "bg-[#ef476f] shadow-[0_0_10px_#ef476f]" : "bg-[#465a7a]"}`} />
                        </label>
                    ))}
                </div>
            </fieldset>

            <div className="grid gap-6 md:grid-cols-2">
                <fieldset>
                    <legend className="mb-2.5 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[#91a8c8]">
                        02 · Board
                    </legend>
                    <div className="grid grid-cols-3 gap-2">
                        {cardOptions.map((option) => (
                            <label key={option.value} className={optionClass(config.cards === option.value)}>
                                <input className="sr-only" type="radio" name="cards" value={option.value} checked={config.cards === option.value} onChange={onConfigChange} />
                                <span className="text-2xl font-black text-white">{option.label}</span>
                                <span className="text-xs text-[#aebdd2]">{option.detail}</span>
                            </label>
                        ))}
                    </div>
                </fieldset>

                <fieldset>
                    <legend className="mb-2.5 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-[#91a8c8]">
                        03 · Assist
                    </legend>
                    <div className="grid grid-cols-3 gap-2">
                        {artifactOptions.map((option) => (
                            <label key={option.value} className={optionClass(config.artifacts === option.value)}>
                                <input className="sr-only" type="radio" name="artifacts" value={option.value} checked={config.artifacts === option.value} onChange={onConfigChange} />
                                <span className="font-mono text-lg font-bold text-[#f188aa]">{option.mark}</span>
                                <span className="text-sm font-bold leading-tight text-white">{option.label}</span>
                                <span className="hidden text-[0.68rem] leading-tight text-[#aebdd2] sm:block">{option.detail}</span>
                            </label>
                        ))}
                    </div>
                </fieldset>
            </div>

            <div className="flex flex-col gap-3 border-t border-[#3b4d69] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="m-0 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-[#91a8c8]">
                    {config.cards} cards · {Number(config.cards) / 2} identities · one case
                </p>
                <button className="min-h-13 cursor-pointer rounded-lg border border-[#ff7293] bg-[#ef476f] px-8 py-3 font-mono text-xs font-bold uppercase tracking-[0.08em] text-white shadow-[0_7px_24px_rgba(239,71,111,0.25)] transition-all hover:-translate-y-0.5 hover:bg-[#ff5b80] focus:outline-none focus:ring-4 focus:ring-[#ef476f]/30">
                    Deal this board →
                </button>
            </div>
        </form>
    )
}

export default ConfigForm
