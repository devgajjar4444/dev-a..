'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Confetti } from '@/components/animations/confetti'
import { playSound } from '@/lib/sound'

export function RoyalInkReveal({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<'intro' | 'reveal' | 'finished'>('intro')
  const [revealedLines, setRevealedLines] = useState<number[]>([])
  const [hasStarted, setHasStarted] = useState(false)

  const letterContent = [
    'For Adi…',
    '',
    'Adi,',
    '',
    'I have been trying to find the right words for so long now.',
    'Words that could capture what you mean to me.',
    'Words that could explain how you changed everything.',
    '',
    'You are my favorite feeling.',
    '',
    'When I think about all the moments we shared,',
    'from the simplest coffee mornings to the late nights filled with laughter,',
    'I realize that you are not just someone I love.',
    '',
    'You are home.',
    'You are peace.',
    'You are the reason my heart learned how to truly feel.',
    '',
    'Every time you smile, I fall deeper.',
    'Every time you laugh, I understand myself better.',
    'Every single moment with you feels like forever starting over.',
    '',
    'I chose you, Adi.',
    'And I choose you every single day.',
    'Without question.',
    'Without hesitation.',
    'Without end.',
    '',
    'Forever is not enough.',
    'But I promise to spend my whole life trying.',
    '',
    'With all of my heart,',
    '— Dev 💖',
  ]

  const highlightedLines = [8, 14, 15, 16, 22, 23, 24, 25, 26, 28, 29, 32]

  const startReveal = () => {
    playSound('start')
    setHasStarted(true)
    setPhase('reveal')

    // Animate lines revealing sequentially
    letterContent.forEach((_, index) => {
      setTimeout(() => {
        setRevealedLines((prev) => [...prev, index])
        if (index > 0) playSound('correct')
      }, index * 200)
    })

    setTimeout(() => {
      setPhase('finished')
    }, letterContent.length * 200 + 1000)
  }

  // Intro screen
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-yellow-900 to-amber-950 flex items-center justify-center px-4 py-8 relative overflow-hidden">
        {/* Floating dust particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-yellow-200 rounded-full opacity-30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 2}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Candlelight glow */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500 rounded-full blur-3xl opacity-10" />

        <div className="relative z-10 text-center max-w-2xl">
          <div className="mb-8 animate-pulse">
            <div className="text-7xl mb-4">💌</div>
            <p className="text-xl text-yellow-200 font-light">A letter sealed with love...</p>
          </div>

          <div className="bg-gradient-to-b from-amber-50 to-yellow-50 rounded-2xl p-12 shadow-2xl mb-8">
            <h1 className="text-4xl font-light text-amber-900 mb-4 tracking-widest">
              Royal Ink Reveal
            </h1>
            <p className="text-lg text-amber-700 mb-6 italic font-light">
              An enchanted love letter awaits
            </p>
            <p className="text-amber-600 text-sm leading-relaxed">
              In the candlelight of the night, a confession written in golden ink.
              Watch as the words appear before your eyes, each one a heartbeat of emotion.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={startReveal}
              className="px-8 py-6 text-lg bg-gradient-to-r from-amber-600 to-yellow-600 text-white hover:from-amber-700 hover:to-yellow-700 rounded-lg font-light tracking-wide"
            >
              Read the Letter 💖
            </Button>
            <Button
              onClick={onBack}
              variant="outline"
              className="px-8 py-6 text-lg rounded-lg font-light"
            >
              Back
            </Button>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
        `}</style>
      </div>
    )
  }

  // Reveal screen
  if (phase === 'reveal' || phase === 'finished') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900 to-slate-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
        {/* Candlelight effect */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-yellow-500 rounded-full blur-3xl opacity-10 animate-pulse" />

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute text-yellow-300 opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${8 + Math.random() * 12}px`,
                animation: `float-down ${5 + Math.random() * 5}s linear infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              {Math.random() > 0.5 ? '✨' : '💛'}
            </div>
          ))}
        </div>

        {/* Parchment paper */}
        <div className="relative z-10 max-w-2xl w-full">
          <div className="bg-gradient-to-b from-amber-50 via-yellow-50 to-amber-100 rounded-2xl p-12 shadow-2xl border-4 border-yellow-200">
            {/* Wax seal */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-3xl shadow-lg">
              💌
            </div>

            {/* Letter content */}
            <div className="mt-8 space-y-3 font-light text-amber-900">
              {letterContent.map((line, index) => (
                <div
                  key={index}
                  className={`text-lg leading-relaxed transition-all duration-500 ${
                    revealedLines.includes(index)
                      ? 'opacity-100 blur-none'
                      : 'opacity-0 blur-sm'
                  } ${
                    highlightedLines.includes(index)
                      ? 'text-red-700 font-semibold text-xl'
                      : ''
                  }`}
                  style={{
                    textIndent: line.trim() === '' ? '0' : '2rem',
                  }}
                >
                  {line || '\u00A0'}
                </div>
              ))}
            </div>

            {/* Glow effect on special lines */}
            {revealedLines.length > 0 && (
              <div className="mt-8 text-center">
                <div className="text-sm text-amber-600 italic">
                  {revealedLines.length === letterContent.length
                    ? '✨ A love written in golden ink ✨'
                    : ''}
                </div>
              </div>
            )}
          </div>

          {/* Confetti on finish */}
          {phase === 'finished' && (
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
              <Confetti count={50} duration={4} delay={0} shape="heart" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="text-7xl animate-bounce">💖</div>
                <div className="text-center">
                  <h2 className="text-3xl font-light text-yellow-200 mb-2">
                    Forever Sealed
                  </h2>
                  <p className="text-xl text-amber-200 italic">
                    Some letters are never forgotten
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          {phase === 'finished' && (
            <div className="flex gap-4 justify-center mt-8">
              <Button
                onClick={() => {
                  setPhase('intro')
                  setRevealedLines([])
                  setHasStarted(false)
                }}
                className="px-8 py-6 bg-gradient-to-r from-amber-600 to-yellow-600 text-white hover:from-amber-700 hover:to-yellow-700 rounded-lg"
              >
                Read Again 💌
              </Button>
              <Button
                onClick={onBack}
                variant="outline"
                className="px-8 py-6 rounded-lg"
              >
                Back to Arcade
              </Button>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes float-down {
            0% {
              transform: translateY(-10vh) translateX(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) translateX(100px);
              opacity: 0;
            }
          }

          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
        `}</style>
      </div>
    )
  }

  return null
}
