import { Trophy, Star, Heart, RotateCcw } from 'lucide-react'
import { GameResult } from '../App'

interface ResultsPageProps {
  result: GameResult
  onReturnToHome: () => void
}

export default function ResultsPage({ result, onReturnToHome }: ResultsPageProps) {
  const accuracy = Math.round((result.correctAnswers / result.totalQuestions) * 100)

  const getMedal = () => {
    if (accuracy >= 90) return { type: 'S', color: 'text-yellow-400' }
    if (accuracy >= 80) return { type: 'A', color: 'text-purple-400' }
    if (accuracy >= 70) return { type: 'B', color: 'text-blue-400' }
    return { type: 'C', color: 'text-green-400' }
  }

  const medal = getMedal()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-card pixel-border p-8 max-w-md w-full text-center space-y-6">
        {/* Medal */}
        <div className="space-y-2">
          <Trophy className="w-16 h-16 mx-auto text-yellow-400" />
          <div className={`text-4xl font-bold ${medal.color}`}>
            {medal.type}级评价
          </div>
        </div>

        {/* Score */}
        <div className="text-6xl font-bold text-primary">
          {result.score}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="text-muted-foreground">正确率</div>
            <div className="text-xl font-bold">{accuracy}%</div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground">最高连击</div>
            <div className="flex items-center justify-center gap-1 text-xl font-bold text-yellow-400">
              <Star className="w-4 h-4 fill-yellow-400" />
              {result.maxCombo}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground">剩余生命</div>
            <div className="flex items-center justify-center gap-1 text-xl font-bold text-red-500">
              <Heart className="w-4 h-4 fill-red-500" />
              {result.livesRemaining}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground">答对题目</div>
            <div className="text-xl font-bold">
              {result.correctAnswers}/{result.totalQuestions}
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div className="text-muted-foreground text-sm">
          {accuracy >= 90 && '太棒了！你的词汇量非常出色！'}
          {accuracy >= 80 && accuracy < 90 && '做得很好！继续保持！'}
          {accuracy >= 70 && accuracy < 80 && '不错！还有提升空间！'}
          {accuracy < 70 && '加油！多练习会更好！'}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onReturnToHome}
            className="w-full bg-primary text-primary-foreground p-3 pixel-border-success flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            再来一局
          </button>
          <button
            onClick={onReturnToHome}
            className="w-full bg-muted text-foreground p-3 pixel-border"
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  )
}