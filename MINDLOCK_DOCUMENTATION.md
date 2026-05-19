# MindLock - Documentation

## Overview

**MindLock** is a competitive 2-player mind-reading number guessing game where players secretly choose a number and take turns guessing each other's hidden number. The game combines strategy, psychology, and deduction to determine who can crack their opponent's code first.

## Game Concept

Instead of a traditional "guess the number" game, MindLock features:
- Both players create secret numbers simultaneously
- Players battle turn-by-turn to guess the opponent's number
- Higher/Lower hints narrow down the possible range
- Strategic depth with mind games
- Hidden information creates tension

## How to Play

### Phase 1: Secret Setup
1. Both Adi and Dev enter a secret number (0-99999, up to 5 digits)
2. Numbers are stored in state and displayed as masked bullets (••••)
3. Numbers never appear on screen again - completely hidden

### Phase 2: Countdown
After both secrets are set:
- Countdown begins: 3... 2... 1...
- Screen displays "🔥 START 🔥"
- Battle officially begins

### Phase 3: Turn-Based Guessing
**Adi's Turn First:**
- Adi enters a guess to crack Dev's number
- Game responds with hint: "Higher ⬆️" or "Lower ⬇️"
- Range narrows based on guess
- If correct: "💖 CORRECT NUMBER! Adi Wins!"

**Dev's Turn:**
- Dev enters a guess for Adi's number
- Same hint system applies
- Range updates on screen
- Turn alternates back to Adi

### Phase 4: Victory Screen
When a player guesses correctly:
- Confetti animation with falling hearts
- Winner emoji shows
- Guess count displayed
- Option to play again or return to arcade

## Game Features

### Core Mechanics
- **Hidden Numbers**: Both numbers stay completely hidden throughout
- **Range Tracking**: Visible range updates show narrowing possibilities
- **Turn System**: Strict alternation between Adi and Dev
- **Guess Counter**: Track how many attempts each player used
- **Guess History**: Recent 10 guesses shown for context

### Display Elements

#### Current Player's View
```
Current Player (e.g., Adi)
- Possible Range: 1578 ↔ 3000
- Last Guess: 2500
- Hint: Higher ⬆️
- Recent Guesses: [2500, 2000, 1800, ...]
- Guess Counter: 3
```

#### Opponent's View (Real-time Stats)
```
Opponent Status (e.g., Dev)
- Their Possible Range: 1000 ↔ 4500
- Their Last Guess: 4500
- Their Hint: Lower ⬇️
- Their Recent Guesses: [4500, 3500, ...]
- Their Guess Count: 2
```

### Visual Design

#### Color Scheme
- **Dark Night Theme**: Slate-900 to purple-900 gradient background
- **Adi (Pink)**: Pink-500 to rose-500 gradient cards (💙)
- **Dev (Blue)**: Blue-500 to cyan-500 gradient cards (💖)
- **Accents**: White/purple text on dark backgrounds

#### Animations
- Animated blob background elements
- Pulsing countdown numbers
- Falling heart confetti on victory
- Smooth transitions between screens

#### UI Components
- Glassmorphic cards with backdrop blur
- Rounded inputs with focus states
- Color-coded player cards (pink/blue)
- Clear range displays with numerical separators

### Smart Features

1. **Guess History**: View last 10 guesses to remember patterns
2. **Range Visualization**: See the narrowing possibilities in real-time
3. **Psychology**: Players can deduce strategy from guess patterns
4. **Pause Points**: Clear UI for reading both players' situations
5. **Sound Effects**: Optional audio feedback (toggle with speaker icon)

## Game States

### Setup Screen
- Both players enter secret numbers
- Password-style input (masked)
- Buttons disabled until input valid
- "Let's Battle!" button appears when both ready

### Countdown
- Numbers (3, 2, 1) animate on screen
- "🔥 START 🔥" message
- Builds anticipation

### Game Screen
- Current player's guessing area (larger)
- Opponent's stats area (real-time)
- Range narrowing display
- Guess history
- Sound toggle in top right

### Victory Screen
- Confetti animation with hearts
- Winner name with large emoji
- Guess count comparison
- "Play Again" button
- "Back to Arcade" button

## Technical Details

### Component: `mind-lock.tsx`
- 705 lines of React component code
- State management with useState
- Turn-based game logic
- Sound integration
- Responsive design

### State Variables
```typescript
interface GameState {
  adiSecret: string | null
  devSecret: string | null
  adiLowest: number
  adiHighest: number
  devLowest: number
  devHighest: number
  adiLastGuess: number | null
  devLastGuess: number | null
  adiLastHint: string | null
  devLastHint: string | null
  adiGuessCount: number
  devGuessCount: number
  currentTurn: 'setup' | 'adi' | 'dev' | 'countdown'
  winner: 'adi' | 'dev' | null
  adiGuessHistory: number[]
  devGuessHistory: number[]
}
```

### Key Functions
- `handleAdiSecretSubmit()`: Store Adi's secret
- `handleDevSecretSubmit()`: Store Dev's secret
- `startCountdown()`: Begin 3-2-1 sequence
- `handleAdiGuess(guess)`: Process Adi's guess and update Dev's range
- `handleDevGuess(guess)`: Process Dev's guess and update Adi's range
- `calculateHint(guess, secret)`: Generate Higher/Lower hint
- `checkVictory(guess, secret)`: Determine if guess is correct
- `resetGame()`: Reset all state for new game

## Integration

The game is integrated into the Love Arcade as:
- **Game ID**: `'mind-lock'`
- **Route**: Handled in `app/page.tsx`
- **Home Card**: "MindLock 🧠 Secret number battle"
- **Import**: `import { MindLock } from '@/components/games/mind-lock'`

## Theme Variations

The game supports alternative names:
- **MindLock** (Current) - Cerebral, strategic feel
- **Heart Code** - Romantic emphasis
- **Crack My Code** - Playful, competitive
- **Secret Digits** - Mystery angle
- **Love Number Duel** - Relationship angle

## Responsive Design

- **Mobile**: Full-screen single column layout
- **Tablet**: Two-column layout with appropriate spacing
- **Desktop**: Side-by-side player cards with full information

## Audio Integration

- Uses existing `playSound()` function from `lib/sound.ts`
- Sound types: 'guess', 'wrong', 'victory'
- Sound toggle button in top-right corner (Volume2/VolumeX icons)
- Respects user preference throughout game

## Color Psychology

- **Dark purple background**: Night time, mysterious, focused
- **Pink for Adi**: Warm, friendly, approachable
- **Blue for Dev**: Cool, strategic, calm
- **White text**: Clear, readable, professional
- **Glowing accents**: Modern, high-tech feel

## Victory Condition

A player wins when they:
1. Make a guess equal to opponent's secret number
2. Game confirms match: "CORRECT"
3. Screen transitions to victory celebration
4. Confetti animation plays
5. Guess count is recorded

## Replayability

- "Play Again" button resets all state
- Both players can change strategies
- Different numbers create completely new game
- No memory of previous rounds
- Pure competition each time

## Suggested Enhancements

1. **Difficulty Modes**: Different range sizes (0-100, 0-1000, 0-99999)
2. **Time Limits**: Add countdown timer for pressure
3. **Statistics Tracking**: Remember win/loss history
4. **Leaderboard**: Track best guess counts
5. **Hints System**: Limited "hints" to use mid-game
6. **Power-ups**: Special abilities (skip turn, see exact guess, etc.)
7. **Voice Chat**: Audio to add real-time psychology
8. **Emojis**: Custom reactions during guessing
9. **Undo Feature**: One redo per round
10. **Sudden Death**: If both exceed 10 guesses, smallest range wins

## Accessibility

- Clear, readable contrast ratios
- Focus states on all interactive elements
- Keyboard navigation supported
- Screen reader friendly labels
- Color not the only information indicator
- Responsive design for all devices

## Browser Compatibility

- Modern browsers with ES6 support
- React 18+ required
- Tailwind CSS for styling
- Framer Motion optional for advanced animations

## Performance

- ~705 lines of code
- Minimal re-renders with smart state updates
- No external API calls
- localStorage optional for future statistics
- Builds and compiles in 2.8 seconds

---

Created for Adi & Dev's Love Arcade ❤️
A game about understanding each other through strategy and mind-reading.
