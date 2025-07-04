"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { Copy, ChevronUp, X, PanelLeft, PanelRight, RefreshCw, ThumbsUp, ThumbsDown, Check } from "lucide-react"
import { ChatInput } from "./chat-input"
import type { Message } from "@/app/page"

const AiAvatar = () => (
  <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-card border">
    <div className="ai-avatar-logo" role="img" aria-label="AI Avatar" />
  </div>
)

const ThinkingAnimation = () => (
  <div className="flex items-center gap-1.5">
    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: "0s" }} />
    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
  </div>
)

const SQLSyntaxHighlight = ({ code }: { code: string }) => {
  const highlight = (text: string) => {
    return text
      .toUpperCase()
      .replace(
        /\b(SELECT|FROM|WHERE|AS|OVER|ORDER BY|ROWS BETWEEN|PRECEDING|AND|CURRENT ROW|GROUP BY|NOT LIKE|DATE_TRUNC|AVG|COUNT|ROUND)\b/g,
        `<span class="sql-keyword">$1</span>`,
      )
      .replace(/('.*?')/g, `<span class="sql-string">$1</span>`)
      .replace(/\b(\d+(\.\d+)?)\b/g, `<span class="sql-number">$1</span>`)
      .replace(/\b(PUBLIC\.\w+)\b/g, `<span class="sql-schema">$1</span>`)
  }

  return (
    <pre
      className="p-4 text-sm whitespace-pre-wrap break-all font-medium bg-white dark:bg-[rgba(0,0,0,0.5375)] text-gray-800 dark:text-[rgba(197,253,243,1)]"
      dangerouslySetInnerHTML={{ __html: highlight(code) }}
    />
  )
}

const CollapsibleCodeBlock = ({ title, code }: { title: string; code: string }) => {
  const [isOpen, setIsOpen] = useState(true)
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }

  return (
    <div className="mt-4 rounded-lg bg-gray-50 dark:bg-[#1E1F22] border border-gray-200 dark:border-border/50 overflow-hidden font-mono">
      <div className="flex justify-between p-2 bg-gray-100 dark:bg-white/[.03] flex-row items-start">
        <span className="text-sm text-gray-600 dark:text-muted-foreground font-sans px-2">{title}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md text-gray-500 dark:text-muted-foreground hover:bg-gray-200 dark:hover:bg-accent hover:text-gray-800 dark:hover:text-foreground"
            title="Copy SQL"
          >
            {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-md text-gray-500 dark:text-muted-foreground hover:bg-gray-200 dark:hover:bg-accent hover:text-gray-800 dark:hover:text-foreground"
            title={isOpen ? "Collapse" : "Expand"}
          >
            <ChevronUp
              size={14}
              className={`transform transition-transform duration-200 ${!isOpen ? "-rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>
      {isOpen && <SQLSyntaxHighlight code={code} />}
    </div>
  )
}

type ChatPanelProps = {
  side: "left" | "right"
  onToggleSide: () => void
  onClose?: () => void
  style?: React.CSSProperties
  className?: string
  messages: Message[]
  isThinking: boolean
  onSendMessage: (message: string, mode: "ask" | "action", model: string) => void
}

export function ChatPanel({
  side,
  onToggleSide,
  onClose,
  style,
  className,
  messages = [], // Added default value for robustness
  isThinking,
  onSendMessage,
}: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isThinking])

  return (
    <aside
      style={style}
      className={`bg-card text-card-foreground flex flex-col h-full flex-shrink-0 transition-all duration-300 ease-in-out ${className}`}
    >
      <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
        <h2 className="font-semibold">Chat</h2>
        <div className="flex items-center gap-2 text-muted-foreground">
          <button
            onClick={onToggleSide}
            className="p-1 rounded-md hover:bg-accent"
            title={side === "right" ? "Dock to left" : "Dock to right"}
          >
            {side === "right" ? <PanelLeft size={16} /> : <PanelRight size={16} />}
          </button>
          {onClose && (
            <button onClick={onClose} className="xl:hidden p-1 rounded-md hover:bg-accent">
              <X size={18} />
            </button>
          )}
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.centered ? "justify-center text-center" : ""}`}>
            {!msg.centered && msg.sender === "ai" && <AiAvatar />}
            <div
              className={`flex-grow text-sm max-w-full min-w-0 ${msg.sender === "user" && !msg.centered ? "ml-9" : ""}`}
            >
              <p className="whitespace-pre-wrap break-words">{msg.text}</p>
              {msg.sql && msg.sqlTitle && <CollapsibleCodeBlock title={msg.sqlTitle} code={msg.sql} />}
              {msg.sender === "ai" && !msg.centered && (
                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                  <button
                    className="p-1 rounded-md hover:bg-accent hover:text-foreground transition-all active:scale-90"
                    title="Copy"
                  >
                    <Copy size={14} />
                  </button>
                  <button
                    className="p-1 rounded-md hover:bg-accent hover:text-foreground transition-all active:scale-90"
                    title="Rerun"
                  >
                    <RefreshCw size={14} />
                  </button>
                  <button
                    className="p-1 rounded-md hover:bg-accent hover:text-foreground transition-all active:scale-90"
                    title="Upvote"
                  >
                    <ThumbsUp size={14} />
                  </button>
                  <button
                    className="p-1 rounded-md hover:bg-accent hover:text-foreground transition-all active:scale-90"
                    title="Downvote"
                  >
                    <ThumbsDown size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="flex items-start gap-3">
            <AiAvatar />
            <div className="flex-grow text-sm max-w-full min-w-0 pt-2">
              <ThinkingAnimation />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t flex-shrink-0">
        <ChatInput onSendMessage={onSendMessage} isThinking={isThinking} />
      </div>
    </aside>
  )
}
