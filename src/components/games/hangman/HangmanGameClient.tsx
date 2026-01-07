import { useEffect, useState } from "react"
import { HangImage } from "./HangImage"
import { getRandomWord } from "./getRandomWord"
import { letters } from "./letters"


// import "./App.css"


function App() {


  const [word, setWord] = useState(getRandomWord())
  const [hiddenWord, setHiddenWord] = useState('_ '.repeat(word.length))
  const [attempts, setAttempts] = useState(0)
  const [lose, setLose] = useState(false)
  const [won, setWon] = useState(false)

  // Detect lose
  useEffect(() => {
    if (attempts === 9) {
      setLose(true)
    }
  }, [attempts]) // hooks

  // Detect win
  useEffect(() => {
    const currentHiddenWord = hiddenWord.replaceAll(' ', '')
    if (currentHiddenWord === word) {
      setWon(true)
    }
  }, [hiddenWord]) // hooks

  const checkLetter = (letter: string) => {

    if (won || lose) return

    if (!word.includes(letter)) {
      setAttempts(Math.min(attempts + 1, 9))
      return
    }


    const hiddenWordArray = hiddenWord.split(' ')
    for (let i = 0; i < word.length; i++) {
      if (word[i] === letter) {
        hiddenWordArray[i] = letter
      }
    }
    setHiddenWord(hiddenWordArray.join(' '))

  }

  const newGame = () => {
    const newWord = getRandomWord()
    setWord(newWord)
    setHiddenWord('_ '.repeat(newWord.length))
    setAttempts(0)
    setLose(false)
    setWon(false)
  }


  return (
    <div className="max-w-7xl mx-auto p-8 text-center">
      {/* Images */}
      <HangImage imageNumber={attempts} />

      {/* Word to guess */}
      <h3 className="text-2xl font-bold my-4">{hiddenWord}</h3>

      {/* Attempts counter */}
      <h3 className="text-xl my-3">Attempts: {attempts}</h3>

      {/* Lose message */}
      {
        lose && (
          <h3 className="text-2xl font-bold text-red-500 my-4">LOSE GAME {word}</h3>
        )
      }

      {/* Win message */}
      {
        won && (
          <h3 className="text-2xl font-bold text-green-500 my-4">WIN GAME Congrats!</h3>
        )
      }

      {/* Buttons letters */}
      <div className="p-8 my-4">
        {
          letters.map((letter) => (
            <button
              key={letter}
              className="px-4 py-2 m-1 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
              onClick={() => checkLetter(letter)}>
              {letter}
            </button>
          ))
        }
      </div>

      {/* Reset button */}
      <button 
        className="px-6 py-3 mt-4 bg-green-500 hover:bg-green-600 text-white rounded font-semibold transition-colors"
        onClick={newGame}>
        New Game
      </button>
    </div>
  )
}

export default App
