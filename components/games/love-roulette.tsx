'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Confetti } from '@/components/animations/confetti'
import { playSound } from '@/lib/sound'

interface LoveRouletteProps {
  onBack: () => void
}

type GameResult = 'adi-wins' | 'dev-wins' | 'tie' | null
type GamePhase = 'ready' | 'adi-turn' | 'transition' | 'dev-turn' | 'finished'

interface Question {
  id: number
  text: string
  options: string[]
  emoji: string
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'What is Dev most likely to do on a rainy day?',
    options: ['Code all day 💻', 'Watch movies 🎬', 'Think about Adi 💭'],
    emoji: '🌧️',
  },
  {
    id: 2,
    text: 'Adi\'s favorite way to spend time?',
    options: ['With Dev 💕', 'Shopping 🛍️', 'Gaming 🎮'],
    emoji: '⏰',
  },
  {
    id: 3,
    text: 'What makes both of them smile the most?',
    options: ['Each other 💑', 'Food 🍕', 'Jokes 😂'],
    emoji: '😊',
  },
  {
    id: 4,
    text: 'Their ideal date night would be?',
    options: ['Stargazing 🌙', 'Gaming together 🎮', 'Cooking together 👨‍🍳'],
    emoji: '🌹',
  },
  {
    id: 5,
    text: 'What\'s their love language?',
    options: ['Quality time ⏳', 'Acts of service 🤝', 'Sweet words 💬'],
    emoji: '💝',
  },
]

export function LoveRoulette({ onBack }: LoveRouletteProps) {
  const [gamePhase, setGamePhase] = useState<GamePhase>('ready')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [adiScore, setAdiScore] = useState(0)
  const [devScore, setDevScore] = useState(0)
  const [result, setResult] = useState<GameResult>(null)
  const [showAnimation, setShowAnimation] = useState(false)
  const [currentPlayer, setCurrentPlayer] = useState<'adi' | 'dev'>('adi')
  const [countdownValue, setCountdownValue] = useState(3)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)

  // Handle transition countdown
  useEffect(() => {
    if (gamePhase !== 'transition') return
    if (countdownValue === 0) {
      setCurrentPlayer('dev')
      setGamePhase('dev-turn')
      setSelectedAnswer(null)
      setAnswered(false)
      return
    }

    const timer = setTimeout(() => {
      setCountdownValue((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [gamePhase, countdownValue])

  // Check if all questions answered
  useEffect(() => {
    if (currentQuestion >= QUESTIONS.length && gamePhase === 'dev-turn') {
      setGamePhase('finished')
      determineWinner()
    }
  }, [currentQuestion, gamePhase])

  const handleAnswerSelect = (answerIndex: number) => {
    if (answered) return

    setSelectedAnswer(answerIndex)
    playSound('click')

    // Simulate a 70% chance of being correct for fun
    const isCorrect = Math.random() < 0.7

    setTimeout(() => {
      if (isCorrect) {
        playSound('win')
        if (currentPlayer === 'adi') {
          setAdiScore((prev) => prev + 1)
        } else {
          setDevScore((prev) => prev + 1)
        }
      } else {
        playSound('pop')
      }

      setAnswered(true)

      // Move to next question or transition
      setTimeout(() => {
        if (currentQuestion < QUESTIONS.length - 1) {
          setCurrentQuestion((prev) => prev + 1)

          if (currentPlayer === 'adi') {
            setGamePhase('transition')
            setCountdownValue(3)
          } else {
            setSelectedAnswer(null)
            setAnswered(false)
          }
        } else {
          // Last question - end game
          if (currentPlayer === 'adi') {
            setGamePhase('transition')
            setCountdownValue(3)
          } else {
            setGamePhase('finished')
            determineWinner()
          }
        }
      }, 1500)
    }, 800)
  }

  const determineWinner = () => {
    if (adiScore > devScore) {
      setResult('adi-wins')
    } else if (devScore > adiScore) {
      setResult('dev-wins')
    } else {
      setResult('tie')
    }
    playSound('end')
    setShowAnimation(true)
  }

  const startGame = () => {
    setCurrentQuestion(0)
    setAdiScore(0)
    setDevScore(0)
    setResult(null)
    setShowAnimation(false)
    setCurrentPlayer('adi')
    setGamePhase('adi-turn')
    setSelectedAnswer(null)
    setAnswered(false)
    playSound('start')
  }

  const getResultMessage = () => {
    if (gamePhase === 'adi-turn' || gamePhase === 'dev-turn') {
      const question = QUESTIONS[currentQuestion]
      return question.text
    }
    if (gamePhase === 'transition') {
      return `Dev's turn! Get ready...\n${countdownValue}`
    }
    switch (result) {
      case 'adi-wins':
        return '💙 Adi knows the love story best 👑💕'
      case 'dev-wins':
        return '💖 Dev wins — romantic genius 🎯✨'
      case 'tie':
        return '💞 Perfect match — you both get it 🥰'
      default:
        return 'Click "Start Game" to begin!'
    }
  }

  const playAgain = () => {
    startGame()
  }

  const currentQ = QUESTIONS[currentQuestion]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 overflow-hidden">
      {showAnimation && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <Confetti count={50} duration={2.5} delay={0} shape="sparkle" />
          <div className="text-8xl animate-bounce">💕</div>
          <div className="text-6xl animate-pulse ml-4">✨</div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 w-full max-w-lg z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Arcade
        </button>
        <h2 className="text-3xl font-bold text-center mb-2">Love Roulette 🎡</h2>
        <p className="text-center text-muted-foreground">Guess the answers and prove your love knowledge!</p>
      </div>

      {/* Game Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4 w-full max-w-lg z-10">
        <div className="text-center">
          <p className="text-lg font-bold text-blue-600">Adi: {adiScore}</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-muted-foreground">
            Q {currentQuestion + 1}/{QUESTIONS.length}
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-rose-600">Dev: {devScore}</p>
        </div>
      </div>

      {/* Game Area */}
      <div
        className={`relative w-full max-w-lg rounded-2xl shadow-xl overflow-hidden border-4 transition-all duration-300 bg-gradient-to-b p-6 ${
          currentPlayer === 'adi' ? 'from-blue-100 to-blue-50 border-blue-400' : 'from-rose-100 to-pink-50 border-rose-400'
        } mb-8`}
      >
        {/* Question Text */}
        <div className="mb-6">
          <div className="text-4xl text-center mb-2">{currentQ?.emoji}</div>
          <p className="text-center text-lg font-semibold text-foreground">{getResultMessage()}</p>
        </div>

        {/* Answer Options */}
        {(gamePhase === 'adi-turn' || gamePhase === 'dev-turn') && currentQ && (
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={answered}
                className={`w-full p-4 rounded-lg font-semibold transition-all duration-200 text-left ${
                  selectedAnswer === index
                    ? answered
                      ? 'bg-green-500 text-white scale-105'
                      : 'bg-yellow-400 text-black scale-105'
                    : 'bg-white text-foreground hover:bg-gray-100'
                } ${answered ? 'cursor-default' : 'cursor-pointer'}`}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4 z-10">
        {gamePhase === 'ready' && (
          <Button onClick={startGame} className="rounded-full px-8 bg-blue-600 text-white hover:bg-blue-700">
            Start Game
          </Button>
        )}

        {result && (
          <Button onClick={playAgain} className="rounded-full px-8 bg-blue-600 text-white hover:bg-blue-700">
            Play Again
          </Button>
        )}

        <Button
          onClick={onBack}
          variant="outline"
          className="rounded-full px-8 border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
        >
          Back to Home
        </Button>
      </div>

      {result && (
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Made with love for you, Adi 💕 — Dev</p>
        </div>
      )}
    </div>
  )
}
