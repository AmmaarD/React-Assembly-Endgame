import React from "react"
import { languages } from "./languages"
import { clsx } from "clsx"
import { getFarewellText, getRandomWord } from "./utils"
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'

export default function AssemblyEndgame() {

    const [currentWord, setCurrentWord] = React.useState(() => getRandomWord())
    const [guessedLetters, setGuessedLetters] = React.useState([])

    const wrongGuessCount = guessedLetters.filter(letter => 
        !currentWord.includes(letter)).length
    
    const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))
    const isGameLost = wrongGuessCount >= languages.length - 1

    const isGameOver = isGameWon || isGameLost
    
    const numGuessesLeft = languages.length - 1
    const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
    const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

    function addGuessedLetter(letter) {
        setGuessedLetters(prevLetters => 
            prevLetters.includes(letter) ? 
                prevLetters : 
                [...prevLetters, letter]
        )
    }

    const letterElements = currentWord.split("").map((letter, index) => {
        const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
        const letterClassName = clsx(
            isGameLost && !guessedLetters.includes(letter) && "missed-letter"
        )
        return <span key={index} className={letterClassName}>{shouldRevealLetter ? letter.toUpperCase() : ""}</span>
    })

    const alphabet = "abcdefghijklmnopqrstuvwxyz"

    const keyboardElements = alphabet.split("").map(letter => {
        const isGuessed = guessedLetters.includes(letter)
        const isCorrect = isGuessed && currentWord.includes(letter)
        const isWrong = isGuessed && !currentWord.includes(letter)
        const className = clsx({
            correct: isCorrect,
            wrong: isWrong
        })
        
        return (
            <button
                className={className}
                key={letter}
                disabled={isGameOver}
                aria-disabled={guessedLetters.includes(letter)}
                aria-label={`Letter ${letter}`}
                onClick={() => addGuessedLetter(letter)}
            >
                {letter.toUpperCase()}
            </button>
        )
    })

    function startNewGame() {
        setCurrentWord(getRandomWord())
        setGuessedLetters([])
    }

    const languageElements = languages.map((lang, index) => {
        const isLanguageLost = index < wrongGuessCount
        const styles = {
            backgroundColor: lang.backgroundColor,
            color: lang.color
        }
        const className = clsx("chip", isLanguageLost && "lost")
        return (
            <span 
                key={lang.name} 
                className={className}
                style={styles}
            >
                {lang.name}
            </span>
        )
    })

    const gameStatusClass = clsx("game-status", {
        won: isGameWon,
        lost: isGameLost,
        farewell: !isGameOver && isLastGuessIncorrect
    })

    function renderGameStatus() {
        if (!isGameOver && isLastGuessIncorrect) {
            return <p className="farewell-message">{getFarewellText(languages[wrongGuessCount -1].name)}</p>
        }
        else if (isGameWon) {
            return (
                <>
                    <h2>You win!</h2>
                    <p>🎉 Well done! 🎉</p>
                </>
            )
        } 
        else if (isGameLost) {
            return (
                <>
                    <h2>Game over!</h2>
                    <p>You lose! Better start learning Assembly 😭</p>
                </>
            )
        }
        
        return null
    }


    const { width, height } = useWindowSize()
    return (
        <main>
            {
                isGameWon && 
                    <Confetti
                        recycle={false}
                        numberOfPieces={1000}
                        width={width}
                        height={height}
                    />
            }
            <header>
                <h1>Assembly Endgame</h1>
                <p>Guess the word within 8 attempts to keep the 
                programming world safe from Assembly!</p>
            </header>
            <section aria-live="polite" role="status" className={gameStatusClass}>
                {renderGameStatus()}
            </section>
            <section className="language-chips">
                {languageElements}
            </section>
            <section className="word">
                {letterElements}
            </section>
            <section 
                className="sr-only" 
                aria-live="polite" 
                role="status"
            >
                <p>
                    {currentWord.includes(lastGuessedLetter) ? 
                        `Correct! The letter ${lastGuessedLetter} is in the word.` : 
                        `Sorry, the letter ${lastGuessedLetter} is not in the word.`
                    }
                    You have {numGuessesLeft} attempts left.
                </p>
                <p>Current word: {currentWord.split("").map(letter => 
                guessedLetters.includes(letter) ? letter + "." : "blank.")
                .join(" ")}</p>
            
            </section>
            <section className="keyboard">
                {keyboardElements}
            </section>
            {isGameOver && <button className="new-game" onClick={startNewGame}>New Game</button>}

        </main>
    )
}
