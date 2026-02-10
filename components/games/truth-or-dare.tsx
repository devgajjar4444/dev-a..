'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react'

interface TruthOrDareProps {
  onBack: () => void
}

export function TruthOrDare({ onBack }: TruthOrDareProps) {
  const truths = [
    "Adi, what made you fall for Dev? 💕",
    "Dev, what do you love most about Adi? 💛",
    "Adi, what's your favorite memory with Dev? 🌟",
    "Dev, when did you know Adi was special? 💫",
    "Adi, describe Dev in three words 🎯",
    "Dev, what's something you admire about Adi? 😊",
  ]

  const dares = [
    "Send Dev a cute selfie 📸💖",
    "Say 'I love you' dramatically 😆",
    "Adi, give Dev a forehead kiss 💋",
    "Dev, tell Adi your favorite thing about them 🌹",
    "Dance together for 10 seconds 💃",
    "Hug each other tightly 🤗",
    "Make a silly face at each other 😜",
    "Compliment each other 3 times 👑",
  ]

  const [gameStarted, setGameStarted] = useState(false)
  const [currentChoice, setCurrentChoice] = useState<'truth' | 'dare' | null>(null)
  const [currentText, setCurrentText] = useState('')
  const [currentPlayer, setCurrentPlayer] = useState<'adi' | 'dev'>('adi')
  const [isMuted, setIsMuted] = useState(false)

  const getRandomItem = (array: string[]) => {
    return array[Math.floor(Math.random() * array.length)]
  }

  const handleTruth = () => {
    setCurrentChoice('truth')
    setCurrentText(getRandomItem(truths))
  }

  const handleDare = () => {
    setCurrentChoice('dare')
    setCurrentText(getRandomItem(dares))
  }

  const handleNext = () => {
    setCurrentPlayer(currentPlayer === 'adi' ? 'dev' : 'adi')
    setCurrentChoice(null)
    setCurrentText('')
  }

  const startGame = () => {
    setGameStarted(true)
    setCurrentPlayer('adi')
    setCurrentChoice(null)
    setCurrentText('')
  }

  const endGame = () => {
    setGameStarted(false)
    setCurrentChoice(null)
    setCurrentText('')
    setCurrentPlayer('adi')
  }

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="mb-8 w-full max-w-md">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Arcade
          </button>
          <h2 className="text-3xl font-bold text-center mb-2">Truth or Dare</h2>
          <p className="text-center text-muted-foreground">A soft romantic version for you two 💕</p>
        </div>

        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="space-y-4 mb-8">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-4">
              <p className="font-semibold text-primary mb-2">Truth</p>
              <p className="text-sm text-muted-foreground">{truths[0]}</p>
            </div>
            <div className="bg-gradient-to-br from-secondary/10 to-accent/10 rounded-xl p-4">
              <p className="font-semibold text-secondary mb-2">Dare</p>
              <p className="text-sm text-muted-foreground">{dares[0]}</p>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mb-6">
            Get ready to answer cute questions and do sweet dares together! 😊
          </p>

          <div className="flex gap-4">
            <Button onClick={startGame} className="flex-1 rounded-full bg-primary text-white hover:bg-primary/90">
              Start Game
            </Button>
            <Button
              onClick={onBack}
              variant="outline"
              className="flex-1 rounded-full border-primary text-primary hover:bg-primary/10 bg-transparent"
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentChoice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="mb-8 w-full max-w-md">
          <button
            onClick={endGame}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            End Game
          </button>
        </div>

        {/* Player Name */}
        <div className="mb-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">It's your turn!</p>
          <p className="text-4xl font-bold text-primary">{currentPlayer === 'adi' ? 'Adi' : 'Dev'}</p>
        </div>

        {/* Choice Buttons */}
        <div className="max-w-md w-full grid grid-cols-2 gap-6 mb-8">
          <button
            onClick={handleTruth}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105"
          >
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="text-5xl">😇</div>
              <p className="font-bold text-white text-lg">Truth</p>
              <p className="text-xs text-white/80">Answer honestly</p>
            </div>
          </button>

          <button
            onClick={handleDare}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-secondary to-secondary/80 p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105"
          >
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="text-5xl">😈</div>
              <p className="font-bold text-white text-lg">Dare</p>
              <p className="text-xs text-white/80">Take the challenge</p>
            </div>
          </button>
        </div>

        <p className="text-center text-muted-foreground text-sm">
          Choose wisely, {currentPlayer === 'adi' ? 'Adi' : 'Dev'}! 💭
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      {/* Header */}
      <div className="mb-8 w-full max-w-md flex items-center justify-between">
        <button
          onClick={endGame}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <p className="text-sm font-semibold text-primary">{currentPlayer === 'adi' ? 'Adi' : 'Dev'}</p>
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Card */}
      <div
        className={`max-w-md w-full rounded-2xl shadow-2xl p-8 mb-12 ${
          currentChoice === 'truth'
            ? 'bg-gradient-to-br from-primary/10 to-primary/5'
            : 'bg-gradient-to-br from-secondary/10 to-secondary/5'
        }`}
      >
        <div className="text-center mb-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            {currentChoice === 'truth' ? '😇 Truth' : '😈 Dare'}
          </p>
          <div className={`text-5xl mb-4 ${currentChoice === 'truth' ? 'text-primary' : 'text-secondary'}`}>
            {currentChoice === 'truth' ? '❓' : '🎯'}
          </div>
        </div>

        <p className="text-2xl font-bold text-center text-foreground leading-relaxed mb-8">{currentText}</p>

        <div className="text-center text-xs text-muted-foreground">
          Take your time, be genuine, and have fun! 💕
        </div>
      </div>

      {/* Button */}
      <Button onClick={handleNext} className="rounded-full px-12 bg-primary text-white hover:bg-primary/90 text-lg">
        {currentPlayer === 'dev' ? 'See Results 🎉' : "Dev's Turn →"}
      </Button>
    </div>
  )
}
