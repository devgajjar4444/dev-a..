'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Confetti } from '@/components/animations/confetti'
import { playSound } from '@/lib/sound'

interface LoveLockProps {
  onBack: () => void
}

type Player = 'adi' | 'dev'
type GameResult = 'adi-wins' | 'dev-wins' | 'tie' | null

interface Card {
  id: number
  emoji: string
  flipped: boolean
  matched: boolean
}

export function LoveLock({ onBack }: LoveLockProps) {
  const emojis = ['💖', '😘', '🐼', '🍕', '💍']
  const [cards, setCards] = useState<Card[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<number[]>([])
  const [currentPlayer, setCurrentPlayer] = useState<Player>('adi')
  const [moves, setMoves] = useState(0)
  const [result, setResult] = useState<GameResult>(null)
  const [showAnimation, setShowAnimation] = useState(false)
  const [scores, setScores] = useState({ adi: 0, dev: 0 })

  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    const doubled = [...emojis, ...emojis]
    const shuffled = doubled.sort(() => Math.random() - 0.5)
    const newCards = shuffled.map((emoji, idx) => ({
      id: idx,
      emoji,
      flipped: false,
      matched: false,
    }))
    setCards(newCards)
    setFlipped([])
    setMatched([])
    setCurrentPlayer('adi')
    setMoves(0)
    setResult(null)
    setShowAnimation(false)
    setScores({ adi: 0, dev: 0 })
  }

  // Check for matches
  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped
      if (cards[first].emoji === cards[second].emoji) {
        playSound('win')
        setMatched([...matched, first, second])
        const newScores = { ...scores }
        if (currentPlayer === 'adi') {
          newScores.adi += 1
        } else {
          newScores.dev += 1
        }
        setScores(newScores)
        setFlipped([])
      } else {
        playSound('pop')
        setTimeout(() => {
          setFlipped([])
          setCurrentPlayer(currentPlayer === 'adi' ? 'dev' : 'adi')
        }, 1000)
      }
      setMoves(moves + 1)
    }
  }, [flipped])

  // Check for game over
  useEffect(() => {
    if (matched.length === emojis.length * 2) {
      if (scores.adi > scores.dev) {
        setResult('adi-wins')
      } else if (scores.dev > scores.adi) {
        setResult('dev-wins')
      } else {
        setResult('tie')
      }
      setShowAnimation(true)
    }
  }, [matched])

  const handleCardClick = (id: number) => {
    if (flipped.includes(id) || matched.includes(id) || result) return
    playSound('click')
    setFlipped([...flipped, id])
  }

  const getResultMessage = () => {
    switch (result) {
      case 'adi-wins':
        return '💙 ADI WINS 🔐💕 Adi remembers everything'
      case 'dev-wins':
        return '💖 DEV WINS 🔐❤️ Dev unlocked the heart'
      case 'tie':
        return '💞 TIE 🔐💘 Both remember perfectly'
      default:
        return `${currentPlayer === 'adi' ? '💙 Adi' : '💖 Dev'}'s turn`
    }
  }

  const getTurnColor = () => {
    return currentPlayer === 'adi' ? 'text-blue-600' : 'text-rose-600'
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      {showAnimation && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <Confetti count={40} duration={2.5} delay={0} shape="heart" />
          <div className="text-8xl animate-bounce">🔐</div>
          <div className="text-6xl animate-pulse ml-4">💖</div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 w-full max-w-2xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Arcade
        </button>
        <h2 className="text-3xl font-bold text-center mb-2">Love Lock - Memory Match</h2>
        <p className="text-center text-muted-foreground">Adi ❤️ vs Dev 💙</p>
      </div>

      {/* Game Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4 w-full max-w-2xl">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary">Adi</p>
          <p className="text-lg font-semibold">{scores.adi} pairs</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-muted-foreground">{result ? 'Game Over' : `Moves: ${moves}`}</p>
          <p className={getTurnColor()}>{getResultMessage()}</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-secondary">Dev</p>
          <p className="text-lg font-semibold">{scores.dev} pairs</p>
        </div>
      </div>

      {/* Game Board */}
      <div className="mb-8 bg-white rounded-2xl shadow-xl p-6 max-w-2xl w-full">
        <div className="grid grid-cols-5 gap-3">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={matched.includes(card.id) || result !== null}
              className={`aspect-square rounded-xl font-bold text-3xl transition-all duration-300 transform ${
                matched.includes(card.id) || flipped.includes(card.id)
                  ? 'bg-gradient-to-br from-primary/20 to-secondary/20 scale-100'
                  : 'bg-gray-100 hover:bg-gray-200 hover:scale-105'
              } ${!result && !matched.includes(card.id) ? 'cursor-pointer' : 'cursor-default'}`}
            >
              {flipped.includes(card.id) || matched.includes(card.id) ? card.emoji : '?'}
            </button>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        {result && (
          <Button onClick={initializeGame} className="rounded-full px-8 bg-primary text-white hover:bg-primary/90">
            Play Again
          </Button>
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
