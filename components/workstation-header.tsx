"use client"

import { History, User, Moon, Sun, PanelLeft, MessageSquare, ChevronRight } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { QueryHistory } from "./query-history"
import { SettingsPage } from "./settings-page"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-6 h-6" />
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-1.5 rounded-md hover:bg-accent hover:text-accent-foreground"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </TooltipTrigger>
        <TooltipContent className="text-xs px-2 py-1">
          <p>Toggle theme</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

type WorkstationHeaderProps = {
  onToggleLeftSidebar: () => void
  onToggleRightSidebar: () => void
  onSendMessage: (message: string, mode: "ask" | "action", model: string) => void
}

export function WorkstationHeader({
  onToggleLeftSidebar,
  onToggleRightSidebar,
  onSendMessage,
}: WorkstationHeaderProps) {
  return (
    <header className="flex items-center justify-between h-14 px-4 border-b bg-card text-card-foreground flex-shrink-0">
      <div className="flex items-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onToggleLeftSidebar}
                className="lg:hidden p-1.5 rounded-md hover:bg-accent hover:text-accent-foreground"
              >
                <PanelLeft size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="text-xs px-2 py-1">
              <p>Toggle schema browser</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {/* Breadcrumb for medium screens and up */}
        <div className="hidden md:flex items-center gap-2 text-md font-semibold">
          <a href="#" className="text-muted-foreground hover:text-foreground">
            My Project
          </a>
          <ChevronRight size={16} className="text-muted-foreground" />
          <span className="text-foreground">Data Cleaning Workstation</span>
        </div>
        {/* Simple title for small screens */}
        <h1 className="text-md font-semibold md:hidden">Data Cleaning Workstation</h1>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        <Popover>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <button className="hidden sm:block p-1.5 rounded-md hover:bg-accent hover:text-accent-foreground">
                    <History size={18} />
                  </button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent className="text-xs px-2 py-1">
                <p>Query History</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <PopoverContent className="p-0 w-96" align="end">
            <QueryHistory onSendMessage={onSendMessage} />
          </PopoverContent>
        </Popover>
        <ThemeToggle />
        <Dialog>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <button className="hidden sm:block p-1.5 rounded-md hover:bg-accent hover:text-accent-foreground">
                    <User size={18} />
                  </button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent className="text-xs px-2 py-1">
                <p>User profile & settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <SettingsPage />
        </Dialog>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onToggleRightSidebar}
                className="xl:hidden p-1.5 rounded-md hover:bg-accent hover:text-accent-foreground"
              >
                <MessageSquare size={18} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="text-xs px-2 py-1">
              <p>Toggle chat</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  )
}
