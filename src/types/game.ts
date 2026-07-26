import type { Json } from './database'

export const GAME_IDS = ['memory', 'twodots', 'hexapawn', 'hangman'] as const

export type GameId = (typeof GAME_IDS)[number]
export type GameOutcome = 'won' | 'lost' | 'completed'

export interface GameResult {
    gameId: GameId
    rulesVersion: number
    mode: string
    outcome: GameOutcome
    score: number
    durationMs?: number
    metadata?: Json
    idempotencyKey: string
}

export interface SavedGameResult {
    storage: 'cloud' | 'local'
    sessionId: string
    pointsAwarded: number | null
    totalPoints: number | null
    isNewBest: boolean
}
