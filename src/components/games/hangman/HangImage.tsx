interface Props {
    imageNumber: number
}

export function HangImage({ imageNumber }: Props) {
    const step = Math.max(0, Math.min(imageNumber, 9))
    const lineProps = {
        stroke: "#62b7eb",
        strokeWidth: 7,
        strokeLinecap: "round" as const,
    }

    return (
        <svg
            viewBox="0 0 240 250"
            role="img"
            aria-label={`Hangman drawing after ${step} missed ${step === 1 ? "guess" : "guesses"}`}
            className="h-auto w-full max-w-[230px]"
        >
            <line x1="28" y1="225" x2="205" y2="225" {...lineProps} />
            <line x1="58" y1="225" x2="58" y2="26" {...lineProps} />
            <line x1="58" y1="28" x2="166" y2="28" {...lineProps} />
            <line x1="163" y1="28" x2="163" y2="58" {...lineProps} />
            <line x1="59" y1="63" x2="94" y2="28" {...lineProps} />

            {step >= 1 && <circle cx="163" cy="81" r="23" fill="#173552" stroke="#62b7eb" strokeWidth="7" />}
            {step >= 2 && <line x1="163" y1="105" x2="163" y2="161" {...lineProps} />}
            {step >= 3 && <line x1="163" y1="120" x2="132" y2="143" {...lineProps} />}
            {step >= 4 && <line x1="163" y1="120" x2="194" y2="143" {...lineProps} />}
            {step >= 5 && <line x1="163" y1="160" x2="135" y2="196" {...lineProps} />}
            {step >= 6 && <line x1="163" y1="160" x2="191" y2="196" {...lineProps} />}
            {step >= 7 && <circle cx="154" cy="77" r="3" fill="#dff4ff" />}
            {step >= 8 && <circle cx="172" cy="77" r="3" fill="#dff4ff" />}
            {step >= 9 && <path d="M152 92 Q163 84 174 92" fill="none" {...lineProps} strokeWidth="4" />}
        </svg>
    )
}
