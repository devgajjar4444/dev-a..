'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Confetti } from '@/components/animations/confetti'
import { playSound } from '@/lib/sound'

interface CupidShotProps {
  onBack: () => void
}

interface FloatingHeart {
  id: number
  x: number
  y: number
  isGolden: boolean
}

type GameResult = 'adi-wins' | 'dev-wins' | 'tie' | null

export function CupidShot({ onBack }: CupidShotProps) {
  const [gameStarted, setGameStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(10)
  const [adiScore, setAdiScore] = useState(0)
  const [devScore, setDevScore] = useState(0)
  const [hearts, setHearts] = useState<FloatingHeart[]>([])
  const [result, setResult] = useState<GameResult>(null)
  const [showAnimation, setShowAnimation] = useState(false)
  const [currentPlayer, setCurrentPlayer] = useState<'adi' | 'dev'>('adi')
  const [gamePhase, setGamePhase] = useState<'adi-turn' | 'dev-turn' | 'finished'>('adi-turn')
  const heartIdRef = useRef(0)

  // Game timer
  useEffect(() => {
    if (!gameStarted || timeLeft === 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameStarted, timeLeft])

  // Handle round transitions
  useEffect(() => {
    if (gameStarted && timeLeft === 0) {
      setGameStarted(false)
      setHearts([])

      if (currentPlayer === 'adi') {
        setCurrentPlayer('dev')
        setGamePhase('dev-turn')
        setTimeLeft(10)
      } else {
        setGamePhase('finished')
        determineWinner()
      }
    }
  }, [timeLeft, gameStarted, currentPlayer])

  // Generate floating hearts
  useEffect(() => {
    if (!gameStarted) return

    const interval = setInterval(() => {
      const isGolden = Math.random() < 0.15
      const newHeart: FloatingHeart = {
        id: heartIdRef.current++,
        x: Math.random() * 80 + 10,
        y: -10,
        isGolden,
      }
      setHearts((prev) => [...prev, newHeart])

      // Remove hearts that go off screen
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== newHeart.id))
      }, 4000)
    }, 400)

    return () => clearInterval(interval)
  }, [gameStarted])

  const handleHeartClick = (heart: FloatingHeart) => {
    if (!gameStarted) return

    playSound('click')
    const points = heart.isGolden ? 5 : 1
    if (currentPlayer === 'adi') {
      setAdiScore(adiScore + points)
    } else {
      setDevScore(devScore + points)
    }

    setHearts((prev) => prev.filter((h) => h.id !== heart.id))
  }

  const determineWinner = () => {
    if (adiScore > devScore) {
      setResult('adi-wins')
    } else if (devScore > adiScore) {
      setResult('dev-wins')
    } else {
      setResult('tie')
    }
    playSound('win')
    setShowAnimation(true)
  }

  const startGame = () => {
    setGameStarted(true)
    setTimeLeft(10)
    setAdiScore(0)
    setDevScore(0)
    setHearts([])
    setResult(null)
    setShowAnimation(false)
    setCurrentPlayer('adi')
    setGamePhase('adi-turn')
    heartIdRef.current = 0
  }

  const getResultMessage = () => {
    if (gamePhase === 'adi-turn' && gameStarted) {
      return "💙 Adi's Turn — Shoot the Hearts!"
    }
    if (gamePhase === 'dev-turn' && gameStarted) {
      return "💖 Dev's Turn — Your Time to Shine!"
    }
    switch (result) {
      case 'adi-wins':
        return "💙 ADI WINS 💥💘\nDev's heart was never safe anyway 😌"
      case 'dev-wins':
        return "💖 DEV WINS 🔥💘\nCupid officially resigns 😎🏹"
      case 'tie':
        return '💞 Heart refuses to choose — too much love'
      default:
        if (!gameStarted) {
          return 'Click "Start Game" to begin!'
        }
        return `${currentPlayer === 'adi' ? '💙 Adi' : '💖 Dev'} is playing! 🎯`
    }
  }

  const getTurnColor = () => {
    return currentPlayer === 'adi' ? 'from-blue-100 to-blue-50' : 'from-rose-100 to-pink-50'
  }

  const getTurnBorderColor = () => {
    return currentPlayer === 'adi' ? 'border-blue-400' : 'border-rose-400'
  }

  const playAgain = () => {
    setAdiScore(0)
    setDevScore(0)
    setResult(null)
    setCurrentPlayer('adi')
    setGamePhase('adi-turn')
    startGame()
  }

  const endRound = () => {
    setGameStarted(false)
    setHearts([])

    if (currentPlayer === 'adi') {
      setCurrentPlayer('dev')
      setDevScore(0)
      setTimeLeft(15)
    } else {
      // Determine winner
      determineWinner()
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 overflow-hidden">
      {showAnimation && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <Confetti count={50} duration={2.5} delay={0} shape="heart" />
          <div className="text-8xl animate-bounce">💥</div>
          <div className="text-6xl animate-pulse ml-4">💘</div>
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
        <h2 className="text-3xl font-bold text-center mb-2">Cupid Shot</h2>
        <p className="text-center text-muted-foreground">Click the hearts! 💘</p>
      </div>

      {/* Game Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4 w-full max-w-md z-10">
        <div className="text-center">
          <p className="text-lg font-bold text-primary">Adi: {adiScore}</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-muted-foreground">
            {gameStarted ? `${timeLeft}s left` : 'Ready?'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-secondary">Dev: {devScore}</p>
        </div>
      </div>

      {/* Game Area */}
      <div className={`relative w-full max-w-md h-96 mb-8 rounded-2xl shadow-xl overflow-hidden border-4 transition-all duration-300 bg-gradient-to-b ${getTurnColor()} ${getTurnBorderColor()}`}>
        {/* Floating Hearts */}
        {hearts.map((heart) => (
          <button
            key={heart.id}
            onClick={() => handleHeartClick(heart)}
            className={`absolute cursor-pointer text-4xl transition-all duration-200 hover:scale-125 ${
              heart.isGolden ? 'animate-pulse' : ''
            }`}
            style={{
              left: `${heart.x}%`,
              top: gameStarted ? `${(heart.y + timeLeft * 8) % 110}%` : `${heart.y}%`,
            }}
          >
            {heart.isGolden ? '💛' : '💖'}
          </button>
        ))}

        {/* Game Message */}
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
          <p className="text-center text-muted-foreground font-semibold">{getResultMessage()}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4 z-10">
        {!gameStarted && !result && (
          <Button onClick={startGame} className="rounded-full px-8 bg-primary text-white hover:bg-primary/90">
            Start Game
          </Button>
        )}

        {gameStarted && (
          <Button onClick={endRound} className="rounded-full px-8 bg-secondary text-white hover:bg-secondary/90">
            {currentPlayer === 'adi' ? "Dev's Turn" : 'See Results'}
          </Button>
        )}

        {result && (
          <>
            <Button onClick={playAgain} className="rounded-full px-8 bg-primary text-white hover:bg-primary/90">
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
