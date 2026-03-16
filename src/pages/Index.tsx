import { StatCards } from '@/components/dashboard/StatCards'
import { DashboardCharts } from '@/components/dashboard/DashboardCharts'
import { OverdueTable } from '@/components/dashboard/OverdueTable'

export default function Index() {
  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Visão geral financeira e operacional de devoluções e garantias.
        </p>
      </div>

      <StatCards />
      <DashboardCharts />
      <OverdueTable />
    </div>
  )
}
