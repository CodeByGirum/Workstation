"use client"

import type React from "react"
import { TooltipProvider } from "@/components/ui/tooltip"

import { useState } from "react"
import { Undo, X, Loader2 } from "lucide-react"
import { cleaningActions } from "@/lib/data"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function ActionsToolbar() {
  const [actions, setActions] = useState(cleaningActions)
  const [removingIndex, setRemovingIndex] = useState<number | null>(null)

  const handleRemove = (e: React.MouseEvent, indexToRemove: number) => {
    e.stopPropagation() // Prevent the parent button's onClick if it had one
    setRemovingIndex(indexToRemove)

    setTimeout(() => {
      setActions((currentActions) => currentActions.filter((_, index) => index !== indexToRemove))
      setRemovingIndex(null)
    }, 1000) // Simulate network request
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 p-3 border-b bg-card overflow-x-auto">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="flex-shrink-0 flex items-center gap-1.5 px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-md hover:bg-accent disabled:opacity-50"
              disabled={removingIndex !== null}
            >
              <Undo size={14} />
              Undo All
            </button>
          </TooltipTrigger>
          <TooltipContent className="text-xs px-2 py-1">
            <p>Revert all cleaning actions</p>
          </TooltipContent>
        </Tooltip>
        <div className="flex flex-nowrap gap-2">
          {actions.map((action, index) => (
            <button
              key={action}
              disabled={removingIndex !== null}
              className="flex-shrink-0 flex items-center gap-1.5 px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md hover:bg-accent transition-all duration-300 ease-in-out disabled:opacity-50"
            >
              <span>{action}</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={(e) => handleRemove(e, index)}
                    className="text-muted-foreground hover:text-foreground disabled:cursor-not-allowed ml-1"
                    disabled={removingIndex !== null}
                    aria-label={`Remove action: ${action}`}
                  >
                    {removingIndex === index ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                  </button>
                </TooltipTrigger>
                <TooltipContent className="text-xs px-2 py-1">
                  <p>Remove this action</p>
                </TooltipContent>
              </Tooltip>
            </button>
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}
