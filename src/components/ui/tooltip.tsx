"use client"

import * as React from "react"
import { HelpCircle } from "lucide-react"

interface TooltipProps {
  content: string
  children?: React.ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
  const [show, setShow] = React.useState(false)

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(!show)}
        className="cursor-help"
      >
        {children || <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />}
      </div>
      {show && (
        <div className="absolute z-50 w-64 p-3 text-sm bg-gray-900 text-white rounded-lg shadow-lg -top-2 left-6 transform">
          {content}
          <div className="absolute w-2 h-2 bg-gray-900 rotate-45 -left-1 top-4" />
        </div>
      )}
    </div>
  )
}

interface HelpModalProps {
  title: string
  content: React.ReactNode
  trigger?: React.ReactNode
}

export function HelpModal({ title, content, trigger }: HelpModalProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
      >
        {trigger || (
          <>
            <HelpCircle className="w-4 h-4" />
            <span>Learn more</span>
          </>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-hidden shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-lg">{title}</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {content}
            </div>
            <div className="p-4 border-t bg-gray-50">
              <button
                onClick={() => setOpen(false)}
                className="w-full py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
