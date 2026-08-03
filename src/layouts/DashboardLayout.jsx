import { useState } from 'react'
import { Outlet } from 'react-router'
import { DashboardSidebar } from '../components/layout/DashboardSidebar.jsx'
import { DashboardHeader } from '../components/layout/DashboardHeader.jsx'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from '../components/ui/sheet'

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border/50 bg-background lg:block">
        <DashboardSidebar />
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-64">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger className="hidden" />
        <SheetContent side="left" className="w-64 p-0">
          <SheetClose className="hidden" />
          <DashboardSidebar />
        </SheetContent>
      </Sheet>
    </div>
  )
}
