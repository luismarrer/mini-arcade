import { useEffect, useRef } from 'react'
import { createGameResultId, submitGameResult } from './game-results'
import type { GameResult } from '../types/game'

type PendingGameResult = Omit<GameResult, 'idempotencyKey'> & {
    idempotencyKey?: string
}

export function useGameResult(finished: boolean, result: PendingGameResult): void {
    const resultId = useRef(createGameResultId())
    const submitted = useRef(false)
    const latestResult = useRef(result)
    latestResult.current = result

    useEffect(() => {
        if (!finished) {
            submitted.current = false
            resultId.current = createGameResultId()
            return
        }

        if (submitted.current) return
        submitted.current = true

        const { idempotencyKey, ...gameResult } = latestResult.current
        void submitGameResult({
            ...gameResult,
            idempotencyKey: idempotencyKey ?? resultId.current,
        })
    }, [finished])
}
