'use client'

import { useState } from 'react'
import { Home } from '@/components/home'
import { MatrixForAdi } from '@/components/games/matrix-for-adi'
import { LoveLock } from '@/components/games/love-lock'
import { MindLock } from '@/components/games/mind-lock'
import { CupidShot } from '@/components/games/cupid-shot'
import { LoveRoulette } from '@/components/games/love-roulette'
import { DoYouLoveDev } from '@/components/games/do-you-love-dev'
import { GuessTheDate } from '@/components/games/guess-the-date'
import { StoryTime } from '@/components/games/story-time'
import { HeartMail } from '@/components/games/heart-mail'
import { RoyalInkReveal } from '@/components/games/royal-ink-reveal'

type GameType = 'home' | 'matrix' | 'love-lock' | 'mind-lock' | 'cupid-shot' | 'quick-fingers' | 'love-calculator' | 'guess-the-date' | 'story-time' | 'heart-mail' | 'royal-ink-reveal'

export default function Page() {
  const [currentGame, setCurrentGame] = useState<GameType>('home')

  const renderGame = () => {
    switch (currentGame) {
      case 'matrix':
        return <MatrixForAdi onBack={() => setCurrentGame('home')} />
      case 'love-lock':
        return <LoveLock onBack={() => setCurrentGame('home')} />
      case 'mind-lock':
        return <MindLock onBack={() => setCurrentGame('home')} />
      case 'cupid-shot':
        return <CupidShot onBack={() => setCurrentGame('home')} />
      case 'quick-fingers':
        return <LoveRoulette onBack={() => setCurrentGame('home')} />
      case 'love-calculator':
        return <DoYouLoveDev onBack={() => setCurrentGame('home')} />
      case 'guess-the-date':
        return <GuessTheDate onBack={() => setCurrentGame('home')} />
      case 'story-time':
        return <StoryTime onBack={() => setCurrentGame('home')} />
      case 'heart-mail':
        return <HeartMail onBack={() => setCurrentGame('home')} />
      case 'mind-lock':
        return <RoyalInkReveal onBack={() => setCurrentGame('home')} />
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
