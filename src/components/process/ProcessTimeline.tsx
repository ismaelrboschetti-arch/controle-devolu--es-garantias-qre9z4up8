import { CheckCircle2, Circle } from 'lucide-react'
import { ProcessStatus } from '@/lib/types'

const steps = [
  'Pendente de Análise',
  'Produto Recebido',
  'Enviado ao Fornecedor',
  'Análise Crédito',
  'Crédito Liberado',
]

export function ProcessTimeline({ currentStatus }: { currentStatus: ProcessStatus }) {
  // Map complex statuses to timeline stages
  let activeIndex = steps.indexOf(currentStatus as string)
  if (currentStatus === 'NF Recusada') activeIndex = 0
  if (currentStatus === 'Crédito Antecipado') activeIndex = 3
  if (currentStatus === 'Finalizado') activeIndex = 4
  if (activeIndex === -1) activeIndex = 0

  return (
    <div className="relative pl-2 pb-4">
      <div className="timeline-line"></div>

      <div className="space-y-8 relative z-10">
        {steps.map((step, index) => {
          const isCompleted =
            index < activeIndex ||
            currentStatus === 'Finalizado' ||
            (index === 4 && currentStatus === 'Crédito Liberado')
          const isCurrent =
            index === activeIndex &&
            currentStatus !== 'Finalizado' &&
            currentStatus !== 'Crédito Liberado'

          let color = 'text-slate-300'
          let bgColor = 'bg-white'
          if (isCompleted) {
            color = 'text-emerald-500'
            bgColor = 'bg-emerald-50'
          }
          if (isCurrent) {
            color = 'text-brand-blue'
            bgColor = 'bg-blue-50'
          }
          if (currentStatus === 'NF Recusada' && index === 0) {
            color = 'text-rose-500'
            bgColor = 'bg-rose-50'
          }

          return (
            <div key={step} className="flex gap-4 items-start group">
              <div className={`mt-0.5 rounded-full ${bgColor}`}>
                {isCompleted ? (
                  <CheckCircle2 className={`w-6 h-6 ${color}`} />
                ) : (
                  <Circle className={`w-6 h-6 ${color} ${isCurrent ? 'fill-blue-100' : ''}`} />
                )}
              </div>
              <div>
                <h4
                  className={`font-semibold text-sm ${isCurrent || isCompleted ? 'text-slate-900' : 'text-slate-500'}`}
                >
                  {step === 'Pendente de Análise' && currentStatus === 'NF Recusada'
                    ? 'Análise Recusada'
                    : step}
                </h4>
                {isCurrent && (
                  <p className="text-xs text-slate-500 mt-1">Aguardando ação da equipe</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
