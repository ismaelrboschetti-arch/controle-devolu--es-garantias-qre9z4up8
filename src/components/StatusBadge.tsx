import { Badge } from '@/components/ui/badge'
import { ProcessStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

export function StatusBadge({ status, className }: { status: ProcessStatus; className?: string }) {
  let colorClass = 'bg-slate-100 text-slate-700 hover:bg-slate-200'

  switch (status) {
    case 'Pendente de Análise':
      colorClass = 'bg-blue-100 text-blue-700 hover:bg-blue-200'
      break
    case 'NF Recusada':
    case 'Crédito Recusado':
      colorClass = 'bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-200'
      break
    case 'Autorizado emissão da nota fiscal':
      colorClass = 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200 border border-cyan-200'
      break
    case 'Nota Fiscal em Análise':
      colorClass = 'bg-purple-100 text-purple-700 hover:bg-purple-200'
      break
    case 'Envio da Mercadoria Autorizado':
      colorClass = 'bg-teal-100 text-teal-700 hover:bg-teal-200'
      break
    case 'Conferência de Estoque':
      colorClass = 'bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-200'
      break
    case 'Aguardando Créditos':
      colorClass = 'bg-sky-100 text-sky-700 hover:bg-sky-200 border border-sky-200'
      break
    case 'Produto Recebido':
    case 'Enviado ao Fornecedor':
      colorClass = 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
      break
    case 'Crédito Antecipado':
      colorClass = 'bg-orange-100 text-orange-700 hover:bg-orange-200 border border-orange-300'
      break
    case 'Crédito Liberado':
    case 'Finalizado':
      colorClass = 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
      break
  }

  return (
    <Badge className={cn('font-medium border-transparent shadow-none', colorClass, className)}>
      {status}
    </Badge>
  )
}
