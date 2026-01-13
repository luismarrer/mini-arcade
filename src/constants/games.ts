export interface Game {
  id: string
  title: string
  description: string
  image: string
  path: string
}

export const games: Game[] = [
    {
        id: "memory",
        title: "Pair-Memory (DC)",
        description: "Pair matching memory game with cards with DC characters.",
        image: "/images/memory.png",
        path: "/memory",
    },
    {
        id: "twodots",
        title: "Two-Dots",
        description: "Connect the dots of the same color to clear the board.",
        image: "/images/twodots.png",
        path: "/twodots",
    },
    {
        id: "hexapawn",
        title: "Hexapawn",
        description: "A simple AI that learns to play chess-like moves.",
        image: "/images/hexapawn.png",
        path: "/hexapawn",
    },
    {
        id: "hangman",
        title: "Hangman",
        description: "Guess the hidden word before it's too late!",
        image: "/images/hangman.png",
        path: "/hangman",
    },
    {
        id:"stack",
        title: "Stack Tower",
        description: "Stack the blocks as high as you can without toppling them.",
        image: "/images/stack.png",
        path: "/stack",
    },
    {
        id: "monkeytype",
        title: "MonkeyType",
        description: "Test your typing speed and accuracy with fun passages.",
        image: "/images/monkeytype.png",
        path: "/monkeytype",
    },
    {
        id: "tetris",
        title: "Tetris",
        description: "Classic block-stacking puzzle game.",
        image: "/images/tetris.png",
        path: "/tetris",
    }
]
