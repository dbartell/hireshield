"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  CheckCircle, XCircle, RotateCcw, ArrowRight, Loader2,
  AlertTriangle, Trophy
} from "lucide-react"
import type { QuizQuestion } from "@/lib/training-data"
import { PASSING_SCORE } from "@/lib/training-data"

interface QuizProps {
  questions: QuizQuestion[]
  sectionNumber: number
  onSubmit: (answers: Record<string, number>) => Promise<{
    success: boolean
    score: number
    passed: boolean
    correctAnswers?: { id: string; correctAnswer: number; explanation: string }[]
    trackComplete?: boolean
  }>
  onContinue: () => void
}

export function Quiz({ questions, sectionNumber, onSubmit, onContinue }: QuizProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{
    score: number
    passed: boolean
    correctAnswers?: { id: string; correctAnswer: number; explanation: string }[]
    trackComplete?: boolean
  } | null>(null)

  const allAnswered = questions.every(q => answers[q.id] !== undefined)

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (result) return // Don't allow changes after submission
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }))
  }

  const handleSubmit = async () => {
    if (!allAnswered) return
    
    setSubmitting(true)
    try {
      const res = await onSubmit(answers)
      setResult({
        score: res.score,
        passed: res.passed,
        correctAnswers: res.correctAnswers,
        trackComplete: res.trackComplete
      })
    } catch (error) {
      console.error('Quiz submission error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleRetry = () => {
    setAnswers({})
    setResult(null)
  }

  // Result view
  if (result) {
    return (
      <Card>
        <CardContent className="pt-6">
          {result.passed ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {result.trackComplete ? (
                  <Trophy className="w-10 h-10 text-yellow-500" />
                ) : (
                  <CheckCircle className="w-10 h-10 text-green-600" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {result.trackComplete ? 'Training Complete!' : 'Quiz Passed!'}
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                You scored <span className="font-bold text-green-600">{result.score}%</span>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                {result.trackComplete 
                  ? 'Congratulations! You\'ve completed all sections. Your certificate is ready!'
                  : 'Great job! You can now proceed to the next section.'
                }
              </p>
              <Button onClick={onContinue} size="lg">
                {result.trackComplete ? 'View Certificate' : 'Continue'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Quite</h2>
              <p className="text-lg text-gray-600 mb-2">
                You scored <span className="font-bold text-red-600">{result.score}%</span>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                You need {PASSING_SCORE}% to pass. Review the correct answers below and try again.
              </p>

              {/* Show correct answers */}
              <div className="text-left space-y-4 mb-6">
                {result.correctAnswers?.map((answer, index) => {
                  const question = questions.find(q => q.id === answer.id)
                  if (!question) return null
                  const wasCorrect = answers[answer.id] === answer.correctAnswer

                  return (
                    <div 
                      key={answer.id} 
                      className={`p-4 rounded-lg border ${
                        wasCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        {wasCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        )}
                        <p className="font-medium text-gray-900">
                          {index + 1}. {question.question}
                        </p>
                      </div>
                      {!wasCorrect && (
                        <>
                          <p className="text-sm text-gray-600 ml-7 mb-1">
                            <span className="text-red-600">Your answer:</span> {question.options[answers[answer.id]]}
                          </p>
                          <p className="text-sm text-gray-600 ml-7 mb-2">
                            <span className="text-green-600">Correct answer:</span> {question.options[answer.correctAnswer]}
                          </p>
                        </>
                      )}
                      <p className="text-sm text-gray-500 ml-7 italic">
                        {answer.explanation}
                      </p>
                    </div>
                  )
                })}
              </div>

              <Button onClick={handleRetry} size="lg">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Quiz taking view
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          Section {sectionNumber} Quiz
        </CardTitle>
        <CardDescription>
          Answer all questions to complete this section. You need {PASSING_SCORE}% to pass.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {questions.map((question, qIndex) => (
            <div key={question.id} className="border-b border-gray-200 pb-6 last:border-0">
              <p className="font-medium text-gray-900 mb-4">
                {qIndex + 1}. {question.question}
              </p>
              <div className="space-y-2">
                {question.options.map((option, oIndex) => (
                  <button
                    key={oIndex}
                    onClick={() => handleSelect(question.id, oIndex)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      answers[question.id] === oIndex
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        answers[question.id] === oIndex
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {answers[question.id] === oIndex && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <span className="text-gray-700">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {Object.keys(answers).length} of {questions.length} questions answered
          </p>
          <Button 
            onClick={handleSubmit} 
            disabled={!allAnswered || submitting}
            size="lg"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Quiz
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
