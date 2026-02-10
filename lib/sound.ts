// Sound utility for game audio effects using Web Audio API

export const playSound = (type: 'click' | 'win' | 'pop' | 'hover' | 'start' | 'end') => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    switch (type) {
      case 'click':
        oscillator.frequency.value = 600
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.1)
        break

      case 'win':
        oscillator.frequency.value = 800
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
        break

      case 'pop':
        oscillator.frequency.setValueAtTime(500, audioContext.currentTime)
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.15)
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.15)
        break

      case 'hover':
        oscillator.frequency.value = 400
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.08)
        break

      case 'start':
        // Soft game start sound - ascending tones
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime)
        oscillator.frequency.linearRampToValueAtTime(600, audioContext.currentTime + 0.2)
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.2)
        break

      case 'end':
        // Distinct game end sound - descending tones
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        oscillator.frequency.linearRampToValueAtTime(400, audioContext.currentTime + 0.3)
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
        break
    }
  } catch (e) {
    // Audio context not available, silently fail
  }
}
