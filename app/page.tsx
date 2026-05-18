'use client'

import { useState } from 'react'
import { Home } from '@/components/home'
import { MatrixForAdi } from '@/components/games/matrix-for-adi'
import { LoveLock } from '@/components/games/love-lock'
import { CupidShot } from '@/components/games/cupid-shot'
import { LoveRoulette } from '@/components/games/love-roulette'
import { DoYouLoveDev } from '@/components/games/do-you-love-dev'

type GameType = 'home' | 'matrix' | 'love-lock' | 'cupid-shot' | 'quick-fingers' | 'love-calculator'

export default function Page() {
  const [currentGame, setCurrentGame] = useState<GameType>('home')

  const renderGame = () => {
    switch (currentGame) {
      case 'matrix':
        return <MatrixForAdi onBack={() => setCurrentGame('home')} />
      case 'love-lock':
        return <LoveLock onBack={() => setCurrentGame('home')} />
      case 'cupid-shot':
        return <CupidShot onBack={() => setCurrentGame('home')} />
      case 'quick-fingers':
        return <LoveRoulette onBack={() => setCurrentGame('home')} />
      case 'love-calculator':
        return <DoYouLoveDev onBack={() => setCurrentGame('home')} />
      default:
        return <Home onSelectGame={setCurrentGame} />
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      {renderGame()}
    </main>
  )
}
