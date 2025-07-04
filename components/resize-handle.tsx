"use client"

import type React from "react"

type ResizeHandleProps = {
  onMouseDown: (e: React.MouseEvent) => void
  direction?: "vertical" | "horizontal"
}

export function ResizeHandle({ onMouseDown, direction = "vertical" }: ResizeHandleProps) {
  // The handle is visually hidden but functional.
  // The hit area is increased for easier grabbing.
  const baseClasses = "bg-card border-0"
  const directionClasses = direction === "vertical" ? "w-2 h-full cursor-col-resize" : "h-2 w-full cursor-row-resize"

  return <div className={`${baseClasses} ${directionClasses}`} onMouseDown={onMouseDown} />
}
