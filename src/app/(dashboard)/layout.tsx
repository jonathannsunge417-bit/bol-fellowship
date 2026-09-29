import DashboardSidebar from '@/components/layout/DashboardSidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar />
      <main className="flex-1 overflow-auto p-4 pt-16 md:p-8 md:pt-8">
        {children}
      </main>
    </div>
  )
}
