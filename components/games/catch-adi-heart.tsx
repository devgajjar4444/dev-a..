'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Confetti } from '@/components/animations/confetti'
import { playSound } from '@/lib/sound'

interface CatchAdiHeartProps {
  onBack: () => void
}

interface FloatingHeart {
  id: number
  x: number
  y: number
  isBlue: boolean
}

type GameResult = 'adi-faster' | 'dev-faster' | 'tie' | null

export function CatchAdiHeart({ onBack }: CatchAdiHeartProps) {
  const [gameStarted, setGameStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [currentPlayer, setCurrentPlayer] = useState<'adi' | 'dev'>('adi')
  const [hearts, setHearts] = useState<FloatingHeart[]>([])
  const [caught, setCaught] = useState(false)
  const [result, setResult] = useState<GameResult>(null)
  const [showAnimation, setShowAnimation] = useState(false)
  const [adiTime, setAdiTime] = useState<number | null>(null)
  const [devTime, setDevTime] = useState<number | null>(null)
  const heartIdRef = useRef(0)
  const startTimeRef = useRef<number | null>(null)

  // Game timer
  useEffect(() => {
    if (!gameStarted || caught) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev + 0.01)

      // Timeout after 10 seconds
      if (timeLeft > 10) {
        setGameStarted(false)
        setHearts([])
        proceedToNextTurn()
      }
    }, 10)

    return () => clearInterval(timer)
  }, [gameStarted, timeLeft, caught])

  // Generate floating hearts
  useEffect(() => {
    if (!gameStarted) return

    const interval = setInterval(() => {
      const isBlue = Math.random() < 0.2 // 20% chance for blue heart
      const newHeart: FloatingHeart = {
        id: heartIdRef.current++,
        x: Math.random() * 80 + 10,
        y: -10,
        isBlue,
      }
      setHearts((prev) => [...prev, newHeart])

      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== newHeart.id))
      }, 5000)
    }, 300)

    return () => clearInterval(interval)
  }, [gameStarted])

  const handleHeartClick = (heart: FloatingHeart) => {
    if (!gameStarted || caught) return

    if (heart.isBlue) {
      playSound('win')
      setCaught(true)
      setGameStarted(false)
      setHearts([])

      const catchTime = timeLeft

      if (currentPlayer === 'adi') {
        setAdiTime(catchTime)
      } else {
        setDevTime(catchTime)
      }

      proceedToNextTurn()
    }
  }

  const proceedToNextTurn = () => {
    if (currentPlayer === 'adi') {
      setCurrentPlayer('dev')
      setCaught(false)
      setTimeLeft(0)
    } else {
      determineWinner()
    }
  }

  const determineWinner = () => {
    if (adiTime === null || devTime === null) return

    if (adiTime < devTime) {
      setResult('adi-faster')
    } else if (devTime < adiTime) {
      setResult('dev-faster')
    } else {
      setResult('tie')
    }
    setShowAnimation(true)
  }

  const startGame = () => {
    setGameStarted(true)
    setTimeLeft(0)
    setCaught(false)
    setAdiTime(null)
    setDevTime(null)
    setResult(null)
    setShowAnimation(false)
    setCurrentPlayer('adi')
    setHearts([])
    heartIdRef.current = 0
  }

  const getTurnColor = () => {
    return currentPlayer === 'adi' ? 'from-blue-100 to-blue-50' : 'from-rose-100 to-pink-50'
  }

  const getTurnBorderColor = () => {
    return currentPlayer === 'adi' ? 'border-blue-400' : 'border-rose-400'
  }

  const getResultMessage = () => {
    switch (result) {
      case 'adi-faster':
        return '💙 Of course… Adi owns her heart 😌'
      case 'dev-faster':
        return "💖 Dev caught Adi's heart again 💘"
      case 'tie':
        return '💞 Heart refuses to choose — too much love'
      default:
        if (!gameStarted && !caught) {
          return 'Find and click the BLUE heart! 💙'
        }
        return `${currentPlayer === 'adi' ? '💙 Adi' : '💖 Dev'}: Click the blue heart!`
    }
  }

  const playAgain = () => {
    startGame()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 overflow-hidden">
      {showAnimation && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <Confetti count={40} duration={2.5} delay={0} shape="heart" />
        </div>
      )}

      {/* Header */}
      <div className="mb-8 w-full max-w-md z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Arcade
        </button>
        <h2 className="text-3xl font-bold text-center mb-2">Catch Adi's Heart</h2>
        <p className="text-center text-muted-foreground">Find the blue heart 💙</p>
      </div>

      {/* Game Stats */}
      {(adiTime !== null || devTime !== null) && (
        <div className="mb-6 grid grid-cols-2 gap-4 w-full max-w-md z-10 text-center">
          {adiTime !== null && (
            <div>
              <p className="text-lg font-bold text-blue-600">
                Adi: {adiTime.toFixed(2)}s
              </p>
            </div>
          )}
          {devTime !== null && (
            <div>
              <p className="text-lg font-bold text-rose-600">
                Dev: {devTime.toFixed(2)}s
              </p>
            </div>
          )}
        </div>
      )}

      {/* Game Area */}
      <div
        className={`relative w-full max-w-md h-96 mb-8 rounded-2xl shadow-xl overflow-hidden border-4 transition-all duration-300 bg-gradient-to-b ${getTurnColor()} ${getTurnBorderColor()}`}
      >
        {/* Floating Hearts */}
        {hearts.map((heart) => (
          <button
            key={heart.id}
            onClick={() => handleHeartClick(heart)}
            className="absolute cursor-pointer text-5xl transition-all duration-200 hover:scale-125 animate-float"
            style={{
              left: `${heart.x}%`,
              top: `${heart.y + timeLeft * 5}%`,
            }}
          >
            {heart.isBlue ? '💙' : '💗'}
          </button>
        ))}

        {/* Game Message */}
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
          <p className="text-center text-muted-foreground font-semibold whitespace-pre-line">
            {getResultMessage()}
          </p>
        </div>
      </div>

      {/* Timer Display */}
      {gameStarted && (
        <div className="mb-6 text-center z-10">
          <p className="text-2xl font-bold text-primary">
            {timeLeft.toFixed(2)}s
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4 z-10">
        {!gameStarted && !result && (
          <Button
            onClick={startGame}
            className="rounded-full px-8 bg-primary text-white hover:bg-primary/90"
          >
            {currentPlayer === 'adi' ? "Adi's Turn" : "Dev's Turn"}
          </Button>
        )}

        {result && (
          <>
            <Button
              onClick={playAgain}
              className="rounded-full px-8 bg-primary text-white hover:bg-primary/90"
            >
              Play Again
            </Button>
          </>
        )}

        <Button
          onClick={onBack}
          variant="outline"
          className="rounded-full px-8 border-primary text-primary hover:bg-primary/10 bg-transparent"
        >
          Back to Home
        </Button>
      </div>

      {result && (
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>I made this just for you, Adi 💕 — Dev</p>
        </div>
      )}
    </div>
  )
}
