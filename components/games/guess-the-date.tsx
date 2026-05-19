'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Confetti } from '@/components/animations/confetti'
import { playSound } from '@/lib/sound'

interface GuessTheDateProps {
  onBack: () => void
}

interface Card {
  id: number
  date: string
  memory: string
  revealed: boolean
}

export function GuessTheDate({ onBack }: GuessTheDateProps) {
  const memories = [
    { date: '25 April 2025', memory: 'The day everything changed 💖' },
    { date: '17 July 2025', memory: 'Our first adventure together 🌸' },
    { date: '31 July 2025', memory: 'Pizza night and star gazing 🍕✨' },
    { date: '9 Dec 2025', memory: 'First winter together ❄️' },
    { date: '15 Dec 2025', memory: 'Cozy moments and laughter 😊' },
    { date: '25 Dec 2025', memory: 'Making new memories ✨' },
    { date: '27 Dec 2025', memory: 'Forever starts here 💕' },
    { date: '1 Jan 2026', memory: 'New year, same love 🎆' },
    { date: '10 Feb 2026', memory: 'Love day, every day 💘' },
  ]

  const [cards, setCards] = useState<Card[]>([])
  const [revealed, setRevealed] = useState<number[]>([])
  const [gameStarted, setGameStarted] = useState(false)
  const [allRevealed, setAllRevealed] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    const shuffled = [...memories].sort(() => Math.random() - 0.5)
    const newCards = shuffled.map((mem, idx) => ({
      id: idx,
      date: mem.date,
      memory: mem.memory,
      revealed: false,
    }))
    setCards(newCards)
    setRevealed([])
    setGameStarted(false)
    setAllRevealed(false)
    setShowAnimation(false)
  }

  const handleStartGame = () => {
    playSound('start')
    setGameStarted(true)
  }

  const handleCardClick = (id: number) => {
    if (revealed.includes(id) || !gameStarted) return

    playSound('win')
    const newRevealed = [...revealed, id]
    setRevealed(newRevealed)

    if (newRevealed.length === cards.length) {
      setAllRevealed(true)
      setShowAnimation(true)
      playSound('end')
    }
  }

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Guess the Date
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Some dates are just dates…<br />
            <span className="text-2xl font-semibold text-pink-600">ours became memories 💕</span>
          </p>

          <div className="mb-12 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
            <p className="text-muted-foreground mb-6">
              9 love letters are waiting to be opened. Each one holds a special memory we share together. Click cards to reveal the dates and moments that made us 💖
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                <div className="text-3xl mb-2">🃏</div>
                <p className="text-sm font-semibold">9 Cards</p>
                <p className="text-xs text-muted-foreground">Love letters</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-3xl mb-2">💖</div>
                <p className="text-sm font-semibold">Heart Seals</p>
                <p className="text-xs text-muted-foreground">Special touch</p>
              </div>
              <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
                <div className="text-3xl mb-2">✨</div>
                <p className="text-sm font-semibold">Magic moments</p>
                <p className="text-xs text-muted-foreground">To discover</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={handleStartGame}
              className="rounded-full px-8 py-6 text-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Start Guessing 💌
            </Button>
            <Button
              onClick={onBack}
              variant="outline"
              className="rounded-full px-8 py-6 text-lg"
            >
              Back to Arcade
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      {showAnimation && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <Confetti count={50} duration={3} delay={0} shape="heart" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="text-7xl animate-bounce">💕</div>
            <div className="text-center">
              <h2 className="text-4xl font-bold text-pink-600 mb-2">Every date with you</h2>
              <p className="text-2xl text-purple-600">became my favorite story 💕</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 w-full max-w-4xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Arcade
        </button>
        <h2 className="text-3xl font-bold text-center mb-4">
          <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Guess the Date 💌
          </span>
        </h2>
        <p className="text-center text-muted-foreground mb-2">
          {revealed.length} / {cards.length} memories revealed
        </p>
        <div className="w-full bg-pink-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-pink-500 to-purple-500 h-full transition-all duration-300"
            style={{ width: `${(revealed.length / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Game Board */}
      <div className="mb-8 max-w-5xl w-full">
        <div className="grid grid-cols-3 gap-6 md:gap-8">
          {cards.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={revealed.includes(card.id) || allRevealed}
              className={`aspect-square rounded-2xl font-bold text-center flex flex-col items-center justify-center transition-all duration-500 transform perspective ${
                revealed.includes(card.id)
                  ? 'bg-gradient-to-br from-pink-50 to-purple-50 shadow-lg scale-100 border-2 border-pink-200'
                  : 'bg-white shadow-xl hover:shadow-2xl hover:scale-105 cursor-pointer border-4 border-pink-300 hover:border-purple-400'
              } ${allRevealed ? 'cursor-default' : ''}`}
              style={{
                transform: revealed.includes(card.id) ? 'rotateY(0deg)' : 'rotateY(0deg)',
                transformStyle: 'preserve-3d',
              }}
            >
              {!revealed.includes(card.id) ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="text-4xl mb-2">💖</div>
                  <p className="text-xs md:text-sm font-semibold text-pink-600">Open Me</p>
                </div>
              ) : (
                <div className="px-4 py-6 flex flex-col items-center justify-center gap-3">
                  <div className="text-sm md:text-base font-bold text-pink-600 text-pretty text-balance">
                    {card.date}
                  </div>
                  <div className="w-full h-px bg-pink-200" />
                  <div className="text-xs md:text-sm text-purple-600 font-medium text-pretty text-balance">
                    {card.memory}
                  </div>
                  <div className="text-xl mt-2">✨</div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        {allRevealed && (
          <Button
            onClick={initializeGame}
            className="rounded-full px-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg transition-all"
          >
            Play Again 💕
          </Button>
        )}
        <Button
          onClick={onBack}
          variant="outline"
          className="rounded-full px-8"
        >
          Back to Home
        </Button>
      </div>

      {allRevealed && (
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>I made this just for you, Adi 💕 — Dev</p>
        </div>
      )}
    </div>
  )
}
