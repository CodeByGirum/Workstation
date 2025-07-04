"use client"

import { ActionsToolbar } from "./actions-toolbar"
import { DataTable } from "./data-table"

export function MainPanel() {
  return (
    <main className="flex-grow flex flex-col overflow-hidden">
      <ActionsToolbar />
      <DataTable />
    </main>
  )
}
