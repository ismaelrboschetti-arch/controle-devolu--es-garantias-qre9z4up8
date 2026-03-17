import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Process, ProcessStatus } from '@/lib/types'
import { useProcessStore } from '@/contexts/ProcessContext'
import { toast } from 'sonner'
import { Check, X, Truck, Wallet, Package, ClipboardCheck, ArrowRight } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export function ActionPanel({ process }: { process: Process }) {
  const { role, updateStatus, updateProcess } = useProcessStore()
  const [isReasonOpen, setIsReasonOpen] = useState(false)
  const [reasonType, setReasonType] = useState<'approve' | 'refuse'>('approve')
  const [reasonText, setReasonText] = useState('')

  const handleAction = (newStatus: ProcessStatus, message: string) => {
    updateStatus(process.id, newStatus)
    toast.success(message)

    const contactInfo = [process.customerEmail, process.customerPhone].filter(Boolean).join(' e ')
    const target = contactInfo ? `para ${contactInfo}` : 'ao cliente via Email/WhatsApp'

    setTimeout(() => toast(`Notificação de atualização enviada ${target}`, { icon: '📱' }), 1500)
  }

  const openReasonDialog = (type: 'approve' | 'refuse') => {
    setReasonType(type)
    setReasonText('')
    setIsReasonOpen(true)
  }

  const handleReasonSubmit = () => {
    const newStatus = reasonType === 'approve' ? 'Crédito Liberado' : 'Crédito Recusado'
    updateProcess(process.id, { status: newStatus, creditDecisionReason: reasonText })
    setIsReasonOpen(false)
    setReasonText('')
    toast.success(`Crédito ${reasonType === 'approve' ? 'liberado' : 'recusado'} com sucesso.`)
  }

  if (role !== 'Admin') {
    return (
      <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-500 text-center border border-slate-100">
        Visualização restrita. Apenas a equipe interna pode avançar etapas.
      </div>
    )
  }

  return (
    <>
      <Dialog open={isReasonOpen} onOpenChange={setIsReasonOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Motivo da Decisão</DialogTitle>
            <DialogDescription>
              Forneça uma justificativa obrigatória para o histórico do processo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>
                Descreva o motivo da {reasonType === 'approve' ? 'aprovação' : 'recusa'}
              </Label>
              <Textarea
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                placeholder="Digite o motivo detalhado..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReasonOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={!reasonText.trim()}
              onClick={handleReasonSubmit}
              className={
                reasonType === 'approve'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
            >
              Confirmar {reasonType === 'approve' ? 'Liberação' : 'Recusa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-3">
        {process.status === 'Pendente de Análise' && (
          <div className="flex gap-2">
            <Button
              onClick={() =>
                handleAction(
                  'Autorizado emissão da nota fiscal',
                  'Emissão da Nota Fiscal de Devolução autorizada.',
                )
              }
              className="bg-brand-blue hover:bg-blue-600 flex-1"
            >
              <Check className="w-4 h-4 mr-2" /> Autorizar NF
            </Button>
            <Button
              onClick={() => handleAction('NF Recusada', 'Solicitação Recusada.')}
              variant="destructive"
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" /> Recusar
            </Button>
          </div>
        )}

        {process.status === 'Nota Fiscal em Análise' && (
          <Button
            onClick={() =>
              handleAction(
                'Envio da Mercadoria Autorizado',
                'Nota Fiscal aprovada. Envio autorizado.',
              )
            }
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            <Check className="w-4 h-4 mr-2" /> Aprovar Nota Fiscal e Autorizar Envio
          </Button>
        )}

        {process.status === 'Envio da Mercadoria Autorizado' && (
          <Button
            onClick={() => handleAction('Produto Recebido', 'Produto recebido fisicamente.')}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            <Package className="w-4 h-4 mr-2" /> Confirmar Recebimento do Produto
          </Button>
        )}

        {process.status === 'Produto Recebido' &&
          (process.type === 'Devolução Comum' ? (
            <Button
              onClick={() =>
                handleAction(
                  'Conferência de Estoque',
                  'Processo enviado para conferência de estoque.',
                )
              }
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              <ClipboardCheck className="w-4 h-4 mr-2" /> Iniciar Conferência de Estoque
            </Button>
          ) : (
            <Button
              onClick={() =>
                handleAction('Enviado ao Fornecedor', 'Produto marcado como enviado ao fornecedor.')
              }
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              <Truck className="w-4 h-4 mr-2" /> Confirmar envio ao Fornecedor
            </Button>
          ))}

        {process.status === 'Conferência de Estoque' && (
          <div className="flex gap-2">
            <Button
              onClick={() => openReasonDialog('approve')}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              <Wallet className="w-4 h-4 mr-2" /> Liberar Crédito
            </Button>
            <Button
              onClick={() => openReasonDialog('refuse')}
              variant="destructive"
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" /> Recusar Crédito
            </Button>
          </div>
        )}

        {process.status === 'Enviado ao Fornecedor' && (
          <Button
            onClick={() =>
              handleAction('Aguardando Créditos', 'Acompanhamento de créditos iniciado.')
            }
            className="w-full bg-sky-600 hover:bg-sky-700"
          >
            <ArrowRight className="w-4 h-4 mr-2" /> Iniciar Acompanhamento de Créditos
          </Button>
        )}

        {process.status === 'Aguardando Créditos' &&
          (process.customerCreditReleased ? (
            <Button
              onClick={() =>
                handleAction('Finalizado', 'Processo finalizado com crédito ao cliente!')
              }
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              <Check className="w-4 h-4 mr-2" /> Arquivar / Finalizar Processo
            </Button>
          ) : (
            <div className="p-3 bg-sky-50 text-sky-800 text-sm text-center rounded-md border border-sky-100">
              Utilize o painel acima para registrar a liberação do crédito ao cliente e habilitar a
              finalização.
            </div>
          ))}

        {(process.status === 'Crédito Liberado' || process.status === 'Crédito Recusado') && (
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
    </>
  )
}
