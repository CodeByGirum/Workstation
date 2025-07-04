"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"

type UseResizablePanelOptions = {
  initialSize: number
  minSize?: number
  maxSize?: number
  direction?: "horizontal" | "vertical"
  side?: "left" | "right"
  onCollapse?: () => void
  collapseThreshold?: number
}

export function useResizablePanel({
  initialSize,
  minSize = 50,
  maxSize = Number.POSITIVE_INFINITY,
  direction = "horizontal",
  side = "left",
  onCollapse,
  collapseThreshold,
}: UseResizablePanelOptions) {
  const [size, setSize] = useState(initialSize)
  const isResizing = useRef(false)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    isResizing.current = true
  }, [])

  const handleMouseUp = useCallback(() => {
    isResizing.current = false
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing.current) {
        return
      }

      let newSize
      if (direction === "horizontal") {
        if (side === "left") {
          newSize = e.clientX
        } else {
          // side === 'right'
          newSize = window.innerWidth - e.clientX
        }
      } else {
        newSize = e.clientY
      }

      if (onCollapse && collapseThreshold && side === "left" && newSize < collapseThreshold) {
        onCollapse()
        isResizing.current = false
        return
      }

      const clampedSize = Math.max(minSize, Math.min(newSize, maxSize))
      setSize(clampedSize)
    },
    [minSize, maxSize, direction, side, onCollapse, collapseThreshold],
  )

  const resetSize = useCallback(() => {
    setSize(initialSize)
  }, [initialSize])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  return { size, handleMouseDown, resetSize }
}
