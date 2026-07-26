export type GameStatus = "playable" | "in-development" | "planned"

export interface GameStatusDetails {
    label: string
    description: string
    actionLabel: string
    actionAriaLabel: (title: string) => string
    groupLabel: string
    countLabel: string
}

export const gameStatuses: Record<GameStatus, GameStatusDetails> = {
    playable: {
        label: "Playable",
        description: "Complete game loop, ready to play now.",
        actionLabel: "Play",
        actionAriaLabel: (title) => `Play ${title}`,
        groupLabel: "Playable now",
        countLabel: "games",
    },
    "in-development": {
        label: "In development",
        description: "A visible build that is not a complete game yet.",
        actionLabel: "View progress",
        actionAriaLabel: (title) => `View development progress for ${title}`,
        groupLabel: "In development",
        countLabel: "builds",
    },
    planned: {
        label: "Planned",
        description: "On the roadmap, but development has not started.",
        actionLabel: "View plan",
        actionAriaLabel: (title) => `View the plan for ${title}`,
        groupLabel: "Planned next",
        countLabel: "games",
    },
}

export const catalogStatusOrder: GameStatus[] = [
    "playable",
    "in-development",
    "planned",
]

export interface Game {
    id: string
    title: string
    description: string
    path: string
    status: GameStatus
    category: string
    session: string
    accent: string
    accentSoft: string
}

export const games: Game[] = [
    {
        id: "memory",
        title: "Pair-Memory (DC)",
        description: "Match DC characters before your attempts run out.",
        path: "/memory",
        status: "playable",
        category: "Memory",
        session: "3–6 min",
        accent: "#ef476f",
        accentSoft: "#311722",
    },
    {
        id: "twodots",
        title: "Two-Dots",
        description: "Connect neighboring dots of the same color against the clock.",
        path: "/twodots",
        status: "playable",
        category: "Puzzle",
        session: "60 sec",
        accent: "#10b981",
        accentSoft: "#102c28",
    },
    {
        id: "hexapawn",
        title: "Hexapawn",
        description: "A tiny three-by-three strategy game against a computer that prioritizes captures.",
        path: "/hexapawn",
        status: "playable",
        category: "Strategy",
        session: "2–4 min",
        accent: "#00ff41",
        accentSoft: "#102619",
    },
    {
        id: "hangman",
        title: "Hangman",
        description: "Work through the alphabet and uncover the hidden word in nine misses or fewer.",
        path: "/hangman",
        status: "playable",
        category: "Words",
        session: "1–3 min",
        accent: "#3b82f6",
        accentSoft: "#111f37",
    },
    {
        id: "stack",
        title: "Stack",
        description: "Stack moving blocks and keep the tower balanced.",
        path: "/stack",
        status: "in-development",
        category: "Timing",
        session: "In the lab",
        accent: "#f59e0b",
        accentSoft: "#302311",
    },
    {
        id: "monkeytype",
        title: "MonkeyType",
        description: "A typing experiment for speed, accuracy and rhythm.",
        path: "/monkeytype",
        status: "in-development",
        category: "Typing",
        session: "In the lab",
        accent: "#9b5cff",
        accentSoft: "#251839",
    },
    {
        id: "tetris",
        title: "Tetris",
        description: "The classic falling-block puzzle, currently being rebuilt for this collection.",
        path: "/tetris",
        status: "in-development",
        category: "Puzzle",
        session: "In the lab",
        accent: "#22b8cf",
        accentSoft: "#112a31",
    },
]

export const getGame = (id: string) => games.find((game) => game.id === id)

export const getGamesByStatus = (status: GameStatus) =>
    games.filter((game) => game.status === status)

export const getGameCount = (status: GameStatus) =>
    getGamesByStatus(status).length
