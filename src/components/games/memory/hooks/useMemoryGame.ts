import { useState, useCallback, useEffect } from 'react'

export interface Card {
    id: number
    content: string
    isFlipped: boolean
    isMatched: boolean
}

interface UseMemoryGameProps {
    difficulty: string
    numCards: number
}

const CARD_IMAGES = [
    'alfred-pennyworth',
    'bane',
    'batwoman',
    'bizarro',
    'brainiac',
    'doomsday',
    'krypto',
    'lex-luthor',
    'lois-lane',
    'nightwing',
    'riddler',
    'robin',
    'scarecrow',
    'the-joker',
    'two-face',
]

const FLIP_TIME: Record<string, number> = {
    baja: 2000, // 2 seconds
    media: 1000, // 1 second
    alta: 500, // 0.5 seconds
}

const MOVE_MULTIPLIERS: Record<string, number> = {
    baja: 5,
    media: 4,
    alta: 3,
}

const createCards = (numCards: number): Card[] => {
    const numPairs = numCards / 2

    // Select random images
    const selectedImages = [...CARD_IMAGES]
        .sort(() => Math.random() - 0.5)
        .slice(0, numPairs)

    // Create pairs
    const pairs: string[] = []
    selectedImages.forEach((image) => {
        pairs.push(image, image)
    })

    // Shuffle cards
    const shuffled = pairs.sort(() => Math.random() - 0.5)

    return shuffled.map((content, index) => ({
        id: index,
        content,
        isFlipped: false,
        isMatched: false,
    }))
}

const calculateMaxMoves = (difficulty: string, numCards: number): number => {
    const pairs = numCards / 2
    const multiplier = MOVE_MULTIPLIERS[difficulty] || MOVE_MULTIPLIERS.baja
    return Math.floor(pairs * multiplier)
}

export const useMemoryGame = ({ difficulty, numCards }: UseMemoryGameProps) => {
    const [cards, setCards] = useState<Card[]>(() => createCards(numCards))
    const [flippedCards, setFlippedCards] = useState<number[]>([])
    const [isLocked, setIsLocked] = useState(false)
    const [maxMoves] = useState(() => calculateMaxMoves(difficulty, numCards))
    const [movesRemaining, setMovesRemaining] = useState(() => calculateMaxMoves(difficulty, numCards))
    const [score, setScore] = useState(0)
    const [gameWon, setGameWon] = useState(false)
    const [gameLost, setGameLost] = useState(false)

    const flipTime = FLIP_TIME[difficulty] || FLIP_TIME.baja

    const flipCard = useCallback(
        (cardId: number) => {
            // Don't allow flipping if game is locked, card is already flipped or matched
            if (isLocked || flippedCards.includes(cardId)) return

            const card = cards.find((c) => c.id === cardId)
            if (!card || card.isFlipped || card.isMatched) return

            // Check if player has moves left
            if (movesRemaining <= 0) return

            // Reduce moves
            setMovesRemaining((prev) => prev - 1)

            // Don't allow more than 2 cards flipped
            if (flippedCards.length >= 2) return

            // Flip the card
            setCards((prev) =>
                prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
            )

            setFlippedCards((prev) => [...prev, cardId])
        },
        [isLocked, flippedCards, cards, movesRemaining]
    )

    // Check for match when 2 cards are flipped
    useEffect(() => {
        if (flippedCards.length !== 2) return

        setIsLocked(true)

        const [firstId, secondId] = flippedCards
        const firstCard = cards.find((c) => c.id === firstId)
        const secondCard = cards.find((c) => c.id === secondId)

        if (!firstCard || !secondCard) return

        const isMatch = firstCard.content === secondCard.content

        setTimeout(() => {
            if (isMatch) {
                // Mark as matched
                setCards((prev) =>
                    prev.map((c) =>
                        c.id === firstId || c.id === secondId
                            ? { ...c, isMatched: true }
                            : c
                    )
                )
                setScore((prev) => prev + 1)
            } else {
                // Flip back
                setCards((prev) =>
                    prev.map((c) =>
                        c.id === firstId || c.id === secondId
                            ? { ...c, isFlipped: false }
                            : c
                    )
                )
            }

            // Reset state
            setFlippedCards([])
            setIsLocked(false)
        }, flipTime)
    }, [flippedCards, cards, flipTime])

    // Check for game over
    useEffect(() => {
        const allMatched = cards.length > 0 && cards.every((c) => c.isMatched)
        if (allMatched && !gameWon) {
            setGameWon(true)
        }

        if (movesRemaining === 0 && !allMatched && !gameLost && flippedCards.length === 0) {
            setGameLost(true)
        }
    }, [cards, movesRemaining, gameWon, gameLost, flippedCards.length])

    const resetGame = useCallback(() => {
        setCards(createCards(numCards))
        setFlippedCards([])
        setIsLocked(false)
        setMovesRemaining(maxMoves)
        setScore(0)
        setGameWon(false)
        setGameLost(false)
    }, [numCards, maxMoves])

    const addMoves = useCallback((amount: number) => {
        setMovesRemaining((prev) => prev + amount)
    }, [])

    const revealAllCards = useCallback(() => {
        // Temporarily show all unmatched cards
        setCards((prev) =>
            prev.map((c) => (c.isMatched ? c : { ...c, isFlipped: true }))
        )

        setTimeout(() => {
            setCards((prev) =>
                prev.map((c) => (c.isMatched ? c : { ...c, isFlipped: false }))
            )
        }, 3000)
    }, [])

    return {
        cards,
        movesRemaining,
        maxMoves,
        score,
        gameWon,
        gameLost,
        flipCard,
        resetGame,
        addMoves,
        revealAllCards,
    }
}
