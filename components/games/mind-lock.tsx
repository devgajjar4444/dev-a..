'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Confetti } from '@/components/animations/confetti'
import { playSound } from '@/lib/sound'

interface MindLockProps {
  onBack: () => void
}

type GamePhase = 'intro' | 'number-entry-adi' | 'number-entry-dev' | 'countdown' | 'playing' | 'winner'
type CurrentPlayer = 'adi' | 'dev'

interface GuessHistory {
  guess: number
  feedback: string
}

interface GameState {
  adiSecretNumber: number | null
  devSecretNumber: number | null
  adiGuesses: GuessHistory[]
  devGuesses: GuessHistory[]
  adiLowestClose: number | null
  adiHighestClose: number | null
  devLowestClose: number | null
  devHighestClose: number | null
  currentPlayer: CurrentPlayer
  winner: 'adi' | 'dev' | null
}

export function MindLock({ onBack }: MindLockProps) {
  const [phase, setPhase] = useState<GamePhase>('intro')
  const [gameState, setGameState] = useState<GameState>({
    adiSecretNumber: null,
    devSecretNumber: null,
    adiGuesses: [],
    devGuesses: [],
    adiLowestClose: null,
    adiHighestClose: null,
    devLowestClose: null,
    devHighestClose: null,
    currentPlayer: 'adi',
    winner: null,
  })
  const [inputValue, setInputValue] = useState('')
  const [countdownNum, setCountdownNum] = useState(3)
  const [errorMessage, setErrorMessage] = useState('')

  // Countdown effect
  useEffect(() => {
    if (phase === 'countdown' && countdownNum > 0) {
      const timer = setTimeout(() => {
        setCountdownNum(countdownNum - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (phase === 'countdown' && countdownNum === 0) {
      playSound('start')
      setPhase('playing')
      setCountdownNum(3)
    }
  }, [phase, countdownNum])

  // Reset game state properly when unmounting or returning to home
  const resetGame = () => {
    setPhase('intro')
    setGameState({
      adiSecretNumber: null,
      devSecretNumber: null,
      adiGuesses: [],
      devGuesses: [],
      adiLowestClose: null,
      adiHighestClose: null,
      devLowestClose: null,
      devHighestClose: null,
      currentPlayer: 'adi',
      winner: null,
    })
    setInputValue('')
    setCountdownNum(3)
    setErrorMessage('')
  }

  const handleNumberEntry = (value: string) => {
    const num = parseInt(value)
    
    if (value === '') {
      setInputValue('')
      setErrorMessage('')
      return
    }

    if (isNaN(num)) {
      setErrorMessage('Please enter a valid number')
      return
    }

    if (num < 1 || num > 1000) {
      setErrorMessage('Number must be between 1 and 1000')
      return
    }

    setInputValue(value)
    setErrorMessage('')
  }

  const handleNumberSubmit = () => {
    const num = parseInt(inputValue)

    if (isNaN(num) || num < 1 || num > 1000) {
      setErrorMessage('Please enter a valid number between 1 and 1000')
      return
    }

    playSound('start')

    if (phase === 'number-entry-adi') {
      setGameState({
        ...gameState,
        adiSecretNumber: num,
      })
      setInputValue('')
      setPhase('number-entry-dev')
      setErrorMessage('')
    } else if (phase === 'number-entry-dev') {
      setGameState({
        ...gameState,
        devSecretNumber: num,
      })
      setInputValue('')
      setPhase('countdown')
      setErrorMessage('')
    }
  }

  const getRange = (player: CurrentPlayer) => {
    if (player === 'adi') {
      return {
        lowest: gameState.adiLowestClose,
        highest: gameState.adiHighestClose,
      }
    }
    return {
      lowest: gameState.devLowestClose,
      highest: gameState.devHighestClose,
    }
  }

  const getSecretNumber = (player: CurrentPlayer) => {
    return player === 'adi' ? gameState.devSecretNumber : gameState.adiSecretNumber
  }

  const handleGuess = (guess: number) => {
    const secretNum = getSecretNumber(gameState.currentPlayer)

    if (!secretNum) return

    let feedback = ''
    const isCorrect = guess === secretNum

    if (isCorrect) {
      feedback = gameState.currentPlayer === 'adi' ? '💖 Found Dev\'s Heart! 💖' : '✨ Read Adi\'s Mind! ✨'
      playSound('win')
    } else if (guess < secretNum) {
      feedback = 'Try Higher 💫'
      playSound('click')
    } else {
      feedback = 'Too High 🌙'
      playSound('pop')
    }

    // Update game state with new guess
    const newGameState = { ...gameState }

    if (gameState.currentPlayer === 'adi') {
      newGameState.adiGuesses = [...gameState.adiGuesses, { guess, feedback }]

      // Update closest guesses for Adi
      if (guess < secretNum) {
        if (newGameState.adiLowestClose === null || guess > newGameState.adiLowestClose) {
          newGameState.adiLowestClose = guess
        }
      } else if (guess > secretNum) {
        if (newGameState.adiHighestClose === null || guess < newGameState.adiHighestClose) {
          newGameState.adiHighestClose = guess
        }
      }
    } else {
      newGameState.devGuesses = [...gameState.devGuesses, { guess, feedback }]

      // Update closest guesses for Dev
      if (guess < secretNum) {
        if (newGameState.devLowestClose === null || guess > newGameState.devLowestClose) {
          newGameState.devLowestClose = guess
        }
      } else if (guess > secretNum) {
        if (newGameState.devHighestClose === null || guess < newGameState.devHighestClose) {
          newGameState.devHighestClose = guess
        }
      }
    }

    if (isCorrect) {
      newGameState.winner = gameState.currentPlayer
      setPhase('winner')
    } else {
      // Switch to next player
      newGameState.currentPlayer = gameState.currentPlayer === 'adi' ? 'dev' : 'adi'
    }

    setGameState(newGameState)
    setInputValue('')
    setErrorMessage('')
  }

  const handleGuessInput = (value: string) => {
    const num = parseInt(value)

    if (value === '') {
      setInputValue('')
      setErrorMessage('')
      return
    }

    if (isNaN(num)) {
      setErrorMessage('Please enter a valid number')
      return
    }

    if (num < 1 || num > 1000) {
      setErrorMessage('Number must be between 1 and 1000')
      return
    }

    setInputValue(value)
    setErrorMessage('')
  }

  const getCurrentGuesses = () => {
    return gameState.currentPlayer === 'adi' ? gameState.adiGuesses : gameState.devGuesses
  }

  const getRange2 = () => {
    const range = getRange(gameState.currentPlayer)
    const parts = []

    if (range.lowest !== null && range.highest !== null) {
      parts.push(`Number is between ${range.lowest} and ${range.highest}`)
    } else if (range.lowest !== null) {
      parts.push(`Number is higher than ${range.lowest}`)
    } else if (range.highest !== null) {
      parts.push(`Number is lower than ${range.highest}`)
    }

    return parts
  }

  const handleBack = () => {
    resetGame()
    onBack()
  }

  // Intro Screen
  if (phase === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900">
        <button
          onClick={handleBack}
          className="absolute top-8 left-8 flex items-center gap-2 text-white hover:text-pink-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Arcade
        </button>

        <div className="text-center max-w-md">
          <div className="text-8xl mb-6 animate-pulse">🔐</div>
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
            Mind Lock
          </h1>
          <p className="text-xl text-pink-200 mb-4">Guess your partner's hidden heart</p>
          <p className="text-sm text-purple-200 mb-12">
            Enter a secret number. Then guess Dev's number. The closest one wins.
          </p>

          <Button
            onClick={() => setPhase('number-entry-adi')}
            className="rounded-full px-12 py-6 text-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0"
          >
            Begin 💖
          </Button>

          <div className="mt-12 text-xs text-purple-300">
            <p>Choose a number between 1 - 1000</p>
          </div>
        </div>
      </div>
    )
  }

  // Number Entry - Adi
  if (phase === 'number-entry-adi') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900">
        <button
          onClick={handleBack}
          className="absolute top-8 left-8 flex items-center gap-2 text-white hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">💙</div>
          <h2 className="text-4xl font-bold text-white mb-2">Adi</h2>
          <p className="text-lg text-blue-200 mb-8">Enter your secret number for Dev to guess</p>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
            <div className="text-4xl font-bold text-blue-300 mb-6 tracking-wider">
              {inputValue || '○ ○ ○'}
            </div>
            <input
              type="number"
              min="1"
              max="1000"
              value={inputValue}
              onChange={(e) => handleNumberEntry(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleNumberSubmit()}
              className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white text-center text-xl focus:outline-none focus:border-blue-400 placeholder-white/50"
              placeholder="Enter number (1-1000)"
              autoFocus
            />
            {errorMessage && <p className="text-red-300 text-sm mt-3">{errorMessage}</p>}
          </div>

          <Button
            onClick={handleNumberSubmit}
            disabled={!inputValue}
            className="w-full rounded-xl py-3 bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
          >
            Next →
          </Button>
        </div>
      </div>
    )
  }

  // Number Entry - Dev
  if (phase === 'number-entry-dev') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gradient-to-br from-pink-900 via-purple-900 to-pink-900">
        <button
          onClick={handleBack}
          className="absolute top-8 left-8 flex items-center gap-2 text-white hover:text-pink-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">💖</div>
          <h2 className="text-4xl font-bold text-white mb-2">Dev</h2>
          <p className="text-lg text-pink-200 mb-8">Enter your secret number for Adi to guess</p>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
            <div className="text-4xl font-bold text-pink-300 mb-6 tracking-wider">
              {inputValue || '○ ○ ○'}
            </div>
            <input
              type="number"
              min="1"
              max="1000"
              value={inputValue}
              onChange={(e) => handleNumberEntry(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleNumberSubmit()}
              className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white text-center text-xl focus:outline-none focus:border-pink-400 placeholder-white/50"
              placeholder="Enter number (1-1000)"
              autoFocus
            />
            {errorMessage && <p className="text-red-300 text-sm mt-3">{errorMessage}</p>}
          </div>

          <Button
            onClick={handleNumberSubmit}
            disabled={!inputValue}
            className="w-full rounded-xl py-3 bg-pink-500 hover:bg-pink-600 text-white disabled:opacity-50"
          >
            Next →
          </Button>
        </div>
      </div>
    )
  }

  // Countdown Screen
  if (phase === 'countdown') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900">
        <div className="text-center">
          {countdownNum > 0 ? (
            <div className="text-9xl font-bold text-white animate-bounce mb-8">{countdownNum}</div>
          ) : (
            <div className="text-8xl mb-6 animate-pulse">💖</div>
          )}
        </div>
      </div>
    )
  }

  // Playing Screen
  if (phase === 'playing') {
    const currentGuesses = getCurrentGuesses()
    const range = getRange(gameState.currentPlayer)
    const rangeText = getRange2()

    return (
      <div
        className={`flex flex-col items-center justify-center min-h-screen px-4 py-8 ${
          gameState.currentPlayer === 'adi'
            ? 'bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900'
            : 'bg-gradient-to-br from-pink-900 via-purple-900 to-pink-900'
        }`}
      >
        <button
          onClick={handleBack}
          className="absolute top-8 left-8 flex items-center gap-2 text-white hover:text-opacity-70 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="max-w-2xl w-full">
          {/* Player Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-2">{gameState.currentPlayer === 'adi' ? '💙' : '💖'}</div>
            <h2 className="text-4xl font-bold text-white mb-2">
              {gameState.currentPlayer === 'adi' ? 'Adi' : 'Dev'}'s Turn
            </h2>
            <p className={`text-lg ${gameState.currentPlayer === 'adi' ? 'text-blue-200' : 'text-pink-200'}`}>
              Guess {gameState.currentPlayer === 'adi' ? 'Dev' : 'Adi'}'s number
            </p>
          </div>

          {/* Range Info */}
          {rangeText.length > 0 && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8 text-white text-center">
              {rangeText.map((text, idx) => (
                <p key={idx} className="text-lg font-semibold">
                  {text}
                </p>
              ))}
            </div>
          )}

          {/* Guess Input */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
            <input
              type="number"
              min="1"
              max="1000"
              value={inputValue}
              onChange={(e) => handleGuessInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && inputValue && handleGuess(parseInt(inputValue))}
              className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-3 text-white text-center text-2xl focus:outline-none focus:border-white/50 placeholder-white/50 mb-4"
              placeholder="Enter your guess"
              autoFocus
            />
            {errorMessage && <p className="text-red-300 text-sm text-center">{errorMessage}</p>}
            <Button
              onClick={() => inputValue && handleGuess(parseInt(inputValue))}
              disabled={!inputValue}
              className="w-full rounded-xl py-3 bg-white/20 hover:bg-white/30 text-white disabled:opacity-50"
            >
              Guess
            </Button>
          </div>

          {/* Previous Guesses */}
          {currentGuesses.length > 0 && (
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-white font-semibold mb-4 text-center">Previous Guesses</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {currentGuesses.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-white/80 text-sm">
                    <span className="font-mono font-bold text-white">{item.guess}</span>
                    <span>{item.feedback}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Winner Screen
  if (phase === 'winner') {
    const guesses = gameState.winner === 'adi' ? gameState.adiGuesses.length : gameState.devGuesses.length
    const winnerName = gameState.winner === 'adi' ? 'Adi' : 'Dev'
    const loserName = gameState.winner === 'adi' ? 'Dev' : 'Adi'

    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900">
        <Confetti count={50} duration={3} delay={0} shape="heart" />

        <div className="text-center max-w-md relative z-10">
          <div className="text-9xl mb-6 animate-bounce">🔐</div>
          <div className="text-8xl animate-pulse mb-6">💖</div>

          <h2 className="text-5xl font-bold text-white mb-4">
            {gameState.winner === 'adi' ? '💙' : '💖'} {winnerName} Wins!
          </h2>

          <p className="text-xl text-purple-200 mb-2">
            {gameState.winner === 'adi'
              ? '💙 Read Adi\'s Mind 💙'
              : '💖 Found Dev\'s Heart 💖'}
          </p>

          <p className="text-lg text-white/80 mb-8">
            Guessed in {guesses} attempt{guesses !== 1 ? 's' : ''}
          </p>

          <div className="mb-8 space-y-3">
            <Button
              onClick={() => {
                resetGame()
                setPhase('number-entry-adi')
              }}
              className="w-full rounded-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
            >
              Play Again 💖
            </Button>
            <Button
              onClick={handleBack}
              className="w-full rounded-full py-3 bg-white/20 hover:bg-white/30 text-white"
            >
              Back to Arcade
            </Button>
          </div>

          <p className="text-xs text-purple-300 italic">
            I made this game for you, Adi 💕 — Dev
          </p>
        </div>
      </div>
    )
  }

  return null
}
