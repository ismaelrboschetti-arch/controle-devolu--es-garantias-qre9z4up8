import { Button } from '@/components/ui/button'
import { Process } from '@/lib/types'
import { useProcessStore } from '@/contexts/ProcessContext'
import { toast } from 'sonner'
import { Check, X, Truck, Wallet } from 'lucide-react'

export function ActionPanel({ process }: { process: Process }) {
  const { role, updateStatus } = useProcessStore()

  const handleAction = (newStatus: Process['status'], message: string) => {
    updateStatus(process.id, newStatus)
    toast.success(message)

    const contactInfo = [process.customerEmail, process.customerPhone].filter(Boolean).join(' e ')
    const target = contactInfo ? `para ${contactInfo}` : 'ao cliente via Email/WhatsApp'

    setTimeout(() => {
      toast(`Notificação de atualização enviada ${target}`, { icon: '📱' })
    }, 1500)
  }

  if (role !== 'Admin') {
    return (
      <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-500 text-center border border-slate-100">
        Visualização restrita. Apenas a equipe interna pode avançar etapas.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {process.status === 'Aguardando Autorização' && (
        <div className="flex gap-2">
          <Button
            onClick={() =>
              handleAction('Produto Recebido', 'NF Autorizada. Aguardando envio físico.')
            }
            className="bg-emerald-600 hover:bg-emerald-700 flex-1"
          >
            <Check className="w-4 h-4 mr-2" /> Autorizar NF
          </Button>
          <Button
            onClick={() => handleAction('NF Recusada', 'NF Recusada.')}
            variant="destructive"
            className="flex-1"
          >
            <X className="w-4 h-4 mr-2" /> Recusar
          </Button>
        </div>
      )}

      {process.status === 'Produto Recebido' && process.type === 'Devolução Comum' && (
        <Button
          onClick={() => handleAction('Crédito Liberado', 'Crédito Liberado ao Cliente!')}
          className="w-full bg-brand-blue hover:bg-blue-600"
        >
          <Wallet className="w-4 h-4 mr-2" /> Confirmar e Liberar Crédito
        </Button>
      )}

      {process.status === 'Produto Recebido' && process.type === 'Garantia' && (
        <Button
          onClick={() =>
            handleAction('Enviado ao Fornecedor', 'Produto marcado como enviado ao fornecedor.')
          }
          className="w-full bg-indigo-600 hover:bg-indigo-700"
        >
          <Truck className="w-4 h-4 mr-2" /> Informar Envio ao Fornecedor
        </Button>
      )}

      {(process.status === 'Enviado ao Fornecedor' ||
        process.status === 'Análise Crédito' ||
        process.status === 'Crédito Antecipado') && (
        <Button
          onClick={() =>
            handleAction('Crédito Liberado', 'Crédito Liberado após retorno do fornecedor!')
          }
          className="w-full bg-emerald-600 hover:bg-emerald-700"
        >
          <Wallet className="w-4 h-4 mr-2" /> Confirmar Crédito do Fornecedor
        </Button>
      )}

      {process.status === 'Crédito Liberado' && (
        <Button
          onClick={() => handleAction('Finalizado', 'Processo finalizado e arquivado.')}
          variant="outline"
          className="w-full"
        >
          <Check className="w-4 h-4 mr-2" /> Arquivar / Finalizar
        </Button>
      )}

      {process.status === 'Finalizado' && (
        <div className="text-center text-sm font-medium text-emerald-600 py-2">
          Processo Concluído
        </div>
      )}
    </div>
  )
}
