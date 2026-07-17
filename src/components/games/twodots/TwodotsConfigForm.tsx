import type { FC, FormEvent, ChangeEvent } from "react"

interface TwodotsConfigFormProps {
    size: string
    error: string
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
    onSizeChange: (event: ChangeEvent<HTMLSelectElement>) => void
}

const TwodotsConfigForm: FC<TwodotsConfigFormProps> = ({
    size,
    error,
    onSubmit,
    onSizeChange,
}) => {
    return (
        <section className="mx-auto my-4 w-full max-w-xl overflow-hidden rounded-2xl border border-[#5d4a84] bg-[#201936] shadow-[0_24px_70px_rgba(7,3,20,0.42)]">
            <div className="flex h-1.5" aria-hidden="true">
                <span className="flex-1 bg-[#fd0c49]" />
                <span className="flex-1 bg-[#667eea]" />
                <span className="flex-1 bg-[#7ac943]" />
            </div>
            <div className="flex flex-col gap-6 p-6 sm:p-8">
                <header className="border-b border-[#4a3c68] pb-5">
                    <span className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#a99dc5]">Two-Dots · Game setup</span>
                    <h2 className="mt-2 bg-linear-to-r from-[#8ca1ff] to-[#c48bdf] bg-clip-text text-3xl font-black tracking-[-0.04em] text-transparent sm:text-4xl">Choose the grid</h2>
                    <p className="mt-2 mb-0 text-sm leading-6 text-[#c8bfda]">Larger boards create longer paths, with the same sixty-second clock.</p>
                </header>
                {error && (
                    <p
                        id="error"
                        role="alert"
                        className="rounded-lg border border-[#fd5e86] bg-[#4a1c30] px-3 py-2 text-sm font-semibold text-[#ffc3d2]"
                    >
                        {error}
                    </p>
                )}

                <form id="formEntrada" className="flex flex-col gap-6 text-white" onSubmit={onSubmit}>
                    <fieldset className="flex flex-col gap-2">
                        <label htmlFor="size" className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[#c8bfda]">Board size</label>
                        <select
                            name="size"
                            id="size"
                            className="min-h-13 rounded-lg border border-[#d9d8e4] bg-white px-4 py-3 text-[#26213b] focus:border-[#8094ef] focus:outline-none focus:ring-4 focus:ring-[#667eea]/25"
                            required
                            value={size}
                            onChange={onSizeChange}
                        >
                            <option value="">Choose a size</option>
                            <option value="4">4x4</option>
                            <option value="5">5x5</option>
                            <option value="6">6x6</option>
                        </select>
                    </fieldset>

                    <button
                        type="submit"
                        id="play"
                        className="mt-2 min-h-13 w-full rounded-lg border border-[#9c88e7] bg-linear-to-r from-[#667eea] to-[#764ba2] px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.08em] text-white shadow-[0_8px_26px_rgba(102,126,234,0.28)] transition-all hover:-translate-y-0.5 hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-[#667eea]/30"
                    >
                        Start the clock
                    </button>
                </form>
            </div>
        </section>
    )
}

export default TwodotsConfigForm
