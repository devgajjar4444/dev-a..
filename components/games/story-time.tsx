'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Heart, BookOpen } from 'lucide-react'
import { Confetti } from '@/components/animations/confetti'
import { playSound } from '@/lib/sound'

interface StoryTimeProps {
  onBack: () => void
}

interface Story {
  id: number
  title: string
  author: string
  emoji: string
  cover: string
  pages: string[]
  theme: 'rainy' | 'moonlight' | 'starry' | 'cafe' | 'train' | 'snowfall'
}

const stories: Story[] = [
  {
    id: 1,
    title: 'Midnight Café',
    author: 'Elena Vale',
    emoji: '☕',
    cover: 'Two strangers meet every rainy night',
    pages: [
      `The rain drummed softly against the café windows as she pushed through the door, shaking droplets from her coat. He was already there, at their table—though he didn't know it was theirs yet.\n\n"Mind if I sit?" she asked, heart racing in a way she couldn't explain.\n\nHe looked up, and something shifted. Neither of them had planned to come back. Neither expected to find the other here again.`,
      `Night after night, the pattern continued. Rain brought them together. Warm coffee, warmer conversation. His jokes made her laugh until her sides hurt. Her stories made him forget about everything else.\n\nOne evening, as the rain fell harder, he reached across the table. "I keep coming back for the coffee," he said, eyes twinkling. "But I'm pretty sure you're the real reason."`,
      `"I know," she whispered, taking his hand. "I've been doing the same thing."\n\nOutside, the city lights blurred through the rain-streaked window. Inside, two hearts that had been searching in the darkness had finally found home in each other. And the rain? The rain kept falling, blessing the moment that would change everything.`
    ],
    theme: 'rainy'
  },
  {
    id: 2,
    title: 'The Moon Wrote Back',
    author: 'Sophia Everly',
    emoji: '🌙',
    cover: 'Love letters to the moon answered',
    pages: [
      `She had been writing letters to the moon since childhood—confessions, wishes, dreams. Her friends thought it was silly. Her parents thought it was sweet.\n\nBut one night, she found a letter folded beneath her pillow. It was written in beautiful handwriting, addressed to her, signed only with a crescent moon.`,
      `"I've been listening to your wishes," it read. "And I finally found someone brave enough to answer. He's been standing in the same garden, beneath the same stars, hoping someone would write to him too.\n\nWill you write to him?"`,
      `Her hands trembled as she wrote back. A boy who had also felt alone. A boy who also believed in the magic of the night sky. And somehow, through letters and moonlight, they found each other.\n\nYears later, they would marry under that same moon, the letters framed on their bedroom wall—proof that sometimes, wishes do come true.`
    ],
    theme: 'moonlight'
  },
  {
    id: 3,
    title: 'Paris in the Snow',
    author: 'Claire Monroe',
    emoji: '❄️',
    cover: 'Lost tourists finding love in winter',
    pages: [
      `The forecast said clear skies. The forecast lied. Snow fell heavy and sudden, blanketing Paris in white and trapping her in the city with no plan and no phone battery.\n\nHe was equally lost, equally confused, equally captivated when their eyes met in the snow-covered square.`,
      `"I'm supposed to be in Rome," she laughed, watching snow gather on his hair.\n\n"I'm supposed to be home," he said. "But I think I'm exactly where I'm meant to be."\n\nThey walked through the snowy streets like they were the only two people in the world. The Eiffel Tower glowed softly in the distance, Christmas lights dancing on snow.`,
      `When the snow finally stopped, neither wanted to leave Paris. Neither wanted to leave each other.\n\n"Maybe getting lost was the point," she said, hand in his.\n\n"Maybe," he agreed, pulling her closer. "I think I needed to be lost to find you."`
    ],
    theme: 'snowfall'
  },
  {
    id: 4,
    title: 'The Last Train Home',
    author: 'Luna Hart',
    emoji: '🚆',
    cover: 'An unforgettable midnight journey',
    pages: [
      `It was the last train of the night, and they were the only passengers in the car. She had been crying earlier—he could see the traces. He didn't ask why. Sometimes, a stranger's silence is more comforting than questions.\n\nAs the train swayed through the darkness, he offered her his headphones. They listened to the same sad song, sitting side by side, finding comfort in shared sorrow.`,
      `Somewhere between midnight and dawn, they started talking. Real talking. The kind where you tell a stranger things you've never told anyone else.\n\nHe told her about heartbreak. She told him about dreams deferred. They made each other laugh at 3 AM as the city slept outside the windows.`,
      `When the train pulled into her station, neither wanted to get off. "Give me your number?" he asked.\n\nShe wrote it on his hand with a pen, knowing the ink would fade but hoping the memory wouldn't.\n\n"That was the most beautiful night of my life," she said.\n\nHe smiled. "It doesn't have to be the last one."`
    ],
    theme: 'train'
  },
  {
    id: 5,
    title: 'Love Beneath Lanterns',
    author: 'Avery Bloom',
    emoji: '🏮',
    cover: 'Childhood friends reunite under glowing skies',
    pages: [
      `They hadn't seen each other since high school. He was nervously waiting near the lantern festival entrance when she tapped his shoulder. Same smile. Different lifetime.\n\n"Adi?" she breathed, like she couldn't quite believe it was really him.\n\n"Dev," he said, voice full of wonder. "Hi."`
    ],
    theme: 'starry'
  },
  {
    id: 6,
    title: 'The Bookstore Boy',
    author: 'Emma Sinclair',
    emoji: '📚',
    cover: 'Love hidden between the pages',
    pages: [
      `She always bought the same books from the same shelf. She never read them. She was just waiting to find a note.\n\nAnd every few weeks, she would. Small handwritten messages, slipped between pages, only for her eyes to find.`,
      `"You have beautiful taste in books."\n"I wonder if we'd have beautiful conversations too."\n"The world needs more readers like you."\n\nOne day, she waited by the shelf. When he reached for the same book, their hands touched. Their eyes met. No words were needed.`,
      `"I've been leaving you notes for months," he confessed.\n\n"I know," she smiled. "I was hoping you'd eventually leave one that led you to me."\n\nHe did. And they never stopped writing each other love notes, one book at a time.`
    ],
    theme: 'cafe'
  },
  {
    id: 7,
    title: 'Barbie & The Midnight Ball',
    author: 'Dreamhouse Tales',
    emoji: '👑',
    cover: 'She escaped a ball to find real love',
    pages: [
      `The royal ball was suffocating. Designer dress, perfect hair, endless small talk. Barbie had never felt more trapped.\n\nShe slipped away to the garden, where she found him—a kind boy sitting alone, away from the crowds, lost in his own thoughts.`
    ],
    theme: 'moonlight'
  },
  {
    id: 8,
    title: 'Barbie in Paris',
    author: 'Dreamhouse Tales',
    emoji: '💄',
    cover: 'Fashion, love, and second chances',
    pages: [
      `The struggling fashion house needed saving. She came to Paris ready to help. She didn't expect to find him—artistic, passionate, and completely different from everyone she'd known.\n\n"You see the beauty in things others miss," he told her, touching her face gently.\n\nTogether, they rebuilt more than just a fashion house. They rebuilt each other.`
    ],
    theme: 'cafe'
  },
  {
    id: 9,
    title: 'The Stars Between Us',
    author: 'Mila Rose',
    emoji: '✨',
    cover: 'Love across distance, under the same stars',
    pages: [
      `Different cities. Same star. Every night at 9 PM, they made the same wish on the same star, separated by hundreds of miles but connected by something stronger.\n\nThen one night, they both ended up at the same planetarium, looking up at the same constellations, finally finding each other on Earth.`
    ],
    theme: 'starry'
  },
  {
    id: 10,
    title: 'Love in December',
    author: 'Noah Evernight',
    emoji: '🎄',
    cover: 'Winter brought two lonely hearts together',
    pages: [
      `It was the coldest winter on record. The accident was nobody's fault—just fate bringing two souls to the same hospital room.\n\nThey were both there for minor injuries, but they left with something neither expected to find: someone who understood loneliness the way only another lonely person could.\n\n"Want to spend Christmas together?" he asked on her last night.\n\n"I'd like that," she said, squeezing his hand. "I'd really like that."`
    ],
    theme: 'snowfall'
  },
  {
    id: 11,
    title: 'A Letter Never Sent',
    author: 'Charlotte Rain',
    emoji: '💌',
    cover: 'A forgotten love letter changed everything',
    pages: [
      `She found the letter in an old book—written decades ago to someone who never received it. Out of curiosity, she tracked down the author.\n\nHe answered on the second ring, voice trembling when she read his words back to him.\n\n"I never sent that," he whispered. "Because I was afraid of what she'd say. I've spent my whole life wondering what would have happened if I had."\n\n"Well," she said softly, "it found me. And I think that's fate telling you something."`
    ],
    theme: 'rainy'
  },
  {
    id: 12,
    title: 'Her Voice at 2AM',
    author: 'Elliot Skye',
    emoji: '☎️',
    cover: 'Late night calls became a lifeline',
    pages: [
      `It started as a wrong number. She was calling a customer service line. He was the operator who stayed on the phone when she had a breakdown.\n\nNight after night, she'd call back during her worst moments. He was always there, voice steady and kind, becoming her anchor in the darkness.\n\n"I think I love you," she finally whispered.\n\n"I know," he said. "I've been in love with you for weeks. Can I finally meet you in person?"`
    ],
    theme: 'rainy'
  },
  {
    id: 13,
    title: 'The Rooftop Promise',
    author: 'Olivia Wren',
    emoji: '🌃',
    cover: 'Best friends under city lights',
    pages: [
      `They had been best friends since childhood. Same dream, same rooftop, same moment when everything changed.\n\n"I don't want to be just friends anymore," he admitted, city lights reflecting in her eyes.\n\n"Finally," she said, kissing him softly. "I've been waiting for you to realize what you've always meant to me."\n\nBest friends, perfect lovers. The kind of love story that had been written in the stars all along.`
    ],
    theme: 'starry'
  },
  {
    id: 14,
    title: 'Lavender Nights',
    author: 'Harper Elise',
    emoji: '💜',
    cover: 'A countryside escape turned into forever',
    pages: [
      `The countryside cottage was supposed to be a solo vacation. Peaceful. Healing. Instead, she found him—a local artist tending his lavender garden at sunset.\n\n"You look lost," he said gently.\n\n"I was," she replied. "I think I was waiting for you to find me."\n\nDays became weeks. Weeks became a lifetime. Love grew as naturally as the lavender around them.`
    ],
    theme: 'cafe'
  },
  {
    id: 15,
    title: 'When the Ocean Waited',
    author: 'Aiden Frost',
    emoji: '🌊',
    cover: 'Summer returns to find him waiting',
    pages: [
      `Every summer of her life, she returned to the same beach, hoping to find the boy from her childhood memories.\n\nOne summer, he was there—older, but with the same kind eyes. "I waited," he said simply. "Every summer, I came hoping you would too."\n\n"I always came back," she said, tears flowing. "I was always looking for you."\n\nThey didn't waste another moment. Love was patient, but they had waited long enough.`
    ],
    theme: 'starry'
  }
]

export function StoryTime({ onBack }: StoryTimeProps) {
  const [view, setView] = useState<'home' | 'bookshelf' | 'reading'>('home')
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [savedProgress, setSavedProgress] = useState<Record<number, number>>({})
  const [showEndAnimation, setShowEndAnimation] = useState(false)

  // Load saved progress from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('storyProgress')
      if (saved) {
        setSavedProgress(JSON.parse(saved))
      }
    }
  }, [])

  const handleStartReading = (story: Story) => {
    playSound('start')
    setSelectedStory(story)
    setCurrentPage(savedProgress[story.id] || 0)
    setView('reading')
  }

  const handleNextPage = () => {
    if (selectedStory && currentPage < selectedStory.pages.length - 1) {
      playSound('click')
      const newPage = currentPage + 1
      setCurrentPage(newPage)
      
      // Save progress
      const newProgress = { ...savedProgress, [selectedStory.id]: newPage }
      setSavedProgress(newProgress)
      if (typeof window !== 'undefined') {
        localStorage.setItem('storyProgress', JSON.stringify(newProgress))
      }
    } else if (selectedStory && currentPage === selectedStory.pages.length - 1) {
      // End of story
      setShowEndAnimation(true)
      playSound('end')
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      playSound('click')
      setCurrentPage(currentPage - 1)
    }
  }

  const getThemeGradient = (theme: Story['theme']) => {
    const gradients: Record<Story['theme'], string> = {
      rainy: 'from-slate-900 via-slate-800 to-slate-700',
      moonlight: 'from-indigo-950 via-purple-900 to-indigo-900',
      starry: 'from-slate-950 via-indigo-900 to-purple-900',
      cafe: 'from-amber-900 via-amber-800 to-orange-900',
      train: 'from-slate-900 via-purple-900 to-slate-800',
      snowfall: 'from-blue-100 via-slate-50 to-cyan-100'
    }
    return gradients[theme]
  }

  // Home Screen
  if (view === 'home') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        {/* Animated stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-yellow-200 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.6 + 0.2,
                animation: `twinkle 3s ease-in-out ${Math.random() * 2}s infinite`,
              }}
            >
              ✨
            </div>
          ))}
        </div>

        <style>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.8; }
          }
        `}</style>

        <div className="relative z-10 text-center max-w-2xl">
          <div className="mb-2 text-6xl animate-bounce">🌙</div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Story Time
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-2">
            "Every love story feels warmer at night"
          </p>

          <div className="mb-12 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-purple-200">
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              Curl up with 15 romantic bedtime stories crafted for the ones you love. Dreamy, emotional, and guaranteed to make your heart flutter.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="text-3xl mb-2">📚</div>
                <p className="text-sm font-semibold">15 Stories</p>
                <p className="text-xs text-muted-foreground">Romantic tales</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-3xl mb-2">✨</div>
                <p className="text-sm font-semibold">Dreamy Vibes</p>
                <p className="text-xs text-muted-foreground">Nighttime magic</p>
              </div>
              <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                <div className="text-3xl mb-2">💖</div>
                <p className="text-sm font-semibold">Cozy Reads</p>
                <p className="text-xs text-muted-foreground">Happy endings</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => {
                playSound('start')
                setView('bookshelf')
              }}
              className="rounded-full px-8 py-6 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Open Library 📖
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

  // Bookshelf View
  if (view === 'bookshelf') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gradient-to-br from-slate-950 via-purple-900 to-slate-900">
        {/* Header */}
        <div className="mb-8 w-full max-w-6xl">
          <button
            onClick={() => setView('home')}
            className="flex items-center gap-2 text-purple-300 hover:text-purple-100 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <h2 className="text-4xl font-bold text-center mb-2">
            <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Story Library 📚
            </span>
          </h2>
          <p className="text-center text-purple-200">Select a story to begin your cozy journey</p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full mb-8">
          {stories.map((story) => (
            <button
              key={story.id}
              onClick={() => handleStartReading(story)}
              className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/20 hover:border-purple-400/50"
            >
              {/* Glassmorphism glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <div className="text-6xl mb-4">{story.emoji}</div>
                <h3 className="text-xl font-bold text-white mb-2">{story.title}</h3>
                <p className="text-sm text-purple-200 mb-4">by {story.author}</p>
                <p className="text-xs text-purple-300 leading-relaxed mb-4">{story.cover}</p>
                
                {savedProgress[story.id] !== undefined && (
                  <div className="text-xs text-pink-300 font-semibold">
                    Continue reading (Page {savedProgress[story.id] + 1})
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-purple-400">
          <p>Perfect for bedtime, quiet evenings, or any moment you need romance 💕</p>
        </div>
      </div>
    )
  }

  // Reading View
  if (view === 'reading' && selectedStory) {
    const isLastPage = currentPage === selectedStory.pages.length - 1

    return (
      <div
        className={`flex flex-col items-center justify-center min-h-screen px-4 py-8 bg-gradient-to-br ${getThemeGradient(
          selectedStory.theme
        )}`}
      >
        {showEndAnimation && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
            <Confetti count={50} duration={4} delay={0} shape="heart" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40">
              <div className="text-7xl animate-bounce">💖</div>
              <div className="text-center max-w-xl">
                <p className="text-3xl font-bold text-white mb-2">And somehow...</p>
                <p className="text-2xl text-pink-200">love chose them again 💖</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 w-full max-w-4xl">
          <button
            onClick={() => setView('bookshelf')}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Library
          </button>
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white mb-2">{selectedStory.emoji}</h2>
            <h3 className="text-3xl font-bold text-white mb-1">{selectedStory.title}</h3>
            <p className="text-white/70 text-sm mb-4">by {selectedStory.author}</p>
            <div className="flex justify-center gap-2 mb-2">
              {selectedStory.pages.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 w-8 rounded-full transition-all ${
                    idx <= currentPage ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-white/60">
              Page {currentPage + 1} of {selectedStory.pages.length}
            </p>
          </div>
        </div>

        {/* Story Container */}
        <div className="max-w-2xl w-full mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 md:p-12 shadow-2xl border border-white/20">
            {/* Content */}
            <div className="min-h-80 flex items-center justify-center">
              <p className="text-lg md:text-xl leading-relaxed text-white/90 text-center whitespace-pre-line font-serif">
                {selectedStory.pages[currentPage]}
              </p>
            </div>

            {/* Decorative elements */}
            <div className="flex justify-center gap-4 mt-8 text-3xl opacity-50">
              💕 ✨ 💕
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-4 max-w-2xl w-full">
          <Button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            variant={currentPage === 0 ? 'ghost' : 'default'}
            className="flex-1 rounded-full py-6 text-lg text-white bg-white/20 hover:bg-white/30 disabled:opacity-30"
          >
            ← Previous
          </Button>

          {!isLastPage ? (
            <Button
              onClick={handleNextPage}
              className="flex-1 rounded-full py-6 text-lg bg-white text-purple-900 hover:bg-white/90 font-semibold"
            >
              Next →
            </Button>
          ) : !showEndAnimation ? (
            <Button
              onClick={handleNextPage}
              className="flex-1 rounded-full py-6 text-lg bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:shadow-lg font-semibold"
            >
              Finish ✨
            </Button>
          ) : (
            <Button
              onClick={() => {
                setView('bookshelf')
                setShowEndAnimation(false)
              }}
              className="flex-1 rounded-full py-6 text-lg bg-white text-purple-900 hover:bg-white/90 font-semibold"
            >
              Back to Library
            </Button>
          )}
        </div>

        {/* Footer message */}
        <div className="mt-8 text-center text-sm text-white/60 max-w-2xl">
          <p>Reading saved automatically. Continue anytime 💕</p>
        </div>
      </div>
    )
  }

  return null
}
