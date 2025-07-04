"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Mic, Zap, HelpCircle, Sparkles, BrainCircuit, ChevronUp } from "lucide-react"

type ChatMode = "ask" | "action"

type Model = {
  id: string
  name: string
  icon: React.ElementType
}

const models: Model[] = [
  { id: "gpt-4o", name: "GPT-4o", icon: Sparkles },
  { id: "gpt-3.5", name: "GPT-3.5", icon: Sparkles },
  { id: "deepseek-v2", name: "DeepSeek-V2", icon: BrainCircuit },
]

type ChatInputProps = {
  onSendMessage: (message: string, mode: ChatMode, model: string) => void
  isThinking: boolean
}

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 11L12 5L18 11" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export function ChatInput({ onSendMessage, isThinking }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("")
  const [mode, setMode] = useState<ChatMode>("ask")
  const [selectedModel, setSelectedModel] = useState<Model>(models[0])
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const modelSelectorRef = useRef<HTMLDivElement>(null)
  const maxChars = 1000

  // Close model selector on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelSelectorRef.current && !modelSelectorRef.current.contains(event.target as Node)) {
        setIsModelSelectorOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    if (error) setError(null)
  }

  // Auto-resize textarea height
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      const scrollHeight = textarea.scrollHeight
      textarea.style.height = `${scrollHeight}px`
    }
  }, [inputValue])

  const handleSubmit = useCallback(() => {
    if (inputValue.trim() === "" || isThinking) return

    try {
      onSendMessage(inputValue, mode, selectedModel.name)
      setInputValue("")
      if (error) setError(null)
    } catch (e) {
      setError("Failed to send message. Please try again.")
    }
  }, [inputValue, isThinking, onSendMessage, mode, selectedModel, error])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="p-2">
      <div className="relative p-3 shadow-sm border focus-within:border-ring/50 transition-colors bg-transparent text-neutral-400 border-neutral-800 py-4 my-0 rounded-lg">
        <textarea
          ref={textareaRef}
          placeholder={mode === "ask" ? "Ask the data assistant..." : "Describe the action to perform..."}
          value={inputValue}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={isThinking}
          rows={1}
          maxLength={maxChars}
          className="w-full bg-transparent focus:outline-none resize-none pr-16 text-sm placeholder:text-muted-foreground"
          style={{ maxHeight: "200px", overflowY: "auto" }}
        />

        <div className="absolute right-3 top-3 flex flex-col items-end h-full">
          <button
            onClick={handleSubmit}
            disabled={!inputValue.trim() || isThinking}
            className="w-8 h-8 flex items-center justify-center dark:bg-white rounded-lg shadow-md hover:bg-gray-200 dark:hover:bg-gray-200 disabled:bg-gray-100 dark:disabled:bg-neutral-800 disabled:cursor-not-allowed disabled:text-gray-400 dark:disabled:text-neutral-600 transition-all bg-transparent"
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div className="relative" ref={modelSelectorRef}>
              <button
                onClick={() => setIsModelSelectorOpen(!isModelSelectorOpen)}
                className="flex items-center gap-1.5 px-2 py-1 text-xs bg-background/50 hover:bg-accent rounded-md transition-colors"
              >
                <selectedModel.icon size={14} />
                {selectedModel.name}
                <ChevronUp size={12} className={`transition-transform ${isModelSelectorOpen ? "" : "rotate-180"}`} />
              </button>
              {isModelSelectorOpen && (
                <div className="absolute bottom-full mb-2 w-36 bg-card border rounded-md shadow-lg z-10">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setSelectedModel(model)
                        setIsModelSelectorOpen(false)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-accent"
                    >
                      <model.icon size={14} />
                      {model.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => setMode(mode === "ask" ? "action" : "ask")}
              className="flex items-center gap-1.5 px-2 py-1 text-xs bg-background/50 hover:bg-accent rounded-md transition-colors"
              title={mode === "ask" ? "Switch to Action Mode" : "Switch to Ask Mode"}
            >
              {mode === "ask" ? <HelpCircle size={14} /> : <Zap size={14} />}
              <span className="capitalize">{mode}</span>
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <button className="p-1 hover:text-foreground transition-colors">
              <Mic size={14} />
            </button>
            <span>
              {inputValue.length}/{maxChars}
            </span>
          </div>
        </div>
      </div>
      {error && <p className="text-xs text-destructive mt-1.5 px-2">{error}</p>}
    </div>
  )
}
