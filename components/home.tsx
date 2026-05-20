'use client'

import { Button } from '@/components/ui/button'
import { Heart, Gamepad2 } from 'lucide-react'

type GameType = 'matrix' | 'love-lock' | 'mind-lock' | 'cupid-shot' | 'quick-fingers' | 'love-calculator'

interface HomeProps {
  onSelectGame: (game: GameType) => void
}

export function Home({ onSelectGame }: HomeProps) {
  const games = [
    {
      id: 'matrix' as GameType,
      title: 'Matrix for Adi',
      emoji: '🎮',
      description: 'Tic Tac Toe battle',
    },
    {
      id: 'mind-lock' as GameType,
      title: 'Mind Lock',
      emoji: '🔐',
      description: 'Guess your partner\'s number',
    },
    {
      id: 'love-lock' as GameType,
      title: 'Love Lock',
      emoji: '💎',
      description: 'Memory match game',
    },
    {
      id: 'cupid-shot' as GameType,
      title: 'Cupid Shot',
      emoji: '🏹',
      description: 'Click the hearts',
    },
    {
      id: 'quick-fingers' as GameType,
      title: 'Love Roulette 🎡',
      emoji: '🎡',
      description: 'Guess love trivia',
    },
    {
      id: 'love-calculator' as GameType,
      title: 'Do You Love Dev?',
      emoji: '💕',
      description: 'Love calculator',
    },
    {
      id: 'guess-the-date' as GameType,
      title: 'Guess the Date',
      emoji: '💌',
      description: 'Reveal love memories',
    },
    {
      id: 'story-time' as GameType,
      title: 'Story Time',
      emoji: '📖',
      description: 'Romantic bedtime stories',
    },
    {
      id: 'heart-mail' as GameType,
      title: 'Heart Mail',
      emoji: '📮',
      description: 'Floating love letters',
    },
    {
      id: 'mind-lock' as GameType,
      title: 'MindLock',
      emoji: '🧠',
      description: 'Secret number battle',
    },
    {
      id: 'royal-ink-reveal' as GameType,
      title: 'Royal Ink Reveal',
      emoji: '✨',
      description: 'Cinematic love letter',
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="w-8 h-8 text-primary fill-primary" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Adi & Dev's Love Arcade
          </h1>
          <Gamepad2 className="w-8 h-8 text-secondary" />
        </div>
        <p className="text-lg text-muted-foreground">Pick a game to play together 💖</p>
      </div>

      {/* Game Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl w-full mb-12">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => onSelectGame(game.id)}
            className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-2"
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="text-5xl">{game.emoji}</div>
              <div>
                <h3 className="text-xl font-bold text-card-foreground mb-1">{game.title}</h3>
                <p className="text-sm text-muted-foreground">{game.description}</p>
              </div>
              <div className="mt-2 text-xs font-medium text-primary group-hover:text-secondary transition-colors">
                Click to play →
              </div>
            </div>

            {/* Decorative hearts */}
            <div className="absolute top-2 right-2 text-2xl opacity-20 group-hover:opacity-50 transition-opacity">
              💕
            </div>
          </button>
        ))}
      </div>

      {/* Footer message */}
      <div className="text-center max-w-xl">
        <p className="text-sm text-muted-foreground italic mb-2">
          {'"I made all this because I love you, Adi 💕 — Dev"'}
        </p>
      </div>
    </div>
  )
}
