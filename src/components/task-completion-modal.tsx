"use client"

import { useRouter } from "next/navigation"
import { CheckCircle, ArrowRight, PartyPopper, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TaskCompletionModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  nextTask?: {
    title: string
    href: string
  }
  showConfetti?: boolean
}

export function TaskCompletionModal({
  isOpen,
  onClose,
  title,
  description,
  nextTask,
  showConfetti = true,
}: TaskCompletionModalProps) {
  const router = useRouter()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Success header */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            {showConfetti ? (
              <PartyPopper className="w-10 h-10 text-white" />
            ) : (
              <CheckCircle className="w-10 h-10 text-white" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Task Complete! 🎉
          </h2>
          <p className="text-green-100">
            {title}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {description && (
            <p className="text-gray-600 text-center mb-6">
              {description}
            </p>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {nextTask && (
              <Button
                onClick={() => {
                  onClose()
                  router.push(nextTask.href)
                }}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <span>Next: {nextTask.title}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
            
            <Button
              onClick={() => {
                onClose()
                router.push('/dashboard')
              }}
              variant={nextTask ? "outline" : "default"}
              className="w-full"
              size="lg"
            >
              {nextTask ? 'Back to Dashboard' : 'Return to Dashboard'}
            </Button>
          </div>

          {/* Progress hint */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Your progress has been saved automatically
          </p>
        </div>
      </div>
    </div>
  )
}
