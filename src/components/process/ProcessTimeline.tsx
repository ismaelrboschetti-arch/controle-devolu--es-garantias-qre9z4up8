import { CheckCircle2, Circle, ShieldCheck } from 'lucide-react'
import { Process } from '@/lib/types'

export function ProcessTimeline({ process }: { process: Process }) {
  const isDevolucao = process.type === 'Devolução Comum'

  const devSteps = [
    'Pendente de Análise',
    'Autorizado emissão da nota fiscal',
    'Envio da Mercadoria Autorizado',
    'Produto Recebido',
    'Conferência de Estoque',
    process.status === 'Crédito Recusado' ? 'Crédito Recusado' : 'Crédito Liberado',
  ]

  const garSteps = [
    'Pendente de Análise',
    'Autorizado emissão da nota fiscal',
    'Envio da Mercadoria Autorizado',
    'Produto Recebido',
    'Enviado ao Fornecedor',
    'Aguardando Créditos',
  ]

  const steps = isDevolucao ? devSteps : garSteps

  let activeIndex = steps.indexOf(process.status)

  if (activeIndex === -1) {
    if (process.status === 'NF Recusada') activeIndex = 0
    if (process.status === 'Nota Fiscal em Análise') activeIndex = 1
    if (process.status === 'Finalizado') activeIndex = 5
    if (process.status === 'Crédito Antecipado') activeIndex = 4
    if (process.status === 'Crédito Liberado') activeIndex = 5
    if (process.status === 'Crédito Recusado') activeIndex = 5
  }
  if (activeIndex === -1) activeIndex = 0

  return (
    <div className="relative pl-2 pb-4">
      <div className="timeline-line"></div>

      <div className="space-y-8 relative z-10">
        {process.managerAuthorized && (
          <div className="flex gap-4 items-start group mb-8">
            <div className="mt-0.5 rounded-full bg-indigo-50 relative z-10 border border-indigo-100 p-0.5">
              <ShieldCheck className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-indigo-700">Exceção Autorizada</h4>
              <p className="text-xs text-slate-500 mt-1">
                Processo autorizado por {process.authorizedBy} em{' '}
                {new Date(process.authorizedAt!).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        )}

        {process.type === 'Garantia' && process.customerCreditReleased && (
          <div className="flex gap-4 items-start group mb-8">
            <div className="mt-0.5 rounded-full bg-emerald-50 relative z-10">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-emerald-700">
                {process.creditAnticipated
                  ? 'Crédito Antecipado ao Cliente'
                  : 'Crédito ao Cliente Liberado'}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {process.creditAnticipated
                  ? 'Crédito liberado comercialmente antes da conclusão logística.'
                  : 'Crédito disponibilizado ao cliente.'}
              </p>
              {process.creditDecisionReason && (
                <div className="mt-2 p-3 bg-emerald-50 border border-emerald-100 rounded-md text-sm text-slate-700 animate-fade-in-up">
                  <span className="font-semibold block mb-1 text-emerald-800">
                    Motivo da Liberação:
                  </span>
                  {process.creditDecisionReason}
                </div>
              )}
            </div>
          </div>
        )}

        {steps.map((step, index) => {
          const isCompleted =
            index < activeIndex ||
            process.status === 'Finalizado' ||
            (index === 5 &&
              (process.status === 'Crédito Liberado' || process.status === 'Crédito Recusado'))

          const isCurrent =
            index === activeIndex &&
            process.status !== 'Finalizado' &&
            process.status !== 'Crédito Liberado' &&
            process.status !== 'Crédito Recusado'

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
          if (
            (process.status === 'NF Recusada' && index === 0) ||
            (process.status === 'Crédito Recusado' && index === 5)
          ) {
            color = 'text-rose-500'
            bgColor = 'bg-rose-50'
          }

          let displayStep = step
          if (step === 'Pendente de Análise' && process.status === 'NF Recusada')
            displayStep = 'Análise Recusada'
          if (
            step === 'Autorizado emissão da nota fiscal' &&
            process.status === 'Nota Fiscal em Análise'
          )
            displayStep = 'Nota Fiscal em Análise'
          if (step === 'Produto Recebido') displayStep = 'Recebimento'

          const showReason =
            index === 5 &&
            process.creditDecisionReason &&
            (process.status === 'Crédito Liberado' || process.status === 'Crédito Recusado') &&
            process.type !== 'Garantia' // For Garantia, the reason is displayed in the special injected node above

          return (
            <div key={`${step}-${index}`} className="flex gap-4 items-start group">
              <div className={`mt-0.5 rounded-full ${bgColor} relative z-10`}>
                {isCompleted || (index === 5 && process.status === 'Crédito Recusado') ? (
                  process.status === 'Crédito Recusado' && index === 5 ? (
                    <CheckCircle2 className="w-6 h-6 text-rose-500" />
                  ) : (
                    <CheckCircle2 className={`w-6 h-6 ${color}`} />
                  )
                ) : (
                  <Circle className={`w-6 h-6 ${color} ${isCurrent ? 'fill-blue-100' : ''}`} />
                )}
              </div>
              <div className="flex-1">
                <h4
                  className={`font-semibold text-sm ${isCurrent || isCompleted ? 'text-slate-900' : 'text-slate-500'} ${process.status === 'Crédito Recusado' && index === 5 ? 'text-rose-700' : ''}`}
                >
                  {displayStep}
                </h4>
                {isCurrent && (
                  <p className="text-xs text-slate-500 mt-1">
                    {process.status === 'Autorizado emissão da nota fiscal'
                      ? 'Aguardando cliente anexar NF'
                      : process.status === 'Conferência de Estoque'
                        ? 'Aguardando conferência e decisão de crédito'
                        : process.status === 'Aguardando Créditos'
                          ? 'Acompanhamento de créditos com fornecedor e cliente'
                          : 'Aguardando ação da equipe'}
                  </p>
                )}
                {showReason && (
                  <div className="mt-2 p-3 bg-slate-50 border border-slate-100 rounded-md text-sm text-slate-700 animate-fade-in-up">
                    <span className="font-semibold block mb-1">Motivo da Decisão:</span>
                    {process.creditDecisionReason}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
