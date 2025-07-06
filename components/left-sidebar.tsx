"use client"
import { useState } from "react"
import type React from "react"

import { Search, ChevronRight, ChevronLeft, X } from "lucide-react"
import { schema, datasets } from "@/lib/data"

const CollapsibleSection = ({
  title,
  children,
  defaultOpen = false,
  icon,
}: {
  title: string | React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
  icon?: React.ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 text-sm font-medium text-left text-muted-foreground hover:text-foreground"
      >
        <span className="flex items-center gap-2">
          {icon}
          {title}
        </span>
        <ChevronRight
          size={16}
          className={`transform transition-transform duration-200 ease-in-out ${isOpen ? "rotate-90" : "rotate-0"}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="pl-2 pt-1">{children}</div>
      </div>
    </div>
  )
}

type LeftSidebarProps = {
  isCollapsed: boolean
  onToggleCollapse?: () => void
  onClose?: () => void
  style?: React.CSSProperties
}

export function LeftSidebar({ isCollapsed, onToggleCollapse, onClose, style }: LeftSidebarProps) {
  return (
    <aside
      style={style}
      className={`bg-card text-card-foreground flex flex-col flex-shrink-0 transition-all duration-300 ease-in-out h-full`}
    >
      {/* Header Section */}
      <div className="flex items-start justify-between p-4 border-b">
        <div className="flex-1 min-w-0">
          {!isCollapsed && (
            <div className="truncate">
              <h3 className="font-semibold text-md">Schema Browser</h3>
              <p className="text-xs text-muted-foreground mt-1">Showing contents of the current table.</p>
            </div>
          )}
        </div>
        <div className="flex items-center flex-shrink-0 pl-2">
          {onToggleCollapse && !isCollapsed && (
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-md hover:bg-accent hidden lg:block"
              title="Collapse sidebar"
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-1.5 rounded-md hover:bg-accent" title="Close sidebar">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <div className={`p-4 flex-grow overflow-y-auto`}>
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search schema..."
              className="w-full pl-8 pr-2 py-1.5 text-sm bg-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Schema Content */}
          <div className="space-y-2">
            {Object.entries(schema).map(([tableName, tableDetails]) => (
              <CollapsibleSection key={tableName} title={tableName} icon={<tableDetails.icon size={16} />} defaultOpen>
                <ul className="space-y-1 mt-1 border-l border-border/50 ml-[11px] pl-4">
                  {tableDetails.columns.map((col) => (
                    <li key={col.name} className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <col.icon size={14} />
                        {col.name}
                      </span>
                      <span className="text-xs">{col.type}</span>
                    </li>
                  ))}
                </ul>
              </CollapsibleSection>
            ))}
          </div>

          <div className="my-4 border-t border-border/50" />

          {/* Datasets Section */}
          <CollapsibleSection title="Datasets" defaultOpen>
            <div className="mt-1 space-y-1">
              {datasets.map((dataset) => (
                <a
                  key={dataset.name}
                  href="#"
                  title={dataset.name}
                  className="flex items-center w-full gap-2 px-2 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  <dataset.icon size={16} />
                  <span className="truncate">{dataset.name}</span>
                </a>
              ))}
            </div>
          </CollapsibleSection>
        </div>
      )}
    </aside>
  )
}
