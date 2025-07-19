import type React from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

function SettingsHeader() {
  return (
    <header className="flex items-center h-14 px-4 border-b bg-card text-card-foreground flex-shrink-0 sticky top-0 z-10">
      <Button variant="ghost" asChild>
        <Link href="/">
          <ChevronLeft size={18} className="mr-2" />
          Back to Workstation
        </Link>
      </Button>
    </header>
  )
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground font-sans">
      <SettingsHeader />
      <main className="flex-grow overflow-y-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
