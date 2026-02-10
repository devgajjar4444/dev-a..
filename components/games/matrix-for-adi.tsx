'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Heart } from 'lucide-react'
import { Confetti } from '@/components/animations/confetti'
import { playSound } from '@/lib/sound'

interface MatrixForAdiProps {
  onBack: () => void
}

type Player = 'X' | 'O' | null
type GameResult = 'adi-wins' | 'dev-wins' | 'draw' | null

export function MatrixForAdi({ onBack }: MatrixForAdiProps) {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(false) // O (Adi) goes first
  const [result, setResult] = useState<GameResult>(null)
  const [showAnimation, setShowAnimation] = useState(false)

  const calculateWinner = (squares: Player[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }

  useEffect(() => {
    const winner = calculateWinner(board)
    const isBoardFull = board.every((square) => square !== null)

    if (winner === 'O') {
      playSound('win')
      setResult('adi-wins')
      setShowAnimation(true)
    } else if (winner === 'X') {
      playSound('win')
      setResult('dev-wins')
      setShowAnimation(true)
    } else if (isBoardFull) {
      playSound('pop')
      setResult('draw')
      setShowAnimation(true)
    }
  }, [board])

  const handleClick = (index: number) => {
    if (board[index] || result) return

    playSound('click')
    const newBoard = [...board]
    newBoard[index] = isXNext ? 'X' : 'O'
    setBoard(newBoard)
    setIsXNext(!isXNext)
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(false)
    setResult(null)
    setShowAnimation(false)
  }

  const getResultMessage = () => {
    switch (result) {
      case 'adi-wins':
        return '💙 ADI WINS! Adi got three in a row 👑💕'
      case 'dev-wins':
        return '💖 DEV WINS! Dev caught Adi this time 🔥'
      case 'draw':
        return '💞 DRAW! You both are perfectly matched 🤓'
      default:
        return `${isXNext ? '💖 Dev' : '💙 Adi'}'s turn (${isXNext ? 'X' : 'O'})`
    }
  }

  const getTurnColor = () => {
    return isXNext ? 'text-rose-600' : 'text-blue-600'
  }

  const getAnimationContent = () => {
    switch (result) {
      case 'adi-wins':
        return (
          <div className="flex flex-col items-center gap-4">
            <Confetti count={30} duration={2} delay={0} shape="heart" />
            <div className="text-6xl animate-bounce">👑</div>
            <div className="text-6xl animate-pulse">💖</div>
          </div>
        )
      case 'dev-wins':
        return (
          <div className="flex flex-col items-center gap-4">
            <Confetti count={20} duration={2} delay={0} shape="sparkle" />
            <div className="text-6xl animate-spin">✨</div>
          </div>
        )
      case 'draw':
        return (
          <div className="flex flex-col items-center gap-4">
            <div className="text-6xl animate-pulse">🤝</div>
            <div className="text-3xl">💘</div>
          </div>
        )
      return null
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      {showAnimation && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          {getAnimationContent()}
        </div>
      )}

      {/* Header */}
      <div className="mb-8 w-full max-w-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Arcade
        </button>
        <h2 className="text-3xl font-bold text-center mb-2">Matrix for Adi</h2>
        <p className="text-center text-muted-foreground">Tic Tac Toe: O is Adi ❤️, X is Dev 💙</p>
      </div>

      {/* Game Info */}
      <div className="mb-6 text-center">
        <p className={`text-lg font-semibold ${getTurnColor()}`}>{getResultMessage()}</p>
      </div>

      {/* Game Board */}
      <div className="mb-8 bg-white rounded-2xl shadow-xl p-4 max-w-md w-full">
        <div className="grid grid-cols-3 gap-2">
          {board.map((value, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              disabled={!!result}
              className={`aspect-square rounded-xl font-bold text-3xl transition-all duration-200 ${
                value === 'O'
                  ? 'bg-primary text-white'
                  : value === 'X'
                    ? 'bg-secondary text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
              } ${!result && !value ? 'cursor-pointer' : 'cursor-default'}`}
            >
              {value === 'O' ? '❤️' : value === 'X' ? '💙' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        {result && (
          <Button onClick={resetGame} className="rounded-full px-8 bg-primary text-white hover:bg-primary/90">
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
