'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Confetti } from '@/components/animations/confetti'
import { playSound } from '@/lib/sound'

interface QuickFingersProps {
  onBack: () => void
}

type GameResult = 'adi-wins' | 'dev-wins' | 'tie' | null
type GamePhase = 'ready' | 'adi-turn' | 'transition' | 'dev-turn' | 'finished'

interface Tile {
  id: number
  isLit: boolean
}

export function QuickFingers({ onBack }: QuickFingersProps) {
  const [gamePhase, setGamePhase] = useState<GamePhase>('ready')
  const [timeLeft, setTimeLeft] = useState(10)
  const [adiScore, setAdiScore] = useState(0)
  const [devScore, setDevScore] = useState(0)
  const [tiles, setTiles] = useState<Tile[]>([])
  const [result, setResult] = useState<GameResult>(null)
  const [showAnimation, setShowAnimation] = useState(false)
  const [currentPlayer, setCurrentPlayer] = useState<'adi' | 'dev'>('adi')
  const [countdownValue, setCountdownValue] = useState(3)
  const tileIdRef = useRef(0)
  const lightTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize tiles
  useEffect(() => {
    const newTiles: Tile[] = Array.from({ length: 9 }, (_, i) => ({
      id: i,
      isLit: false,
    }))
    setTiles(newTiles)
  }, [])

  // Game timer for active turns
  useEffect(() => {
    if (gamePhase !== 'adi-turn' && gamePhase !== 'dev-turn') return
    if (timeLeft === 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gamePhase, timeLeft])

  // Handle turn ending
  useEffect(() => {
    if ((gamePhase === 'adi-turn' || gamePhase === 'dev-turn') && timeLeft === 0) {
      if (currentPlayer === 'adi') {
        setGamePhase('transition')
        setCountdownValue(3)
      } else {
        setGamePhase('finished')
        determineWinner()
      }
    }
  }, [timeLeft, gamePhase, currentPlayer])

  // Handle transition countdown
  useEffect(() => {
    if (gamePhase !== 'transition') return
    if (countdownValue === 0) {
      setCurrentPlayer('dev')
      setGamePhase('dev-turn')
      setTimeLeft(10)
      return
    }

    const timer = setTimeout(() => {
      setCountdownValue((prev) => prev - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [gamePhase, countdownValue])

  // Randomly light up tiles during turns
  useEffect(() => {
    if (gamePhase !== 'adi-turn' && gamePhase !== 'dev-turn') {
      if (lightTimeoutRef.current) clearTimeout(lightTimeoutRef.current)
      return
    }

    const scheduleNextLight = () => {
      lightTimeoutRef.current = setTimeout(() => {
        const randomTile = Math.floor(Math.random() * 9)
        setTiles((prev) =>
          prev.map((tile) =>
            tile.id === randomTile ? { ...tile, isLit: true } : tile
          )
        )

        // Turn off the light after 300ms
        setTimeout(() => {
          setTiles((prev) =>
            prev.map((tile) =>
              tile.id === randomTile ? { ...tile, isLit: false } : tile
            )
          )
        }, 300)

        scheduleNextLight()
      }, 600)
    }

    scheduleNextLight()

    return () => {
      if (lightTimeoutRef.current) clearTimeout(lightTimeoutRef.current)
    }
  }, [gamePhase])

  const handleTileClick = (tileId: number) => {
    if (gamePhase !== 'adi-turn' && gamePhase !== 'dev-turn') return

    const tile = tiles.find((t) => t.id === tileId)
    if (!tile || !tile.isLit) return

    playSound('click')

    // Add points for correctly tapped tile
    if (currentPlayer === 'adi') {
      setAdiScore((prev) => prev + 1)
    } else {
      setDevScore((prev) => prev + 1)
    }

    // Light up this tile
    setTiles((prev) =>
      prev.map((t) =>
        t.id === tileId ? { ...t, isLit: true } : t
      )
    )
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
    setTimeLeft(10)
    setAdiScore(0)
    setDevScore(0)
    setResult(null)
    setShowAnimation(false)
    setCurrentPlayer('adi')
    setGamePhase('adi-turn')
    playSound('start')
  }

  const getResultMessage = () => {
    if (gamePhase === 'adi-turn') {
      return '💙 Adi\'s Turn'
    }
    if (gamePhase === 'dev-turn') {
      return '💖 Dev\'s Turn'
    }
    if (gamePhase === 'transition') {
      return `Dev, get ready!\n${countdownValue}`
    }
    switch (result) {
      case 'adi-wins':
        return "💙 Adi's reflexes are OP ⚡😎"
      case 'dev-wins':
        return '💖 Dev wins — reaction speed unlocked 🔥'
      case 'tie':
        return '🤝 Same speed, same brain 😆'
      default:
        return 'Click "Start Game" to begin!'
    }
  }

  const playAgain = () => {
    startGame()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 overflow-hidden">
      {showAnimation && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <Confetti count={50} duration={2.5} delay={0} shape="sparkle" />
          <div className="text-8xl animate-bounce">⚡</div>
          <div className="text-6xl animate-pulse ml-4">✨</div>
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
        <h2 className="text-3xl font-bold text-center mb-2">Quick Fingers ⚡</h2>
        <p className="text-center text-muted-foreground">Tap the lit tiles fast!</p>
      </div>

      {/* Game Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4 w-full max-w-md z-10">
        <div className="text-center">
          <p className="text-lg font-bold text-blue-600">Adi: {adiScore}</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-muted-foreground">
            {(gamePhase === 'adi-turn' || gamePhase === 'dev-turn') ? `${timeLeft}s` : 'Ready?'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-rose-600">Dev: {devScore}</p>
        </div>
      </div>

      {/* Game Area */}
      <div className={`relative w-full max-w-md rounded-2xl shadow-xl overflow-hidden border-4 transition-all duration-300 bg-gradient-to-b p-4 ${
        currentPlayer === 'adi' ? 'from-blue-100 to-blue-50 border-blue-400' : 'from-rose-100 to-pink-50 border-rose-400'
      } mb-8`}>
        {/* Tile Grid */}
        <div className="grid grid-cols-3 gap-3">
          {tiles.map((tile) => (
            <button
              key={tile.id}
              onClick={() => handleTileClick(tile.id)}
              disabled={gamePhase !== 'adi-turn' && gamePhase !== 'dev-turn'}
              className={`aspect-square rounded-lg font-bold text-2xl transition-all duration-100 ${
                tile.isLit
                  ? currentPlayer === 'adi'
                    ? 'bg-blue-400 text-white scale-110 shadow-lg'
                    : 'bg-rose-400 text-white scale-110 shadow-lg'
                  : 'bg-gray-200 hover:bg-gray-300'
              } ${
                gamePhase === 'adi-turn' || gamePhase === 'dev-turn'
                  ? 'cursor-pointer'
                  : 'cursor-default'
              }`}
            >
              {tile.isLit ? '⚡' : ''}
            </button>
          ))}
        </div>

        {/* Game Message */}
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
          <p className="text-center text-muted-foreground font-semibold whitespace-pre-line">
            {getResultMessage()}
          </p>
        </div>
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
          <p>I made this just for you, Adi 💕 — Dev</p>
        </div>
      )}
    </div>
  )
}
