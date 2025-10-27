import { useState, useEffect } from 'react'
import { Heart, Star } from 'lucide-react'
import { GameResult } from '../App'
import { generateQuestion } from '../lib/questionGenerator'
import { soundManager } from '../lib/sounds'
import { getRandomVocabulary } from '../lib/vocabulary'

interface GamePageProps {
  onGameEnd: (result: GameResult) => void
}

export default function GamePage({ onGameEnd }: GamePageProps) {
  const [currentQuestion, setCurrentQuestion] = useState<any>(null)
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(3)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [questionCount, setQuestionCount] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)

  useEffect(() => {
    loadNewQuestion()
  }, [])

  const loadNewQuestion = async () => {
    const words = getRandomVocabulary(10)
    const question = generateQuestion(words)
    setCurrentQuestion(question)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setFeedback(null)
  }

  const handleAnswer = (answer: string) => {
    if (isAnswered || !currentQuestion) return

    setSelectedAnswer(answer)
    setIsAnswered(true)

    const isCorrect = answer === currentQuestion.correctAnswer
    setFeedback(isCorrect ? 'correct' : 'wrong')

    if (isCorrect) {
      soundManager.playCorrect()
      setScore(prev => prev + 1)
      setCorrectAnswers(prev => prev + 1)
      const newCombo = combo + 1
      setCombo(newCombo)
      setMaxCombo(prev => Math.max(prev, newCombo))

      // Play combo sound for 3+ combo
      if (newCombo >= 3) {
        soundManager.playCombo(newCombo)
      }

      // Combo rewards
      if (newCombo >= 5) {
        setLives(prev => Math.min(prev + 1, 3))
        soundManager.playLifeUp()
      }
    } else {
      soundManager.playWrong()
      setCombo(0)
      const newLives = lives - 1
      setLives(newLives)

      if (newLives <= 0) {
        setTimeout(() => endGame(), 1000)
        return
      }
    }

    setTimeout(() => {
      const nextQuestionCount = questionCount + 1
      setQuestionCount(nextQuestionCount)

      if (nextQuestionCount >= 10) {
        endGame()
      } else {
        loadNewQuestion()
      }
    }, 1500)
  }

  const useHint = () => {
    if (hintsUsed >= 2 || !currentQuestion || isAnswered) return
    setHintsUsed(prev => prev + 1)
    // TODO: Implement hint logic
  }

  const endGame = () => {
    const result: GameResult = {
      score,
      correctAnswers,
      totalQuestions: 10,
      maxCombo,
      livesRemaining: lives
    }

    // Update high score
    const currentHighScore = parseInt(localStorage.getItem('funwords-highscore') || '0')
    if (score > currentHighScore) {
      localStorage.setItem('funwords-highscore', score.toString())
    }

    onGameEnd(result)
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-primary">加载中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          {/* Lives */}
          <div className="flex items-center gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-6 h-6 ${
                  i < lives ? 'text-red-500 fill-red-500' : 'text-gray-500'
                }`}
              />
            ))}
          </div>

          {/* Score */}
          <div className="text-2xl font-bold">{score}</div>
        </div>

        <div className="flex items-center gap-2">
          {/* Combo */}
          {combo > 0 && (
            <div className="flex items-center gap-1 text-yellow-400 animate-pulse">
              <Star className="w-4 h-4 fill-yellow-400" />
              <span className="text-sm font-bold">x{combo}</span>
              {combo >= 5 && (
                <span className="text-xs text-green-400">+1❤️</span>
              )}
            </div>
          )}

          {/* Question counter */}
          <div className="text-sm text-muted-foreground">
            {questionCount + 1}/10
          </div>
        </div>
      </div>

      {/* Question */}
      <div
        className={`bg-card pixel-border p-6 mb-6 text-center transition-all duration-300 ${
          feedback === 'correct'
            ? 'animate-pixel-blink pixel-border-success'
            : feedback === 'wrong'
            ? 'animate-screen-shake pixel-border-error'
            : ''
        }`}
      >
        <h2 className="text-xl mb-4">{currentQuestion.question}</h2>

        {currentQuestion.type === 'multiple-choice' && (
          <div className="grid grid-cols-2 gap-3">
            {currentQuestion.options.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
                className={`p-3 pixel-border text-sm transition-all ${
                  isAnswered
                    ? option === currentQuestion.correctAnswer
                      ? 'bg-green-500/20 pixel-border-success'
                      : option === selectedAnswer
                      ? 'bg-red-500/20 pixel-border-error'
                      : 'bg-muted'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === 'spelling' && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="输入英文单词..."
              className="w-full p-3 bg-background pixel-border text-center"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAnswer(e.currentTarget.value.toLowerCase())
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.querySelector('input') as HTMLInputElement
                handleAnswer(input?.value.toLowerCase() || '')
              }}
              className="w-full bg-primary text-primary-foreground p-3 pixel-border-success"
            >
              提交答案
            </button>
          </div>
        )}
      </div>

      {/* Hints */}
      <div className="flex justify-center">
        <button
          onClick={useHint}
          disabled={hintsUsed >= 2 || isAnswered}
          className="bg-blue-500 text-white px-4 py-2 pixel-border disabled:opacity-50"
        >
          提示 ({2 - hintsUsed}次)
        </button>
      </div>
    </div>
  )
}