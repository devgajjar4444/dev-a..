'use client'

import { useEffect, useState } from 'react'

interface ConfettiPiece {
  id: number
  left: number
  delay: number
  duration: number
  shape: 'heart' | 'sparkle'
}

interface ConfettiProps {
  count: number
  duration: number
  delay: number
  shape: 'heart' | 'sparkle'
}

export function Confetti({ count, duration, delay, shape }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    const newPieces: ConfettiPiece[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * delay,
      duration: duration + Math.random() * 0.5,
      shape: shape,
    }))
    setPieces(newPieces)

    // Clear after animation completes
    const timer = setTimeout(() => {
      setPieces([])
    }, (duration + 1) * 1000)

    return () => clearTimeout(timer)
  }, [count, duration, delay, shape])

  return (
    <>
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="fixed pointer-events-none"
          style={{
            left: `${piece.left}%`,
            top: '-10px',
            animation: `fall ${piece.duration}s linear ${piece.delay}s forwards`,
            fontSize: '24px',
          }}
        >
          {piece.shape === 'heart' ? '💖' : '✨'}
        </div>
      ))}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  )
}
