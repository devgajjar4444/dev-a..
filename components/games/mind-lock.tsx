'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react'
import { playSound } from '@/lib/sound'

interface GameState {
  adiSecret: string | null
  devSecret: string | null
  adiLowest: number
  adiHighest: number
  devLowest: number
  devHighest: number
  adiLastGuess: number | null
  devLastGuess: number | null
  adiLastHint: string | null
  devLastHint: string | null
  adiGuessCount: number
  devGuessCount: number
  currentTurn: 'setup' | 'adi' | 'dev' | 'countdown'
  countdownValue: number | null
  winner: 'adi' | 'dev' | null
  adiGuessHistory: number[]
  devGuessHistory: number[]
}

export function MindLock({ onBack }: { onBack: () => void }) {
  const [gameState, setGameState] = useState<GameState>({
    adiSecret: null,
    devSecret: null,
    adiLowest: 0,
    adiHighest: 99999,
    devLowest: 0,
    devHighest: 99999,
    adiLastGuess: null,
    devLastGuess: null,
    adiLastHint: null,
    devLastHint: null,
    adiGuessCount: 0,
    devGuessCount: 0,
    currentTurn: 'setup',
    countdownValue: null,
    winner: null,
    adiGuessHistory: [],
    devGuessHistory: [],
  })

  const [adiInput, setAdiInput] = useState('')
  const [devInput, setDevInput] = useState('')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const adiInputRef = useRef<HTMLInputElement>(null)
  const devInputRef = useRef<HTMLInputElement>(null)
  const shakeRef = useRef<HTMLDivElement>(null)

  const playGameSound = (type: string) => {
    if (!soundEnabled) return
    if (type === 'guess') playSound('correct')
    if (type === 'wrong') playSound('error')
    if (type === 'victory') playSound('victory')
  }

  const calculateHint = (guess: number, secret: number): string => {
    if (guess === secret) return 'CORRECT'
    return guess < secret ? 'Higher ⬆️' : 'Lower ⬇️'
  }

  const checkVictory = (guess: number, secret: string): boolean => {
    return guess === parseInt(secret)
  }

  const handleAdiSecretSubmit = () => {
    if (adiInput.length === 0 || adiInput.length > 5) return
    setGameState((prev) => ({
      ...prev,
      adiSecret: adiInput,
    }))
    setAdiInput('')
  }

  const handleDevSecretSubmit = () => {
    if (devInput.length === 0 || devInput.length > 5) return
    setGameState((prev) => ({
      ...prev,
      devSecret: devInput,
    }))
    setDevInput('')
  }

  const startCountdown = () => {
    setGameState((prev) => ({
      ...prev,
      currentTurn: 'countdown',
      countdownValue: 3,
    }))
    playGameSound('guess')

    let countdown = 3
    const countdownInterval = setInterval(() => {
      countdown--
      if (countdown < 0) {
        clearInterval(countdownInterval)
        setGameState((prev) => ({
          ...prev,
          currentTurn: 'adi',
          countdownValue: null,
        }))
        return
      }
      setGameState((prev) => ({
        ...prev,
        countdownValue: countdown,
      }))
    }, 1000)
  }

  const handleAdiGuess = (guess: number) => {
    if (!gameState.devSecret) return

    const secret = parseInt(gameState.devSecret)
    const hint = calculateHint(guess, secret)
    const isCorrect = checkVictory(guess, gameState.devSecret)

    if (isCorrect) {
      playGameSound('victory')
      setGameState((prev) => ({
        ...prev,
        adiLastGuess: guess,
        adiLastHint: 'CORRECT',
        adiGuessCount: prev.adiGuessCount + 1,
        adiGuessHistory: [...prev.adiGuessHistory, guess],
        winner: 'adi',
      }))
      return
    }

    playGameSound('guess')

    // Update range
    const newLowest = guess > gameState.adiLowest ? guess : gameState.adiLowest
    const newHighest = guess < gameState.adiHighest ? guess : gameState.adiHighest

    setGameState((prev) => ({
      ...prev,
      adiLastGuess: guess,
      adiLastHint: hint,
      adiLowest: newLowest,
      adiHighest: newHighest,
      adiGuessCount: prev.adiGuessCount + 1,
      adiGuessHistory: [...prev.adiGuessHistory, guess],
      currentTurn: 'dev',
    }))

    adiInputRef.current?.focus()
  }

  const handleDevGuess = (guess: number) => {
    if (!gameState.adiSecret) return

    const secret = parseInt(gameState.adiSecret)
    const hint = calculateHint(guess, secret)
    const isCorrect = checkVictory(guess, gameState.adiSecret)

    if (isCorrect) {
      playGameSound('victory')
      setGameState((prev) => ({
        ...prev,
        devLastGuess: guess,
        devLastHint: 'CORRECT',
        devGuessCount: prev.devGuessCount + 1,
        devGuessHistory: [...prev.devGuessHistory, guess],
        winner: 'dev',
      }))
      return
    }

    playGameSound('guess')

    // Update range
    const newLowest = guess > gameState.devLowest ? guess : gameState.devLowest
    const newHighest = guess < gameState.devHighest ? guess : gameState.devHighest

    setGameState((prev) => ({
      ...prev,
      devLastGuess: guess,
      devLastHint: hint,
      devLowest: newLowest,
      devHighest: newHighest,
      devGuessCount: prev.devGuessCount + 1,
      devGuessHistory: [...prev.devGuessHistory, guess],
      currentTurn: 'adi',
    }))

    devInputRef.current?.focus()
  }

  const resetGame = () => {
    setGameState({
      adiSecret: null,
      devSecret: null,
      adiLowest: 0,
      adiHighest: 99999,
      devLowest: 0,
      devHighest: 99999,
      adiLastGuess: null,
      devLastGuess: null,
      adiLastHint: null,
      devLastHint: null,
      adiGuessCount: 0,
      devGuessCount: 0,
      currentTurn: 'setup',
      countdownValue: null,
      winner: null,
      adiGuessHistory: [],
      devGuessHistory: [],
    })
    setAdiInput('')
    setDevInput('')
  }

  // Setup screen
  if (gameState.currentTurn === 'setup' && !gameState.adiSecret && !gameState.devSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-8">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Button
                onClick={onBack}
                variant="ghost"
                size="icon"
                className="absolute left-4 top-4 text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>

              <div className="flex items-center gap-2 justify-center">
                <span className="text-6xl">🧠</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">MindLock</h1>
            <p className="text-purple-200">Guess each other's secret number</p>
          </div>

          {/* Instructions */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">How to Play</h2>
            <div className="space-y-2 text-purple-100 text-sm">
              <p>✓ Both players secretly enter a number (0-99999)</p>
              <p>✓ Take turns guessing each other's number</p>
              <p>✓ Get hints to narrow down the range</p>
              <p>✓ First to guess correctly wins</p>
            </div>
          </div>

          {/* Setup forms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Adi's setup */}
            <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 backdrop-blur-md rounded-2xl p-8 border border-pink-400/30">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-3xl">💙</span>
                <h3 className="text-2xl font-bold text-white">Adi</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-pink-100 mb-2">
                    Your secret number
                  </label>
                  <input
                    ref={adiInputRef}
                    type="password"
                    value={adiInput}
                    onChange={(e) => setAdiInput(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAdiSecretSubmit()
                    }}
                    placeholder="••••••"
                    className="w-full bg-white/10 border border-pink-400/50 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20"
                  />
                  <p className="text-xs text-pink-200 mt-2">0-99999 (5 digits max)</p>
                </div>

                <Button
                  onClick={handleAdiSecretSubmit}
                  disabled={adiInput.length === 0 || gameState.adiSecret !== null}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold"
                >
                  {gameState.adiSecret ? '✓ Secret Set' : 'Set Your Secret'}
                </Button>
              </div>
            </div>

            {/* Dev's setup */}
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-md rounded-2xl p-8 border border-blue-400/30">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-3xl">💖</span>
                <h3 className="text-2xl font-bold text-white">Dev</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Your secret number
                  </label>
                  <input
                    ref={devInputRef}
                    type="password"
                    value={devInput}
                    onChange={(e) => setDevInput(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleDevSecretSubmit()
                    }}
                    placeholder="••••••"
                    className="w-full bg-white/10 border border-blue-400/50 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                  />
                  <p className="text-xs text-blue-200 mt-2">0-99999 (5 digits max)</p>
                </div>

                <Button
                  onClick={handleDevSecretSubmit}
                  disabled={devInput.length === 0 || gameState.devSecret !== null}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold"
                >
                  {gameState.devSecret ? '✓ Secret Set' : 'Set Your Secret'}
                </Button>
              </div>
            </div>
          </div>

          {/* Start button */}
          {gameState.adiSecret && gameState.devSecret && (
            <div className="mt-8 flex justify-center">
              <Button
                onClick={startCountdown}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-lg px-12 py-6 rounded-xl"
              >
                Let's Battle! 💥
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Countdown screen
  if (gameState.currentTurn === 'countdown') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center">
          {gameState.countdownValue !== null && gameState.countdownValue > 0 ? (
            <div className="animate-pulse">
              <p className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-4">
                {gameState.countdownValue}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-6xl font-bold text-white mb-4">🔥 START 🔥</p>
              <p className="text-2xl text-purple-300">Battle Begins!</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Game screen
  if (gameState.currentTurn === 'adi' || gameState.currentTurn === 'dev') {
    const isAdiTurn = gameState.currentTurn === 'adi'
    const currentPlayer = isAdiTurn ? 'Adi' : 'Dev'
    const currentColor = isAdiTurn ? 'pink' : 'blue'
    const playerEmoji = isAdiTurn ? '💙' : '💖'
    const opponentEmoji = isAdiTurn ? '💖' : '💙'

    const guessHistory = isAdiTurn ? gameState.adiGuessHistory : gameState.devGuessHistory
    const lowest = isAdiTurn ? gameState.adiLowest : gameState.devLowest
    const highest = isAdiTurn ? gameState.adiHighest : gameState.devHighest
    const lastHint = isAdiTurn ? gameState.adiLastHint : gameState.devLastHint
    const guessCount = isAdiTurn ? gameState.adiGuessCount : gameState.devGuessCount

    const handleGuessSubmit = (guess: number) => {
      if (isAdiTurn) {
        handleAdiGuess(guess)
      } else {
        handleDevGuess(guess)
      }
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-8">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        </div>

        <div className="relative z-10 w-full max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={onBack}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>

            <div className="text-center flex-1">
              <p className="text-purple-300 text-sm mb-1">Turn</p>
              <p className="text-3xl font-bold text-white">
                {playerEmoji} {currentPlayer}'s Turn
              </p>
            </div>

            <Button
              onClick={() => setSoundEnabled(!soundEnabled)}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              {soundEnabled ? (
                <Volume2 className="w-6 h-6" />
              ) : (
                <VolumeX className="w-6 h-6" />
              )}
            </Button>
          </div>

          {/* Main game area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Current player - guessing */}
            <div
              ref={shakeRef}
              className={`bg-gradient-to-br from-${currentColor}-500/20 to-${currentColor}-600/20 backdrop-blur-md rounded-2xl p-8 border border-${currentColor}-400/30`}
            >
              <div className="flex items-center gap-2 mb-6">
                <span className="text-3xl">{playerEmoji}</span>
                <h3 className="text-2xl font-bold text-white">Guessing Dev's Number</h3>
              </div>

              <div className="space-y-6">
                {/* Range display */}
                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <p className="text-xs text-gray-300 mb-2">Possible Range</p>
                  <p className="text-3xl font-bold text-white">
                    {lowest.toLocaleString()} ↔ {highest.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {highest - lowest + 1} possibilities left
                  </p>
                </div>

                {/* Last guess and hint */}
                {gameState.adiLastGuess !== null && isAdiTurn && (
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <p className="text-xs text-gray-300 mb-2">Last Guess</p>
                    <p className="text-2xl font-bold text-white mb-2">
                      {gameState.adiLastGuess}
                    </p>
                    <p className="text-lg font-bold text-purple-300">{lastHint}</p>
                  </div>
                )}
                {gameState.devLastGuess !== null && !isAdiTurn && (
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <p className="text-xs text-gray-300 mb-2">Last Guess</p>
                    <p className="text-2xl font-bold text-white mb-2">
                      {gameState.devLastGuess}
                    </p>
                    <p className="text-lg font-bold text-purple-300">{lastHint}</p>
                  </div>
                )}

                {/* Guess input */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Make your guess
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="guess-input"
                      type="number"
                      placeholder="Enter your guess"
                      className="flex-1 bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:ring-2 focus:ring-white/20"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.currentTarget
                          const guess = parseInt(input.value)
                          if (!isNaN(guess)) {
                            handleGuessSubmit(guess)
                            input.value = ''
                          }
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        const input = document.getElementById(
                          'guess-input'
                        ) as HTMLInputElement
                        const guess = parseInt(input.value)
                        if (!isNaN(guess)) {
                          handleGuessSubmit(guess)
                          input.value = ''
                        }
                      }}
                      className="bg-white/20 hover:bg-white/30 text-white font-bold px-6"
                    >
                      Guess
                    </Button>
                  </div>
                </div>

                {/* Guess counter */}
                <div className="bg-white/10 rounded-xl p-4 border border-white/20 text-center">
                  <p className="text-xs text-gray-300 mb-1">Guesses</p>
                  <p className="text-3xl font-bold text-white">{guessCount}</p>
                </div>

                {/* Recent guesses */}
                {guessHistory.length > 0 && (
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <p className="text-xs text-gray-300 mb-3">Recent Guesses</p>
                    <div className="flex flex-wrap gap-2">
                      {guessHistory.slice(-10).map((guess, i) => (
                        <span
                          key={i}
                          className="bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-lg"
                        >
                          {guess}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Opponent's stats */}
            <div className={`bg-gradient-to-br from-${currentColor === 'pink' ? 'blue' : 'pink'}-500/20 to-${currentColor === 'pink' ? 'blue' : 'pink'}-600/20 backdrop-blur-md rounded-2xl p-8 border border-${currentColor === 'pink' ? 'blue' : 'pink'}-400/30`}>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-3xl">{opponentEmoji}</span>
                <h3 className="text-2xl font-bold text-white">
                  {isAdiTurn ? 'Dev' : 'Adi'}'s Status
                </h3>
              </div>

              <div className="space-y-4">
                {/* Opponent's range */}
                <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                  <p className="text-xs text-gray-300 mb-2">Their Possible Range</p>
                  <p className="text-2xl font-bold text-white">
                    {isAdiTurn
                      ? `${gameState.devLowest.toLocaleString()} ↔ ${gameState.devHighest.toLocaleString()}`
                      : `${gameState.adiLowest.toLocaleString()} ↔ ${gameState.adiHighest.toLocaleString()}`}
                  </p>
                </div>

                {/* Opponent's last guess */}
                {isAdiTurn && gameState.devLastGuess !== null && (
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <p className="text-xs text-gray-300 mb-2">Their Last Guess</p>
                    <p className="text-2xl font-bold text-white mb-1">
                      {gameState.devLastGuess}
                    </p>
                    <p className="text-sm text-purple-300">{gameState.devLastHint}</p>
                  </div>
                )}
                {!isAdiTurn && gameState.adiLastGuess !== null && (
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <p className="text-xs text-gray-300 mb-2">Their Last Guess</p>
                    <p className="text-2xl font-bold text-white mb-1">
                      {gameState.adiLastGuess}
                    </p>
                    <p className="text-sm text-purple-300">{gameState.adiLastHint}</p>
                  </div>
                )}

                {/* Opponent's guess count */}
                <div className="bg-white/10 rounded-xl p-4 border border-white/20 text-center">
                  <p className="text-xs text-gray-300 mb-1">Their Guesses</p>
                  <p className="text-3xl font-bold text-white">
                    {isAdiTurn ? gameState.devGuessCount : gameState.adiGuessCount}
                  </p>
                </div>

                {/* Opponent's recent guesses */}
                {(isAdiTurn ? gameState.devGuessHistory : gameState.adiGuessHistory).length >
                  0 && (
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <p className="text-xs text-gray-300 mb-3">Their Recent Guesses</p>
                    <div className="flex flex-wrap gap-2">
                      {(isAdiTurn
                        ? gameState.devGuessHistory
                        : gameState.adiGuessHistory
                      )
                        .slice(-10)
                        .map((guess, i) => (
                          <span
                            key={i}
                            className="bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-lg"
                          >
                            {guess}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Victory screen
  if (gameState.winner) {
    const isAdiWinner = gameState.winner === 'adi'
    const winnerName = isAdiWinner ? 'Adi' : 'Dev'
    const winnerEmoji = isAdiWinner ? '💙' : '💖'
    const loserGuesses = isAdiWinner ? gameState.devGuessCount : gameState.adiGuessCount
    const winnerGuesses = isAdiWinner ? gameState.adiGuessCount : gameState.devGuessCount

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        {/* Confetti background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `fall ${2 + Math.random() * 2}s linear infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 text-center max-w-2xl">
          <div className="text-9xl mb-4 animate-bounce">{winnerEmoji}</div>
          <h1 className="text-5xl font-bold text-white mb-2">{winnerName} Wins!</h1>
          <p className="text-2xl text-purple-300 mb-8">
            Guessed in {winnerGuesses} attempts
          </p>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8">
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-gray-300 text-sm mb-2">Winner</p>
                <p className="text-4xl font-bold text-white">
                  {winnerEmoji} {winnerGuesses}
                </p>
              </div>
              <div>
                <p className="text-gray-300 text-sm mb-2">Opponent</p>
                <p className="text-4xl font-bold text-white">
                  {isAdiWinner ? '💖' : '💙'} {loserGuesses}
                </p>
              </div>
            </div>

            <div className="border-t border-white/20 pt-6">
              <p className="text-gray-300 mb-4">
                {winnerName} successfully cracked the code!
              </p>
            </div>
          </div>

          <Button
            onClick={resetGame}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-lg px-12 py-6 rounded-xl mr-4"
          >
            Play Again
          </Button>
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-white/10 text-white font-bold text-lg px-12 py-6 rounded-xl border-white/30 hover:bg-white/20"
          >
            Back to Arcade
          </Button>
        </div>
      </div>
    )
  }

  return null
}
