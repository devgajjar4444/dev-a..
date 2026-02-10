'use client'

import React from "react"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Confetti } from '@/components/animations/confetti'
import { playSound } from '@/lib/sound'

interface DoYouLoveDevProps {
  onBack: () => void
}

export function DoYouLoveDev({ onBack }: DoYouLoveDevProps) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)
  const [isValid, setIsValid] = useState(true)

  const loadingMessages = [
    'Checking heart signals... 💓',
    'Consulting destiny... 🌟',
    'Asking the universe... 🌌',
    'Reading the stars... ✨',
    'Analyzing love levels... 💕',
  ]

  const [currentMessage, setCurrentMessage] = useState(0)

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    // Validate input - only "Adi" or "adi" allowed
    const isAdi = name.trim().toLowerCase() === 'adi'

    if (!isAdi) {
      setIsValid(false)
      setName('')
      return
    }

    setIsValid(true)
    setLoading(true)
    setCurrentMessage(0)

    // Cycle through loading messages
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages.length)
    }, 800)

    // Simulate calculation
    setTimeout(() => {
      clearInterval(messageInterval)
      setLoading(false)
      playSound('win')
      setResult(true)
      setShowAnimation(true)
    }, 3500)
  }

  const reset = () => {
    setName('')
    setResult(false)
    setShowAnimation(false)
    setLoading(false)
    setIsValid(true)
  }

  if (!result) {
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
          <h2 className="text-3xl font-bold text-center mb-2">Do You Love Dev?</h2>
          <p className="text-center text-muted-foreground">The Love Calculator 💘</p>
        </div>

        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 mb-8">
          {!isValid && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-red-700 text-sm font-semibold text-center">
                🚨 Oops… someone wrong is trying to enter 😌
              </p>
            </div>
          )}
          <form onSubmit={handleCalculate} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">Enter your name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name..."
                className="w-full px-4 py-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:outline-none transition-colors"
                disabled={loading}
              />
            </div>

            <div className="h-20 flex items-center justify-center">
              {loading ? (
                <div className="text-center">
                  <div className="inline-block">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
                  </div>
                  <p className="text-sm text-muted-foreground">{loadingMessages[currentMessage]}</p>
                </div>
              ) : (
                <p className="text-center text-muted-foreground text-sm">Enter your name and let's find out! 💕</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={!name.trim() || loading}
              className="w-full rounded-full bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
            >
              Calculate Love 💗
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      {showAnimation && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <Confetti count={60} duration={3} delay={0} shape="heart" />
          <div className="animate-bounce text-9xl mb-20">🎉</div>
        </div>
      )}

      <div className="mb-8 w-full max-w-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Arcade
        </button>
      </div>

      <div className="max-w-md w-full">
        {/* Result Card */}
        <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl shadow-2xl p-12 mb-8 text-center">
          <p className="text-sm text-muted-foreground mb-4 uppercase tracking-wider">Love Level</p>

          <div className="mb-8">
            <div className="text-8xl font-bold text-primary mb-4">1000%</div>
            <p className="text-2xl font-bold text-primary mb-2">YES 💖💥</p>
          </div>

          <div className="bg-white rounded-xl p-6 mb-8">
            <p className="text-lg font-semibold text-foreground mb-2">
              Confirmed 💙
            </p>
            <p className="text-foreground leading-relaxed">
              Adi loves Dev more than bugs love code 🧑‍💻✨
            </p>
          </div>

          {/* Decorative elements */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-4xl">💕</div>
            <div className="text-4xl animate-pulse">💖</div>
            <div className="text-4xl">💗</div>
          </div>

          <p className="text-sm text-muted-foreground italic mb-2">
            {'"This love calculator never lies..."'} — The Universe ✨
          </p>
        </div>

        {/* Special Message */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-primary/20">
          <p className="text-center font-semibold text-foreground mb-3">A message from Dev:</p>
          <p className="text-center text-foreground leading-relaxed">
            Adi, thanks for filling my world with love and laughter. You make every day an adventure. 💕
          </p>
        </div>

        {/* Dev's Love Message */}
        <div className="text-center mb-8 text-sm text-muted-foreground">
          <p>I made this just for you, Adi 💕 — Dev</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <Button onClick={reset} className="flex-1 rounded-full bg-primary text-white hover:bg-primary/90">
            Try Again
          </Button>
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1 rounded-full border-primary text-primary hover:bg-primary/10 bg-transparent"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
