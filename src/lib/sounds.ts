// Simple sound effects using Web Audio API
export class SoundManager {
  private audioContext: AudioContext | null = null

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'square') {
    if (!this.audioContext) return

    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)

    oscillator.frequency.value = frequency
    oscillator.type = type

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)

    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + duration)
  }

  playCorrect() {
    // Success sound - ascending tones
    this.playTone(523.25, 0.1) // C5
    setTimeout(() => this.playTone(659.25, 0.1), 100) // E5
    setTimeout(() => this.playTone(783.99, 0.2), 200) // G5
  }

  playWrong() {
    // Error sound - descending tones
    this.playTone(392.00, 0.1) // G4
    setTimeout(() => this.playTone(329.63, 0.1), 100) // E4
    setTimeout(() => this.playTone(261.63, 0.2), 200) // C4
  }

  playCombo(combo: number) {
    if (combo >= 3) {
      // Combo sound - more complex pattern
      this.playTone(659.25, 0.05) // E5
      setTimeout(() => this.playTone(783.99, 0.05), 50) // G5
      setTimeout(() => this.playTone(1046.50, 0.1), 100) // C6
    }
  }

  playGameOver() {
    // Game over sound
    this.playTone(220.00, 0.2) // A3
    setTimeout(() => this.playTone(196.00, 0.3), 200) // G3
  }

  playLifeUp() {
    // Life gained sound
    this.playTone(523.25, 0.1) // C5
    setTimeout(() => this.playTone(659.25, 0.1), 100) // E5
    setTimeout(() => this.playTone(783.99, 0.1), 200) // G5
    setTimeout(() => this.playTone(1046.50, 0.2), 300) // C6
  }
}

// Export singleton instance
export const soundManager = new SoundManager()