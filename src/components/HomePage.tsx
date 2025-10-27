import { Trophy } from 'lucide-react'

interface HomePageProps {
  onStartGame: () => void
}

export default function HomePage({ onStartGame }: HomePageProps) {
  const highScore = localStorage.getItem('funwords-highscore') || '0'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        {/* Logo */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-primary">
            FunWords
          </h1>
          <p className="text-lg text-muted-foreground">
            高考趣味背单词
          </p>
        </div>

        {/* High Score */}
        <div className="flex items-center justify-center gap-2 text-yellow-400">
          <Trophy className="w-6 h-6" />
          <span className="text-lg">最高分: {highScore}</span>
        </div>

        {/* Start Button */}
        <button
          onClick={onStartGame}
          className="w-full max-w-xs bg-primary text-primary-foreground font-bold py-4 px-8 pixel-border-success hover:bg-primary/90 transition-colors text-lg"
        >
          开始游戏
        </button>

        {/* Instructions */}
        <div className="text-sm text-muted-foreground space-y-2">
          <p>• 选择题、拼写题、听音题三种题型</p>
          <p>• 3条生命，答错扣1条</p>
          <p>• 连击奖励，连续答对获得额外生命</p>
          <p>• 每轮10题，挑战你的词汇量！</p>
        </div>
      </div>
    </div>
  )
}