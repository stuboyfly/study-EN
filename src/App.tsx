import { useState } from 'react'
import HomePage from './components/HomePage'
import GamePage from './components/GamePage'
import ResultsPage from './components/ResultsPage'

type GameState = 'home' | 'game' | 'results'

export interface GameResult {
  score: number
  correctAnswers: number
  totalQuestions: number
  maxCombo: number
  livesRemaining: number
}

function App() {
  const [gameState, setGameState] = useState<GameState>('home')
  const [gameResult, setGameResult] = useState<GameResult | null>(null)

  const startGame = () => {
    setGameState('game')
  }

  const endGame = (result: GameResult) => {
    setGameResult(result)
    setGameState('results')
  }

  const returnToHome = () => {
    setGameState('home')
    setGameResult(null)
  }

  return (
    <div className="min-h-screen bg-background font-pixel text-foreground">
      {gameState === 'home' && <HomePage onStartGame={startGame} />}
      {gameState === 'game' && <GamePage onGameEnd={endGame} />}
      {gameState === 'results' && gameResult && (
        <ResultsPage result={gameResult} onReturnToHome={returnToHome} />
      )}
    </div>
  )
}

export default App