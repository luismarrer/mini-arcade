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
        <section className="mx-auto mt-16 bg-[#222f49] p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-xl flex flex-col gap-6">
            {error && (
                <p
                    id="error"
                    className="text-sm font-normal text-red-600 bg-red-100 border-l-4 border-red-500 px-3 py-2 rounded"
                >
                    {error}
                </p>
            )}

            <form id="formEntrada" className="flex flex-col gap-6 text-white" onSubmit={onSubmit}>
                <fieldset className="flex flex-col gap-2">
                    <label htmlFor="size">Board size</label>
                    <select
                        name="size"
                        id="size"
                        className="text-white bg-[#1a2537] border border-[#3a4a64] rounded px-3 py-2"
                        required
                        value={size}
                        onChange={onSizeChange}
                    >
                        <option value="">--Please choose a size--</option>
                        <option value="4">4x4</option>
                        <option value="5">5x5</option>
                        <option value="6">6x6</option>
                    </select>
                </fieldset>

                <button
                    type="submit"
                    id="play"
                    className="mt-2 w-full rounded-md bg-emerald-500 px-4 py-3 text-sm font-semibold tracking-wide text-white shadow-md hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#222f49] transition-colors"
                >
                    PLAY
                </button>
            </form>
        </section>
    )
}

export default TwodotsConfigForm
