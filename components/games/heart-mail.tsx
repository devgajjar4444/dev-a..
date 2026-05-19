'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Confetti } from '@/components/animations/confetti'
import { playSound } from '@/lib/sound'

interface HeartMailProps {
  onBack: () => void
}

interface Envelope {
  id: number
  style: 'pink' | 'lavender' | 'cream' | 'glitter' | 'heart'
  letter: Letter
  isGolden: boolean
  opened: boolean
  position: {
    x: number
    y: number
  }
  rotation: number
  vx: number
  vy: number
}

interface Letter {
  content: string
  author?: string
  type: 'funny' | 'romantic' | 'teasing' | 'memory' | 'confession'
}

export function HeartMail({ onBack }: HeartMailProps) {
  const [gameState, setGameState] = useState<'home' | 'mailbox' | 'reading' | 'ending'>('home')
  const [envelopes, setEnvelopes] = useState<Envelope[]>([])
  const [selectedEnvelope, setSelectedEnvelope] = useState<Envelope | null>(null)
  const [readingPage, setReadingPage] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [openedCount, setOpenedCount] = useState(0)
  const [hoveredEnvelopeId, setHoveredEnvelopeId] = useState<number | null>(null)

  const letters: Letter[] = [
    {
      content: 'You steal my hoodies emotionally.\nI mean, they smell like me but you wear them better.',
      type: 'funny',
    },
    {
      content: 'I blame you for my ruined sleep schedule.\nBut honestly, staying up talking to you is my favorite time.',
      type: 'funny',
    },
    {
      content: 'My screen time increased because of you.\nAnd I regret nothing.',
      type: 'funny',
    },
    {
      content: 'Your voice feels like home.',
      type: 'romantic',
    },
    {
      content: 'Somehow every song became about you.\nI swear the artists knew.',
      type: 'romantic',
    },
    {
      content: 'Even silence feels soft with you.',
      type: 'romantic',
    },
    {
      content: 'You act innocent but you started this.',
      type: 'teasing',
    },
    {
      content: 'I still remember that look you gave me.\nThe one that changed everything.',
      type: 'teasing',
    },
    {
      content: 'You were flirting first. Evidence exists.',
      type: 'teasing',
    },
    {
      content: 'I remember the day you laughed so hard you couldn\'t breathe.\nThat\'s when I knew.',
      type: 'memory',
    },
    {
      content: 'That rainy afternoon when everything felt right.\nJust us, rain, and endless tea.',
      type: 'memory',
    },
    {
      content: 'The way you look at me like I\'m your entire universe.\nI want to be that for you always.',
      type: 'memory',
    },
    {
      content: 'You steal my hoodies and my heart.\nBoth look better on you.',
      type: 'romantic',
    },
    {
      content: 'In a world of chaos, you are my calm.',
      type: 'romantic',
    },
    {
      content: 'I choose you. Every single day. Every single moment.',
      type: 'romantic',
    },
    {
      content: `Adi,

I don't think you truly understand what you've become to me.

Somewhere between our everyday talks, random kisses, sleepy messages, stretches together, and all those tiny moments we never planned… you quietly became my favorite part of every single day, and I never want that favorite part to end.

You are the first person I think of when something good happens.
And somehow, you're also the person I want beside me when life feels heavy.

It's strange…
because love was never supposed to arrive this softly.

But then you happened.

You are my first love, and I feel so blessed to be loved by you.

Now every little thing reminds me of you:
songs, rain, night skies, certain dates, certain words, even silence.

And it's like I'm slowly picking up your habits too—
keeping track of money, being on time, staying active.

And the scariest part?
How natural it feels to love you.

Like my heart recognized you before I did.

You made ordinary moments feel important.
You made my 24 hours feel like 48.
You made this world feel warmer.

So if you ever wonder what you mean to me…

You are not just someone I love.

You are my favorite feeling, and I want to feel this way every day for the rest of my life.

— Dev 💖`,
      type: 'confession',
    },
  ]

  // Initialize game
  useEffect(() => {
    if (gameState === 'mailbox' && envelopes.length === 0) {
      initializeMailbox()
    }
  }, [gameState])

  const initializeMailbox = () => {
    const styles: Array<'pink' | 'lavender' | 'cream' | 'glitter' | 'heart'> = [
      'pink',
      'lavender',
      'cream',
      'glitter',
      'heart',
    ]
    const newEnvelopes: Envelope[] = letters.map((letter, idx) => ({
      id: idx,
      style: styles[idx % styles.length],
      letter,
      isGolden: idx === letters.length - 1,
      opened: false,
      position: {
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth - 100 : 300),
        y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight - 100 : 300),
      },
      rotation: Math.random() * 360,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
    }))
    setEnvelopes(newEnvelopes)
    playSound('start')
  }

  // Animate floating envelopes
  useEffect(() => {
    if (gameState !== 'mailbox') return

    const interval = setInterval(() => {
      setEnvelopes((prev) =>
        prev.map((env) => {
          let { x, y } = env.position
          let { vx, vy } = env

          x += vx
          y += vy

          const width = typeof window !== 'undefined' ? window.innerWidth : 1024
          const height = typeof window !== 'undefined' ? window.innerHeight : 768

          if (x < 0 || x > width - 100) vx *= -1
          if (y < 0 || y > height - 100) vy *= -1

          return {
            ...env,
            position: { x: Math.max(0, Math.min(x, width - 100)), y: Math.max(0, Math.min(y, height - 100)) },
            vx,
            vy,
            rotation: (env.rotation + 0.5) % 360,
          }
        })
      )
    }, 50)

    return () => clearInterval(interval)
  }, [gameState])

  const handleEnvelopeClick = (envelope: Envelope) => {
    playSound('win')
    setSelectedEnvelope(envelope)
    setReadingPage(0)
    setGameState('reading')

    const updatedEnvelopes = envelopes.map((e) => (e.id === envelope.id ? { ...e, opened: true } : e))
    setEnvelopes(updatedEnvelopes)
    setOpenedCount(openedCount + 1)
  }

  const handleFinishReading = () => {
    if (selectedEnvelope?.letter.type === 'confession') {
      setShowConfetti(true)
      setGameState('ending')
    } else {
      setGameState('mailbox')
    }
  }

  const getEnvelopeColor = (envelope: Envelope) => {
    if (envelope.isGolden) {
      return 'bg-gradient-to-br from-yellow-200 via-yellow-100 to-yellow-50 shadow-lg shadow-yellow-300/50'
    }
    switch (envelope.style) {
      case 'pink':
        return 'bg-gradient-to-br from-pink-200 to-pink-100'
      case 'lavender':
        return 'bg-gradient-to-br from-purple-200 to-purple-100'
      case 'cream':
        return 'bg-gradient-to-br from-yellow-50 to-orange-50'
      case 'glitter':
        return 'bg-gradient-to-br from-pink-300 via-purple-200 to-blue-200'
      case 'heart':
        return 'bg-gradient-to-br from-red-200 to-pink-100'
      default:
        return 'bg-white'
    }
  }

  const getLetterContent = () => {
    const lines = selectedEnvelope?.letter.content.split('\n') || []
    const pageSize = 3
    const startIdx = readingPage * pageSize
    const endIdx = startIdx + pageSize
    return lines.slice(startIdx, endIdx)
  }

  const totalPages = Math.ceil((selectedEnvelope?.letter.content.split('\n').length || 1) / 3)

  return (
    <div className="min-h-screen w-full overflow-hidden relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Moon */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-yellow-300 rounded-full opacity-20 blur-3xl" />

        {/* Stars */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 2}s infinite`,
            }}
          />
        ))}

        {/* Floating clouds */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-slate-800 rounded-full opacity-30 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-900 rounded-full opacity-20 blur-3xl animate-pulse" />
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(var(--rotation)); }
          50% { transform: translateY(-20px) rotate(var(--rotation)); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(234, 179, 8, 0.5); }
          50% { box-shadow: 0 0 40px rgba(234, 179, 8, 0.8); }
        }
        @keyframes unfold {
          0% { transform: rotateX(0deg) rotateY(0deg); opacity: 0; }
          50% { transform: rotateX(10deg) rotateY(20deg); opacity: 0.5; }
          100% { transform: rotateX(0deg) rotateY(0deg); opacity: 1; }
        }
      `}</style>

      {/* Home Screen */}
      {gameState === 'home' && (
        <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4">
          <button
            onClick={onBack}
            className="absolute top-6 left-6 p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>

          <div className="text-center max-w-2xl">
            <div className="text-6xl mb-6">📮</div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Heart Mail</h1>
            <p className="text-xl text-gray-300 mb-8 italic">"Some feelings are easier written than spoken 💌"</p>

            <Button
              onClick={() => setGameState('mailbox')}
              className="px-8 py-6 text-lg bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl"
            >
              Open The Mailbox 📮
            </Button>

            <p className="text-gray-400 text-sm mt-12">Find the golden envelope...</p>
          </div>
        </div>
      )}

      {/* Mailbox Screen */}
      {gameState === 'mailbox' && (
        <div className="relative z-10 min-h-screen w-full">
          {/* Header */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div className="text-white text-sm">
              Opened: {openedCount}/{envelopes.length}
            </div>
          </div>

          {/* Floating Envelopes */}
          <div className="relative w-full h-screen">
            {envelopes.map((envelope) => (
              <button
                key={envelope.id}
                onClick={() => handleEnvelopeClick(envelope)}
                onMouseEnter={() => setHoveredEnvelopeId(envelope.id)}
                onMouseLeave={() => setHoveredEnvelopeId(null)}
                className={`absolute w-24 h-16 rounded-lg cursor-pointer transition-all duration-200 ${getEnvelopeColor(envelope)} ${
                  hoveredEnvelopeId === envelope.id ? 'scale-110 -translate-y-2' : ''
                } ${envelope.isGolden && hoveredEnvelopeId !== envelope.id ? 'animate-pulse' : ''}`}
                style={{
                  left: `${envelope.position.x}px`,
                  top: `${envelope.position.y}px`,
                  transform: `rotate(${envelope.rotation}deg)`,
                  '--rotation': `${envelope.rotation}deg`,
                } as any}
              >
                {/* Wax Seal */}
                <div className="absolute -right-2 -bottom-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold shadow-lg">
                  {envelope.isGolden ? '✨' : '❤'}
                </div>

                {/* Envelope details */}
                <div className="flex items-center justify-center w-full h-full">
                  {envelope.isGolden ? '💌✨' : '💌'}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reading Screen */}
      {gameState === 'reading' && selectedEnvelope && (
        <div className="flex items-center justify-center min-h-screen relative z-10 px-4 py-8">
          <button
            onClick={() => setGameState('mailbox')}
            className="absolute top-6 left-6 p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>

          {/* Letter Card */}
          <div className="w-full max-w-2xl">
            {/* Golden letter special styling */}
            {selectedEnvelope.isGolden ? (
              <div className="relative">
                {/* Golden glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-2xl blur-2xl" />

                <div className="relative bg-gradient-to-br from-yellow-50 via-white to-orange-50 rounded-2xl p-12 shadow-2xl backdrop-blur-sm border border-yellow-200">
                  <div className="text-center mb-8">
                    <div className="text-5xl mb-4">💖</div>
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-600 mb-2">
                      A Confession
                    </h2>
                    <p className="text-gray-600 text-sm">From Dev to Adi</p>
                  </div>

                  <div className="prose prose-sm max-w-none mb-8">
                    {getLetterContent().map((line, idx) => (
                      <p
                        key={idx}
                        className="text-gray-700 mb-3 font-serif text-base leading-relaxed whitespace-pre-wrap animate-fadeIn"
                      >
                        {line}
                      </p>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-8 border-t border-yellow-200">
                    <Button
                      onClick={() => setReadingPage(Math.max(0, readingPage - 1))}
                      disabled={readingPage === 0}
                      variant="outline"
                      className="text-gray-700 border-gray-300 hover:bg-gray-100"
                    >
                      Previous
                    </Button>

                    <span className="text-gray-600 text-sm">
                      Page {readingPage + 1} of {totalPages}
                    </span>

                    {readingPage + 1 < totalPages ? (
                      <Button
                        onClick={() => setReadingPage(readingPage + 1)}
                        className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        onClick={handleFinishReading}
                        className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
                      >
                        Finish
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">💌</div>
                  <p className="text-gray-400 text-sm capitalize">{selectedEnvelope.letter.type} Letter</p>
                </div>

                <div className="min-h-64">
                  {getLetterContent().map((line, idx) => (
                    <p
                      key={idx}
                      className="text-gray-200 mb-4 font-serif text-lg leading-relaxed whitespace-pre-wrap animate-fadeIn"
                    >
                      {line}
                    </p>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                  <Button
                    onClick={() => setReadingPage(Math.max(0, readingPage - 1))}
                    disabled={readingPage === 0}
                    variant="outline"
                    className="text-white border-white/30 hover:bg-white/10"
                  >
                    Previous
                  </Button>

                  <span className="text-gray-400 text-sm">
                    Page {readingPage + 1} of {totalPages}
                  </span>

                  {readingPage + 1 < totalPages ? (
                    <Button
                      onClick={() => setReadingPage(readingPage + 1)}
                      className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      onClick={handleFinishReading}
                      className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
                    >
                      Back
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ending Screen */}
      {gameState === 'ending' && (
        <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4">
          {showConfetti && <Confetti count={30} duration={4} delay={0.5} shape="heart" />}

          <div className="text-center max-w-2xl">
            <div className="text-6xl mb-6 animate-pulse">💖</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Found It!</h2>
            <p className="text-xl text-gray-300 mb-12">
              "Some letters are never forgotten 💌"
            </p>

            <Button
              onClick={() => {
                setGameState('mailbox')
                setShowConfetti(false)
              }}
              className="px-8 py-6 text-lg bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl mb-6"
            >
              Explore More Letters
            </Button>

            <Button
              onClick={onBack}
              variant="outline"
              className="text-white border-white/30 hover:bg-white/10"
            >
              Back to Arcade
            </Button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        p {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
