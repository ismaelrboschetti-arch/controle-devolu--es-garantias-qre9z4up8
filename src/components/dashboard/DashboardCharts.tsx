import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { useProcessStore } from '@/contexts/ProcessContext'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'

export function DashboardCharts() {
  const { processes } = useProcessStore()

  // Aggregate data for Ranking
  const customerData = processes
    .reduce((acc: any, curr) => {
      const existing = acc.find((item: any) => item.name === curr.customer)
      if (existing) {
        existing.value += 1
      } else {
        acc.push({ name: curr.customer, value: 1 })
      }
      return acc
    }, [])
    .sort((a: any, b: any) => b.value - a.value)
    .slice(0, 5)

  // Aggregate data for Suppliers
  const supplierData = processes
    .filter((p) => p.status === 'Análise Crédito' || p.status === 'Enviado ao Fornecedor')
    .reduce((acc: any, curr) => {
      const existing = acc.find((item: any) => item.name === curr.supplier)
      if (existing) {
        existing.value += curr.value
      } else {
        acc.push({ name: curr.supplier, value: curr.value })
      }
      return acc
    }, [])

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#E11D48', '#8B5CF6']

  const barConfig = {
    value: { label: 'Devoluções', color: 'hsl(var(--chart-1))' },
  }

  const pieConfig = {
    value: { label: 'Valor R$' },
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-slate-800">Ranking de Devolução (Top 5)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={barConfig} className="h-[300px]">
            <BarChart data={customerData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: 'transparent' }} content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-slate-800">Pendências por Fornecedor (R$)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={pieConfig} className="h-[300px]">
            <PieChart>
              <Pie
                data={supplierData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {supplierData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
