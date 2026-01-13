import type { FC } from "react"

const GameContainer: FC = () => {
    return (
        <section id="gameContainer">
            <h2 className="visually-hidden">Game area</h2>
            <section id="gameArea">
                <div id="gameOver" role="region" aria-label="Game over">
                    <div className="gameOverText">
                        <h3>Game over!</h3>
                        <button id="newGame">Play again</button>
                    </div>
                </div>
                <div id="game" role="grid" aria-label="Two Dots game board" />
            </section>
            <header id="gameTitle">
                <h1>Two Dots</h1>
            </header>
        </section>
    )
}

export default GameContainer
