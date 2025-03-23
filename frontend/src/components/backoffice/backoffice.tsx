import type { ReactNode } from "react"

interface BackofficeLayoutProps {
  children: ReactNode
}

export function BackofficeLayout({ children }: BackofficeLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">Parlatz - Backoffice</h1>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="relative hidden md:flex">
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">{children}</main>
    </div>
  )
}

