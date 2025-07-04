"use client"
import type React from "react"
import { useState } from "react"
import { ChevronRight, Edit, Copy, Play, Check } from "lucide-react"
import { queryHistory } from "@/lib/data"

// A smaller, more compact SQL syntax highlighter for the history popover
const MiniSQLSyntaxHighlight = ({ code }: { code: string }) => {
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
      className="p-3 text-xs whitespace-pre-wrap break-all font-medium rounded-md bg-[rgba(17,17,17,0.7711859292577924)]"
      dangerouslySetInnerHTML={{ __html: highlight(code) }}
    />
  )
}

type HistoryItem = (typeof queryHistory)[0]

const QueryHistoryItem = ({
  item,
  onSendMessage,
}: {
  item: HistoryItem
  onSendMessage: (message: string, mode: "ask" | "action", model: string) => void
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent toggle when clicking copy
    navigator.clipboard.writeText(item.sql).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }

  const handleRerun = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSendMessage(item.prompt, item.mode as "ask" | "action", item.model)
  }

  return (
    <div className="border-b text-sm last:border-b-0">
      <div className="flex items-center p-2 cursor-pointer hover:bg-accent" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-2 text-left flex-grow truncate">
          <ChevronRight
            size={14}
            className={`transform transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-90" : ""}`}
          />
          <div className="truncate">
            <p className="font-medium text-xs truncate">{item.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {new Date(item.timestamp).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-0.5 ml-2 flex-shrink-0">
          <button
            onClick={(e) => e.stopPropagation()}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-background/50"
            title="Edit in chat"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-background/50"
            title="Copy SQL"
          >
            {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
          <button
            onClick={handleRerun}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-background/50"
            title="Rerun prompt"
          >
            <Play size={14} />
          </button>
        </div>
      </div>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96" : "max-h-0"}`}>
        <div className="p-2">
          <MiniSQLSyntaxHighlight code={item.sql} />
        </div>
      </div>
    </div>
  )
}

// This component is now designed to be used inside a Popover
export function QueryHistory({
  onSendMessage,
}: {
  onSendMessage: (message: string, mode: "ask" | "action", model: string) => void
}) {
  return (
    <>
      <div className="flex items-center justify-between p-3 border-b">
        <h2 className="font-semibold text-sm">Query History</h2>
      </div>
      <div className="max-h-[60vh] overflow-y-auto">
        {queryHistory.map((item) => (
          <QueryHistoryItem key={item.id} item={item} onSendMessage={onSendMessage} />
        ))}
      </div>
    </>
  )
}
