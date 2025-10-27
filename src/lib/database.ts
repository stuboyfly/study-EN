import { useEffect, useState } from 'react'
import { VOCABULARY_LIST } from './vocabulary'

export interface Word {
  id: number
  headword: string
  meaning: string
  example?: string
  audioKey?: string
}

export const useDatabase = () => {
  const [db, setDb] = useState<IDBDatabase | null>(null)

  useEffect(() => {
    const initDB = async () => {
      return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open('FunWordsDB', 1)

        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)

        request.onupgradeneeded = (event) => {
          const database = (event.target as IDBOpenDBRequest).result

          // Create words store
          if (!database.objectStoreNames.contains('words')) {
            const wordsStore = database.createObjectStore('words', { keyPath: 'id' })
            wordsStore.createIndex('headword', 'headword', { unique: true })
          }

          // Create progress store
          if (!database.objectStoreNames.contains('progress')) {
            const progressStore = database.createObjectStore('progress', { keyPath: 'wordId' })
            progressStore.createIndex('wordId', 'wordId', { unique: true })
          }

          // Create meta store
          if (!database.objectStoreNames.contains('meta')) {
            database.createObjectStore('meta', { keyPath: 'key' })
          }
        }
      })
    }

    initDB()
      .then(database => {
        setDb(database)
        initializeWords(database)
      })
      .catch(console.error)
  }, [])

  const initializeWords = (database: IDBDatabase) => {
    const transaction = database.transaction(['words'], 'readonly')
    const store = transaction.objectStore('words')
    const countRequest = store.count()

    countRequest.onsuccess = () => {
      if (countRequest.result === 0) {
        // Add sample words
        const writeTransaction = database.transaction(['words'], 'readwrite')
        const writeStore = writeTransaction.objectStore('words')

        VOCABULARY_LIST.forEach(word => {
          writeStore.add(word)
        })
      }
    }
  }

  const getRandomWords = async (count: number): Promise<Word[]> => {
    if (!db) return VOCABULARY_LIST.slice(0, count)

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['words'], 'readonly')
      const store = transaction.objectStore('words')
      const request = store.getAll()

      request.onsuccess = () => {
        const allWords = request.result
        const shuffled = [...allWords].sort(() => 0.5 - Math.random())
        resolve(shuffled.slice(0, count))
      }

      request.onerror = () => reject(request.error)
    })
  }

  const updateProgress = async (wordId: number, isCorrect: boolean) => {
    if (!db) return

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['progress'], 'readwrite')
      const store = transaction.objectStore('progress')

      const getRequest = store.get(wordId)

      getRequest.onsuccess = () => {
        const progress = getRequest.result || { wordId, correct: 0, wrong: 0 }

        if (isCorrect) {
          progress.correct += 1
        } else {
          progress.wrong += 1
        }

        const putRequest = store.put(progress)
        putRequest.onsuccess = () => resolve(progress)
        putRequest.onerror = () => reject(putRequest.error)
      }

      getRequest.onerror = () => reject(getRequest.error)
    })
  }

  return {
    getRandomWords,
    updateProgress
  }
}