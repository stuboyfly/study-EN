import { Word } from './database'

export interface Question {
  type: 'multiple-choice' | 'spelling' | 'audio'
  question: string
  correctAnswer: string
  options?: string[]
  word: Word
}

export function generateQuestion(words: Word[]): Question {
  const randomWord = words[Math.floor(Math.random() * words.length)]
  const questionTypes: Array<'multiple-choice' | 'spelling' | 'audio'> = ['multiple-choice', 'spelling']
  const type = questionTypes[Math.floor(Math.random() * questionTypes.length)]

  switch (type) {
    case 'multiple-choice':
      return generateMultipleChoiceQuestion(randomWord, words)
    case 'spelling':
      return generateSpellingQuestion(randomWord)
    case 'audio':
      return generateAudioQuestion(randomWord, words)
    default:
      return generateMultipleChoiceQuestion(randomWord, words)
  }
}

function generateMultipleChoiceQuestion(word: Word, allWords: Word[]): Question {
  const wrongOptions = allWords
    .filter(w => w.id !== word.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map(w => w.meaning)

  const options = [...wrongOptions, word.meaning].sort(() => 0.5 - Math.random())

  return {
    type: 'multiple-choice',
    question: `"${word.headword}" 的中文意思是？`,
    correctAnswer: word.meaning,
    options,
    word
  }
}

function generateSpellingQuestion(word: Word): Question {
  return {
    type: 'spelling',
    question: `请拼写这个单词：${word.meaning}`,
    correctAnswer: word.headword.toLowerCase(),
    word
  }
}

function generateAudioQuestion(word: Word, allWords: Word[]): Question {
  const wrongOptions = allWords
    .filter(w => w.id !== word.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map(w => w.headword)

  const options = [...wrongOptions, word.headword].sort(() => 0.5 - Math.random())

  return {
    type: 'multiple-choice', // For now, we'll use multiple choice for audio
    question: `请听发音，选择正确的单词`,
    correctAnswer: word.headword,
    options,
    word
  }
}

// Utility function to get random wrong answers
export function getRandomWrongAnswers(correctWord: Word, allWords: Word[], count: number): Word[] {
  return allWords
    .filter(word => word.id !== correctWord.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, count)
}