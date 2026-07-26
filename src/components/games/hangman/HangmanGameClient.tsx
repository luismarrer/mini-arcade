import { useEffect, useState } from "react"
import { HangImage } from "./HangImage"
import { getRandomWord } from "./getRandomWord"
import { letters } from "./letters"

function HangmanGameClient() {
    const [word, setWord] = useState("")
    const [hiddenWord, setHiddenWord] = useState("")
    const [attempts, setAttempts] = useState(0)
    const [guessedLetters, setGuessedLetters] = useState<string[]>([])
    const [lose, setLose] = useState(false)
    const [won, setWon] = useState(false)

    useEffect(() => {
        if (attempts >= 9) setLose(true)
    }, [attempts])

    useEffect(() => {
        if (word && hiddenWord.replaceAll(" ", "") === word) setWon(true)
    }, [hiddenWord, word])

    const checkLetter = (letter: string) => {
        if (!word || won || lose || guessedLetters.includes(letter)) return

        setGuessedLetters((current) => [...current, letter])

        if (!word.includes(letter)) {
            setAttempts((current) => Math.min(current + 1, 9))
            return
        }

        const hiddenWordArray = hiddenWord.trimEnd().split(" ")
        for (let index = 0; index < word.length; index++) {
            if (word[index] === letter) hiddenWordArray[index] = letter
        }
        setHiddenWord(hiddenWordArray.join(" "))
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.repeat) return

            const key = event.key.toUpperCase()
            if (letters.includes(key)) checkLetter(key)
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    })

    const newGame = () => {
        const nextWord = getRandomWord()
        setWord(nextWord)
        setHiddenWord("_ ".repeat(nextWord.length))
        setAttempts(0)
        setGuessedLetters([])
        setLose(false)
        setWon(false)
    }

    useEffect(() => {
        const firstWord = getRandomWord()
        setWord(firstWord)
        setHiddenWord("_ ".repeat(firstWord.length))
    }, [])

    return (
        <section className="mx-auto my-4 grid max-w-5xl overflow-hidden rounded-2xl border border-[#2d5271] bg-[#0b1726] shadow-[0_1.4rem_4rem_rgba(2,10,20,0.42),0_0_2.5rem_rgba(35,135,196,0.1)] lg:grid-cols-[0.82fr_1.18fr] short-landscape:my-0 short-landscape:grid-cols-[0.72fr_1.28fr]">
            <div className="relative flex min-h-[23rem] flex-col items-center justify-center overflow-hidden border-b border-[#2d5271] bg-[#10243a] p-5 lg:border-r lg:border-b-0 short-landscape:min-h-0 short-landscape:border-r short-landscape:border-b-0 short-landscape:p-3">
                <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(98,183,235,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(98,183,235,0.12)_1px,transparent_1px)] [background-size:24px_24px]" aria-hidden="true" />
                <span className="relative mb-4 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#87c8ed] short-landscape:mb-2">
                    Drawing · {9 - attempts} misses left
                </span>
                <div className="relative rounded-xl border border-[#315879] bg-[#0a1828]/80 p-4 shadow-[inset_0_0_2rem_rgba(35,135,196,0.08)] short-landscape:p-2">
                    <HangImage imageNumber={attempts} />
                </div>
            </div>

            <div className="flex flex-col justify-center bg-[#0d1c2d] p-5 sm:p-8 short-landscape:p-3">
                <div className="mb-6 border-b border-[#29445d] pb-6 text-center short-landscape:mb-3 short-landscape:pb-3">
                    <span className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#6fa9cc]">
                        Hidden word
                    </span>
                    <p className="mt-4 mb-0 min-h-[2.75rem] break-words font-mono text-[clamp(1.25rem,5vw,2.2rem)] font-semibold tracking-[0.14em] text-[#dff4ff] [text-shadow:0_0_1.25rem_rgba(98,183,235,0.2)] short-landscape:mt-2 short-landscape:min-h-0 short-landscape:text-[1.15rem]" aria-live="polite">
                        {word ? hiddenWord : "· · ·"}
                    </p>
                </div>

                {(won || lose) && (
                    <div role="status" className={`mb-5 rounded-lg border px-4 py-3 text-center font-mono text-sm font-semibold ${won ? "border-[#4f8d32] bg-[#142e22] text-[#9ee96d]" : "border-[#9d4052] bg-[#351927] text-[#ff91a5]"}`}>
                        {won ? "Word found." : `The word was ${word}.`}
                    </div>
                )}

                <div className="grid grid-cols-4 gap-1.5 min-[360px]:grid-cols-5 sm:grid-cols-7 lg:grid-cols-9 short-landscape:grid-cols-7" aria-label="Letter keyboard">
                    {letters.map((letter) => {
                        const hasBeenGuessed = guessedLetters.includes(letter)
                        const wasCorrect = hasBeenGuessed && word.includes(letter)
                        return (
                            <button
                                key={letter}
                                type="button"
                                disabled={!word || hasBeenGuessed || won || lose}
                                className={`min-h-11 min-w-0 rounded-md border font-mono text-xs font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8ed8ff] disabled:cursor-not-allowed disabled:hover:translate-y-0 ${hasBeenGuessed ? (wasCorrect ? "border-[#4f8d32] bg-[#142e22] text-[#9ee96d]" : "border-[#6b3544] bg-[#2a1722] text-[#b77684]") : "border-[#315879] bg-[#142b42] text-[#dff4ff] hover:-translate-y-0.5 hover:border-[#6ac7ff] hover:bg-[#1a3a58]"}`}
                                onClick={() => checkLetter(letter)}
                                aria-label={`Guess ${letter}`}
                            >
                                {letter}
                            </button>
                        )
                    })}
                </div>

                <button
                    type="button"
                    className="mt-6 min-h-12 rounded-md border border-[#62b7eb] bg-[#2387c4] px-6 font-mono text-xs font-semibold uppercase tracking-[0.08em] text-white shadow-[0_0_1.2rem_rgba(35,135,196,0.16)] transition-all hover:-translate-y-0.5 hover:bg-[#2c9bdf] hover:shadow-[0_0_1.5rem_rgba(35,135,196,0.28)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8ed8ff] short-landscape:mt-3 short-landscape:min-h-11"
                    onClick={newGame}
                >
                    New word
                </button>
            </div>
        </section>
    )
}

export default HangmanGameClient
