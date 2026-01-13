import { useState, useCallback, useEffect, useRef } from 'react'

export type DotColor = 'red' | 'green'

export interface Dot {
    id: number
    color: DotColor
    isMarked: boolean
}

interface UseTwodotsGameProps {
    size: number
}

const GAME_DURATION = 60 // seconds

const getRandomColor = (): DotColor => {
    return Math.random() < 0.5 ? 'red' : 'green'
}

const createBoard = (size: number): Dot[] => {
    const totalDots = size * size
    return Array.from({ length: totalDots }, (_, index) => ({
        id: index,
        color: getRandomColor(),
        isMarked: false,
    }))
}

const calculateAdjacent = (id: number, size: number): number[] => {
    const adjacent: number[] = []
    const totalDots = size * size

    // Top adjacent
    if (id - size >= 0) adjacent.push(id - size)
    // Bottom adjacent
    if (id + size < totalDots) adjacent.push(id + size)
    // Left adjacent
    if (id % size > 0) adjacent.push(id - 1)
    // Right adjacent
    if ((id + 1) % size > 0) adjacent.push(id + 1)

    return adjacent
}

export const useTwodotsGame = ({ size }: UseTwodotsGameProps) => {
    const [dots, setDots] = useState<Dot[]>(() => createBoard(size))
    const [score, setScore] = useState(0)
    const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION)
    const [isGameOver, setIsGameOver] = useState(false)
    const [isMarking, setIsMarking] = useState(false)
    const [markedIds, setMarkedIds] = useState<number[]>([])
    const [markedColor, setMarkedColor] = useState<DotColor | null>(null)
    const [adjacentIds, setAdjacentIds] = useState<number[]>([])

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // Timer countdown
    useEffect(() => {
        if (isGameOver) return

        intervalRef.current = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    setIsGameOver(true)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [isGameOver])

    // Clean up timer when game ends
    useEffect(() => {
        if (isGameOver && intervalRef.current) {
            clearInterval(intervalRef.current)
        }
    }, [isGameOver])

    const startMarking = useCallback((dotId: number) => {
        if (isGameOver) return

        const dot = dots.find((d) => d.id === dotId)
        if (!dot) return

        setIsMarking(true)
        setMarkedColor(dot.color)
        setMarkedIds([dotId])
        setDots((prev) =>
            prev.map((d) => (d.id === dotId ? { ...d, isMarked: true } : d))
        )
        setAdjacentIds(calculateAdjacent(dotId, size))
    }, [dots, isGameOver, size])

    const continueMarking = useCallback((dotId: number) => {
        if (!isMarking || isGameOver) return

        const dot = dots.find((d) => d.id === dotId)
        if (!dot) return

        // Check if dot is adjacent and same color
        if (adjacentIds.includes(dotId) && dot.color === markedColor && !markedIds.includes(dotId)) {
            setMarkedIds((prev) => [...prev, dotId])
            setDots((prev) =>
                prev.map((d) => (d.id === dotId ? { ...d, isMarked: true } : d))
            )
            setAdjacentIds(calculateAdjacent(dotId, size))
        }
    }, [isMarking, isGameOver, dots, adjacentIds, markedColor, markedIds, size])

    const finishMarking = useCallback(() => {
        if (!isMarking) return

        // Calculate score - only count if more than 1 dot was marked
        if (markedIds.length > 1) {
            setScore((prev) => prev + markedIds.length)
        }

        // Reset marked dots with new random colors
        setDots((prev) =>
            prev.map((d) => {
                if (markedIds.includes(d.id)) {
                    return {
                        ...d,
                        isMarked: false,
                        color: markedIds.length > 1 ? getRandomColor() : d.color,
                    }
                }
                return { ...d, isMarked: false }
            })
        )

        // Reset marking state
        setIsMarking(false)
        setMarkedIds([])
        setMarkedColor(null)
        setAdjacentIds([])
    }, [isMarking, markedIds])

    const resetGame = useCallback(() => {
        setDots(createBoard(size))
        setScore(0)
        setTimeRemaining(GAME_DURATION)
        setIsGameOver(false)
        setIsMarking(false)
        setMarkedIds([])
        setMarkedColor(null)
        setAdjacentIds([])
    }, [size])

    return {
        dots,
        score,
        timeRemaining,
        isGameOver,
        isMarking,
        markedIds,
        markedColor,
        startMarking,
        continueMarking,
        finishMarking,
        resetGame,
    }
}
