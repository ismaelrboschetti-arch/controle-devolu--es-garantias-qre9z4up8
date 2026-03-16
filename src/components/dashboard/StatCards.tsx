import { Card, CardContent } from '@/components/ui/card'
import { Wallet, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react'
import { useProcessStore } from '@/contexts/ProcessContext'

export function StatCards() {
  const { processes } = useProcessStore()

  const totalPendente = processes
    .filter((p) => p.status === 'Enviado ao Fornecedor' || p.status === 'Análise Crédito')
    .reduce((acc, curr) => acc + curr.value, 0)

  const emAtraso = processes.filter(
    (p) => p.slaDays > 60 && p.status !== 'Crédito Liberado' && p.status !== 'Finalizado',
  ).length

  const aguardandoAcao = processes.filter(
    (p) => p.status === 'Aguardando Autorização' || p.status === 'Produto Recebido',
  ).length

  const creditosLiberados = processes
    .filter((p) => p.status === 'Crédito Liberado')
    .reduce((acc, curr) => acc + curr.value, 0)

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

  const stats = [
    {
      title: 'Total Pendente (Fornecedores)',
      value: formatCurrency(totalPendente),
      icon: Wallet,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      title: 'Processos em Atraso (>60 dias)',
      value: emAtraso.toString(),
      icon: AlertTriangle,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
    },
    {
      title: 'Aguardando Minha Ação',
      value: aguardandoAcao.toString(),
      icon: Clock,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50',
    },
    {
      title: 'Créditos Liberados (Mês)',
      value: formatCurrency(creditosLiberados),
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${s.bg}`}>
              <s.icon className={`w-6 h-6 ${s.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{s.title}</p>
              <h3 className="text-2xl font-bold text-slate-800">{s.value}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
