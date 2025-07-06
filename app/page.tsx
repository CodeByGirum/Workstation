"use client"
import { useState, useEffect, useRef } from "react"
import { WorkstationHeader } from "@/components/workstation-header"
import { LeftSidebar } from "@/components/left-sidebar"
import { MainPanel } from "@/components/main-panel"
import { ChatPanel } from "@/components/chat-panel"
import { ThemeProvider } from "next-themes"
import { ResizeHandle } from "@/components/resize-handle"
import { useResizablePanel } from "@/hooks/use-resizable-panel"
import { ChevronRight } from "lucide-react"

// Shared type for chat messages
export type Message = {
  id: number
  sender: "user" | "ai"
  text: string
  mode?: "ask" | "action"
  model?: string
  centered?: boolean
  sql?: string
  sqlTitle?: string
}

const initialMessages: Message[] = [
  {
    id: 1,
    sender: "ai",
    text: "Sup! Got data problems I can eat for breakfast?",
    centered: true,
  },
]

export default function DataCleaningWorkstation() {
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false) // For mobile drawer
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false) // For mobile drawer
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false)
  const [isSidebarPinned, setIsSidebarPinned] = useState(true) // Start pinned and expanded
  const [chatPanelSide, setChatPanelSide] = useState<"left" | "right">("right")

  const collapseTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Lifted state for chat
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isThinking, setIsThinking] = useState(false)

  const {
    size: leftSidebarWidth,
    handleMouseDown: handleLeftResize,
    resetSize: resetLeftSidebarWidth,
  } = useResizablePanel({
    initialSize: 256,
    minSize: 200,
    maxSize: 400,
    collapseThreshold: 150,
    onCollapse: () => {
      setIsLeftSidebarCollapsed(true)
      setIsSidebarPinned(false)
    },
    side: "left",
  })

  const { size: chatPanelWidth, handleMouseDown: handleChatResize } = useResizablePanel({
    initialSize: 440,
    minSize: 300,
    side: chatPanelSide,
  })

  // Auto-collapse on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeftSidebarCollapsed(true)
      setIsSidebarPinned(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const clearCollapseTimer = () => {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current)
      collapseTimerRef.current = null
    }
  }

  const handleMouseEnterSidebarArea = () => {
    clearCollapseTimer()
    if (!isSidebarPinned) {
      setIsLeftSidebarCollapsed(false)
    }
  }

  const handleMouseLeaveSidebarArea = () => {
    if (!isSidebarPinned) {
      collapseTimerRef.current = setTimeout(() => {
        setIsLeftSidebarCollapsed(true)
      }, 3000)
    }
  }

  const handlePinSidebar = () => {
    clearCollapseTimer()
    resetLeftSidebarWidth()
    setIsLeftSidebarCollapsed(false)
    setIsSidebarPinned(true)
  }

  const handleUnpinSidebar = () => {
    clearCollapseTimer()
    setIsLeftSidebarCollapsed(true)
    setIsSidebarPinned(false)
  }

  const handleSendMessage = (message: string, mode: "ask" | "action", model: string) => {
    if (message.trim() === "" || isThinking) return

    const newUserMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: message.trim(),
      mode,
      model,
    }

    setMessages((prevMessages) => [...prevMessages.filter((m) => !m.centered), newUserMessage])
    setIsThinking(true)

    setTimeout(() => {
      let botReply: Message
      if (mode === "action") {
        botReply = {
          id: Date.now() + 1,
          sender: "ai",
          text: `Using ${model} in Action mode: I'm executing the following task: "${message}".`,
        }
      } else {
        botReply = {
          id: Date.now() + 1,
          sender: "ai",
          text: `Using ${model}: All set! I've regenerated the SQL query you asked for. This script will filter the \`users\` table to find everyone older than 30. You can review it below.`,
          sqlTitle: "SQL Query to Filter Users by Age",
          sql: `SELECT\n  id,\n  name,\n  age\nFROM\n  users\nWHERE\n  age > 30;`,
        }
      }
      setMessages((prev) => [...prev, botReply])
      setIsThinking(false)
    }, 2000)
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="flex flex-col h-screen bg-background text-foreground font-sans">
        <WorkstationHeader
          onToggleLeftSidebar={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
          onToggleRightSidebar={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
          onSendMessage={handleSendMessage}
        />
        <div className="flex flex-grow overflow-hidden relative">
          {/* Left Sidebar Container */}
          <div className="hidden lg:flex h-full" onMouseLeave={handleMouseLeaveSidebarArea}>
            <div
              className="transition-all duration-300 ease-in-out flex-shrink-0 h-full"
              style={{ width: isLeftSidebarCollapsed ? 0 : leftSidebarWidth, overflow: "hidden" }}
              onMouseEnter={handleMouseEnterSidebarArea}
            >
              <LeftSidebar
                isCollapsed={isLeftSidebarCollapsed}
                onToggleCollapse={handleUnpinSidebar}
                style={{ width: leftSidebarWidth }}
              />
            </div>
            {!isLeftSidebarCollapsed && <ResizeHandle onMouseDown={handleLeftResize} />}
          </div>

          {/* Sidebar hover trigger area */}
          {isLeftSidebarCollapsed && (
            <>
              <div
                onMouseEnter={handleMouseEnterSidebarArea}
                className="hidden lg:block fixed left-0 top-0 h-full w-3 z-30"
              />
              <button
                onClick={handlePinSidebar}
                className="fixed z-20 left-2 top-1/2 -translate-y-1/2 bg-card border p-1 rounded-md shadow-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-all"
                title="Expand and pin sidebar"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}

          {/* Chat Panel on Left */}
          {chatPanelSide === "left" && (
            <div className="hidden xl:flex h-full">
              <ChatPanel
                side="left"
                onToggleSide={() => setChatPanelSide("right")}
                style={{ width: `${chatPanelWidth}px` }}
                messages={messages}
                isThinking={isThinking}
                onSendMessage={handleSendMessage}
              />
              <ResizeHandle onMouseDown={handleChatResize} />
            </div>
          )}

          {/* Main Content */}
          <MainPanel />

          {/* Chat Panel on Right */}
          {chatPanelSide === "right" && (
            <div className="hidden xl:flex h-full">
              <ResizeHandle onMouseDown={handleChatResize} />
              <ChatPanel
                side="right"
                onToggleSide={() => setChatPanelSide("left")}
                style={{ width: `${chatPanelWidth}px` }}
                messages={messages}
                isThinking={isThinking}
                onSendMessage={handleSendMessage}
              />
            </div>
          )}

          {/* Mobile Drawers */}
          {isLeftSidebarOpen && (
            <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setIsLeftSidebarOpen(false)} />
          )}
          <div
            className={`fixed inset-y-0 left-0 z-50 transition-transform transform lg:hidden ${
              isLeftSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <LeftSidebar isCollapsed={false} onClose={() => setIsLeftSidebarOpen(false)} />
          </div>

          {isRightSidebarOpen && (
            <div className="fixed inset-0 bg-black/60 z-40 xl:hidden" onClick={() => setIsRightSidebarOpen(false)} />
          )}
          <div
            className={`fixed inset-y-0 right-0 z-50 transition-transform transform xl:hidden ${
              isRightSidebarOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <ChatPanel
              side={chatPanelSide}
              onToggleSide={() => setChatPanelSide(chatPanelSide === "left" ? "right" : "left")}
              onClose={() => setIsRightSidebarOpen(false)}
              messages={messages}
              isThinking={isThinking}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}
