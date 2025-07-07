import { tableData, tableHeaders } from "@/lib/data"
import { ArrowUpDown, Filter, Download, MoreHorizontal } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

const getCellClass = (value: any) => {
  if (value === null) return "bg-null-bg text-null-fg"
  if (typeof value === "string") {
    if (value === "invalid_email") return "bg-invalid-bg text-invalid-fg"
    if (value === "invalid_date") return "bg-[hsl(var(--invalid-date-bg))] text-[hsl(var(--invalid-date-fg))]"
  }
  return ""
}

export function DataTable() {
  return (
    <TooltipProvider>
      <div className="flex-grow flex flex-col bg-background">
        <div className="flex items-center justify-between p-2 border-b">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show:</span>
            <select className="px-2 py-1 text-sm bg-secondary rounded-md focus:outline-none focus:ring-1 focus:ring-ring">
              <option>20</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1.5 rounded-md hover:bg-accent hover:text-accent-foreground">
                  <MoreHorizontal size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent className="text-xs px-2 py-1">
                <p>More options</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1.5 rounded-md hover:bg-accent hover:text-accent-foreground">
                  <Filter size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent className="text-xs px-2 py-1">
                <p>Filter table</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1.5 rounded-md hover:bg-accent hover:text-accent-foreground">
                  <Download size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent className="text-xs px-2 py-1">
                <p>Download data</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div className="flex-grow overflow-auto">
          <table className="w-full text-sm text-left">
            <thead className="sticky top-0 bg-card z-10">
              <tr>
                <th className="p-2 border-b w-10">
                  <input type="checkbox" className="bg-transparent rounded border-muted-foreground" />
                </th>
                {tableHeaders.map((header) => (
                  <th key={header.key} className="p-2 border-b font-medium text-muted-foreground whitespace-nowrap">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 cursor-pointer">
                          {header.label}
                          <ArrowUpDown size={12} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="text-xs px-2 py-1">
                        <p>Sort by {header.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.id} className="hover:bg-row-hover">
                  <td className="p-2 border-b">
                    <input type="checkbox" className="bg-transparent rounded border-muted-foreground" />
                  </td>
                  {tableHeaders.map((header) => (
                    <td
                      key={`${header.key}-${row.id}`}
                      className={`p-2 border-b whitespace-nowrap ${getCellClass(row[header.key as keyof typeof row])}`}
                    >
                      {row[header.key as keyof typeof row] === null
                        ? "null"
                        : String(row[header.key as keyof typeof row])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between p-2 border-t text-sm text-muted-foreground">
          <span>Showing 1-20 of 20 rows</span>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="px-3 py-1 bg-secondary rounded-md hover:bg-accent disabled:opacity-50" disabled>
                  Previous
                </button>
              </TooltipTrigger>
              <TooltipContent className="text-xs px-2 py-1">
                <p>Previous page</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="px-3 py-1 bg-secondary rounded-md hover:bg-accent">Next</button>
              </TooltipTrigger>
              <TooltipContent className="text-xs px-2 py-1">
                <p>Next page</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
