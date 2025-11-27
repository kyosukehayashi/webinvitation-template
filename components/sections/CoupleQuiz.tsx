'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, HelpCircle, Sparkles } from 'lucide-react'
import { useConfig } from '@/hooks/useConfig'

interface QuizOption {
  label: string
  value: string
  isCorrect?: boolean
  description?: string
}

interface QuizQuestion {
  id: string
  question: string
  options: QuizOption[]
  hint: string
  explanation: string
}


export default function CoupleQuiz() {
  const config = useConfig()
  const quizQuestions = config.coupleQuiz?.questions || []

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)

  // クイズがない場合は非表示
  if (quizQuestions.length === 0) {
    return null
  }

  const currentQuestion = quizQuestions[currentIndex]

  const handleSelect = (option: QuizOption) => {
    setSelectedOption(option.value)
    if (!isRevealed) {
      setIsRevealed(true)
      if (option.isCorrect) {
        setCorrectCount((prev) => prev + 1)
      }
    }
  }

  const handleNext = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedOption(null)
      setIsRevealed(false)
    }
  }

  const handleReset = () => {
    setCurrentIndex(0)
    setSelectedOption(null)
    setIsRevealed(false)
    setCorrectCount(0)
  }

  return (
    <section id="couple-quiz" className="section-shell bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-120px' }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl"
        >
          <div className="card-panel p-6 sm:p-10">
            <div className="mb-8 flex flex-col gap-4 text-center">
              <div className="pill mx-auto">
                <Sparkles className="h-4 w-4" />
                {config.sections?.coupleQuiz?.pill || 'Couple Discovery Quiz'}
              </div>
              <h2 className="font-serif text-section-title text-text-primary">
                {config.sections?.coupleQuiz?.title || 'お二人をもっと知ろう'}
              </h2>
              <p className="text-sm text-text-secondary">
                {config.sections?.coupleQuiz?.description || 'クイズに答えて、おふたりの意外な一面に触れてみましょう。披露宴当日のトリビアトークのヒントにもなります。'}
              </p>
              <p className="text-xs text-accent">
                {currentIndex + 1} / {quizQuestions.length} {config.sections?.coupleQuiz?.questionCount || '問目'}
              </p>
            </div>

            <div className="space-y-6">
              <div className="rounded-sm bg-white p-6 shadow-inner">
                <div className="mb-4 flex items-start gap-3">
                  <HelpCircle className="mt-1 h-5 w-5 text-accent" />
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">
                      {currentQuestion.question}
                    </h3>
                    <p className="mt-2 text-sm text-text-secondary">
                      {config.sections?.coupleQuiz?.hintLabel || 'ヒント：'}{currentQuestion.hint}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {currentQuestion.options.map((option) => {
                    const isSelected = selectedOption === option.value
                    const isCorrectOption = Boolean(option.isCorrect)
                    const showAsCorrect = isRevealed && isCorrectOption
                    const showAsIncorrect = isRevealed && isSelected && !isCorrectOption

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleSelect(option)}
                        className={`flex h-full flex-col items-start gap-2 rounded-sm border px-4 py-3 text-left text-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent/20 ${showAsCorrect
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                          : showAsIncorrect
                            ? 'border-red-400 bg-red-50 text-red-600'
                            : isSelected
                              ? 'border-accent bg-accent/10 text-text-primary'
                              : 'border-gray-200 bg-white hover:border-accent/40'
                          }`}
                      >
                        <span className="font-medium">{option.label}</span>
                        {isRevealed && (
                          <span className="text-xs text-text-secondary">
                            {option.description}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {isRevealed && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-sm border border-emerald-100 bg-emerald-50 p-5 text-sm text-emerald-700"
                >
                  <div className="mb-2 inline-flex items-center gap-2 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                    {config.sections?.coupleQuiz?.explanationLabel || '解説'}
                  </div>
                  <p>{currentQuestion.explanation}</p>
                </motion.div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-text-secondary">
                  {config.sections?.coupleQuiz?.correctCountLabel || '現在の正解数：'}<span className="font-semibold text-text-primary">{correctCount}</span> / {quizQuestions.length}
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn-ghost"
                  >
                    {config.sections?.coupleQuiz?.buttons?.reset || '最初からやり直す'}
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={currentIndex === quizQuestions.length - 1}
                    className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {config.sections?.coupleQuiz?.buttons?.next || '次のクイズへ'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
