import { supabase } from './supabase'
import type { GameResult, SavedGameResult } from '../types/game'

const GUEST_RESULTS_KEY = 'mini-arcade:guest-results'
const MAX_GUEST_RESULTS = 50

export function createGameResultId(): string {
    return crypto.randomUUID()
}

function readGuestResults(): GameResult[] {
    if (typeof window === 'undefined') return []

    try {
        const saved = localStorage.getItem(GUEST_RESULTS_KEY)
        return saved ? JSON.parse(saved) : []
    } catch {
        return []
    }
}

function saveGuestResult(result: GameResult): SavedGameResult {
    const previousResults = readGuestResults()
    const duplicate = previousResults.find(
        (item) => item.idempotencyKey === result.idempotencyKey
    )
    const comparableResults = previousResults.filter(
        (item) =>
            item.gameId === result.gameId &&
            item.mode === result.mode &&
            item.rulesVersion === result.rulesVersion
    )
    const previousBest = Math.max(-1, ...comparableResults.map((item) => item.score))

    if (!duplicate && typeof window !== 'undefined') {
        localStorage.setItem(
            GUEST_RESULTS_KEY,
            JSON.stringify([result, ...previousResults].slice(0, MAX_GUEST_RESULTS))
        )
    }

    return {
        storage: 'local',
        sessionId: result.idempotencyKey,
        pointsAwarded: null,
        totalPoints: null,
        isNewBest: !duplicate && result.score > previousBest,
    }
}

export async function submitGameResult(result: GameResult): Promise<SavedGameResult> {
    if (!supabase) return saveGuestResult(result)

    const { data: authData } = await supabase.auth.getSession()
    if (!authData.session) return saveGuestResult(result)

    const { data, error } = await supabase.rpc('submit_game_result', {
        requested_game_id: result.gameId,
        requested_rules_version: result.rulesVersion,
        requested_mode: result.mode,
        requested_outcome: result.outcome,
        requested_score: result.score,
        requested_duration_ms: result.durationMs ?? 0,
        requested_metadata: result.metadata ?? {},
        requested_idempotency_key: result.idempotencyKey,
    })

    const saved = data?.[0]
    if (error || !saved) {
        console.error('Could not save the game result in Supabase:', error)
        return saveGuestResult(result)
    }

    return {
        storage: 'cloud',
        sessionId: saved.session_id,
        pointsAwarded: saved.points_awarded,
        totalPoints: saved.total_points,
        isNewBest: saved.is_new_best,
    }
}

export function getGuestResults(): GameResult[] {
    return readGuestResults()
}
