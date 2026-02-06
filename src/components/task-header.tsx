"use client"

import Link from "next/link"
import { ArrowLeft, Clock, CheckCircle } from "lucide-react"

interface TaskHeaderProps {
  title: string
  description?: string
  estimatedTime?: string
  stateCode?: string
  lawName?: string
  isComplete?: boolean
  backHref?: string
  backLabel?: string
}

export function TaskHeader({
  title,
  description,
  estimatedTime,
  stateCode,
  lawName,
  isComplete = false,
  backHref = "/dashboard",
  backLabel = "Dashboard",
}: TaskHeaderProps) {
  return (
    <div className="border-b bg-white">
      <div className="max-w-3xl mx-auto px-6 py-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <Link 
            href={backHref} 
            className="flex items-center gap-1 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{title}</span>
          {stateCode && (
            <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">
              {stateCode}
            </span>
          )}
        </div>

        {/* Title row */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              {title}
              {isComplete && (
                <CheckCircle className="w-5 h-5 text-green-600" />
              )}
            </h1>
            {description && (
              <p className="text-gray-600 mt-1">{description}</p>
            )}
          </div>

          {/* Meta badges */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {estimatedTime && !isComplete && (
              <div className="flex items-center gap-1 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                <Clock className="w-4 h-4" />
                {estimatedTime}
              </div>
            )}
            {lawName && (
              <div className="text-xs text-gray-500 bg-blue-50 text-blue-700 px-2 py-1 rounded">
                {lawName}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
