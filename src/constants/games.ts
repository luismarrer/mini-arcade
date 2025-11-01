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
        title: "Memory de parejas (DC)",
        description: "Juego de memoria de parejas con tarjetas de DC.",
        image: "/images/memory.png",
        path: "/games/memory",
    },
    {
        id: "twodots",
        title: "Two Dots",
        description: "Connect the dots of the same color to clear the board.",
        image: "/images/twodots.png",
        path: "/games/twodots",
    },
    {
        id: "hexapawn",
        title: "Hexapawn",
        description: "A simple AI that learns to play chess-like moves.",
        image: "/images/hexapawn.png",
        path: "/games/hexapawn",
    },
    {
        id: "hangman",
        title: "Hangman",
        description: "Guess the hidden word before it's too late!",
        image: "/images/hangman.png",
        path: "/games/hangman",
    },
]
