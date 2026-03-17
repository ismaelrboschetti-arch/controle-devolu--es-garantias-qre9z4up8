import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Process, ProcessStatus } from '@/lib/types'
import { useProcessStore } from '@/contexts/ProcessContext'
import { toast } from 'sonner'
import {
  Check,
  X,
  Truck,
  Wallet,
  Package,
  ClipboardCheck,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react'
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

export function ActionPanel({
  process,
  needsAuthorization,
}: {
  process: Process
  needsAuthorization?: boolean
}) {
  const { role, updateStatus, updateProcess } = useProcessStore()
  const [isReasonOpen, setIsReasonOpen] = useState(false)
  const [reasonType, setReasonType] = useState<'approve' | 'refuse' | 'anticipate'>('approve')
  const [reasonText, setReasonText] = useState('')

  const handleAction = (newStatus: ProcessStatus, message: string) => {
    updateStatus(process.id, newStatus)
    toast.success(message)
    const target = process.customerEmail || process.customerPhone ? `para o cliente` : 'via Email'
    setTimeout(() => toast(`Notificação enviada ${target}`, { icon: '📱' }), 1500)
  }

  const openReasonDialog = (type: 'approve' | 'refuse' | 'anticipate') => {
    setReasonType(type)
    setReasonText('')
    setIsReasonOpen(true)
  }

  const handleReasonSubmit = () => {
    if (reasonType === 'anticipate') {
      const isEarly = process.status !== 'Aguardando Créditos'
      updateProcess(process.id, {
        customerCreditReleased: true,
        creditAnticipated: isEarly,
        creditDecisionReason: reasonText,
      })
      setIsReasonOpen(false)
      setReasonText('')
      toast.success(isEarly ? 'Crédito antecipado com sucesso.' : 'Crédito liberado com sucesso.')
      return
    }

    const newStatus = reasonType === 'approve' ? 'Crédito Liberado' : 'Crédito Recusado'
    updateProcess(process.id, { status: newStatus, creditDecisionReason: reasonText })
    setIsReasonOpen(false)
    setReasonText('')
    toast.success(`Crédito ${reasonType === 'approve' ? 'liberado' : 'recusado'} com sucesso.`)
  }

  const handleAuthorizeProcess = () => {
    let authorizerName = role
    if (role === 'Gerente') authorizerName = 'Jonathan'
    if (role === 'Diretor') authorizerName = 'Ismael'
    if (role === 'Admin') authorizerName = 'Administrador'

    updateProcess(process.id, {
      managerAuthorized: true,
      authorizedBy: authorizerName,
      authorizedAt: new Date().toISOString(),
    })
    toast.success('Processo autorizado com sucesso.')
  }

  const isInternal = ['Admin', 'Coordenador', 'Gerente', 'Diretor'].includes(role)
  const canAuthorize = ['Gerente', 'Diretor', 'Admin'].includes(role)

  if (!isInternal) {
    return (
      <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-500 text-center border border-slate-100">
        Visualização restrita. Apenas a equipe interna pode avançar etapas.
      </div>
    )
  }

  if (needsAuthorization) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="p-4 bg-rose-50 rounded-lg text-sm text-rose-700 text-center border border-rose-100 flex flex-col items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-rose-500" />
          <p>
            As ações logísticas e financeiras estão bloqueadas devido ao vencimento do prazo da
            solicitação.
          </p>
        </div>
        {canAuthorize ? (
          <Button
            onClick={handleAuthorizeProcess}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
          >
            <Check className="w-4 h-4 mr-2" /> Autorizar Processo (Gerência/Direção)
          </Button>
        ) : (
          <div className="text-center text-xs text-slate-500 pt-2">
            Apenas Gerente ou Diretor podem autorizar o prosseguimento.
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <Dialog open={isReasonOpen} onOpenChange={setIsReasonOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reasonType === 'anticipate' ? 'Liberação de Crédito' : 'Motivo da Decisão'}
            </DialogTitle>
            <DialogDescription>
              Forneça uma justificativa para o histórico do processo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>
                Descreva o motivo da{' '}
                {reasonType === 'approve'
                  ? 'aprovação'
                  : reasonType === 'refuse'
                    ? 'recusa'
                    : 'liberação'}
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
                reasonType === 'approve' || reasonType === 'anticipate'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }
            >
              Confirmar{' '}
              {reasonType === 'approve'
                ? 'Liberação'
                : reasonType === 'anticipate'
                  ? 'Liberação'
                  : 'Recusa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-3 animate-fade-in">
        {process.type === 'Garantia' &&
          !process.customerCreditReleased &&
          !['Finalizado', 'Crédito Recusado'].includes(process.status) && (
            <div className="mb-4 p-4 bg-emerald-50/50 border border-emerald-100 rounded-lg">
              <h4 className="font-semibold text-sm text-emerald-900 mb-1 flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                {process.status !== 'Aguardando Créditos'
                  ? 'Liberação Antecipada'
                  : 'Liberar Crédito'}
              </h4>
              <p className="text-xs text-emerald-700 mb-3 leading-relaxed">
                {process.status !== 'Aguardando Créditos'
                  ? 'Permite liberar o crédito ao cliente imediatamente, independente das etapas logísticas do processo.'
                  : 'O processo chegou na etapa final. Libere o crédito ao cliente para prosseguir com a finalização.'}
              </p>
              <Button
                onClick={() => openReasonDialog('anticipate')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {process.status !== 'Aguardando Créditos'
                  ? 'Antecipar Crédito ao Cliente'
                  : 'Liberar Crédito ao Cliente'}
              </Button>
            </div>
          )}

        {process.type === 'Garantia' && process.customerCreditReleased && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-100 rounded-lg flex gap-3 items-start">
            <Check className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-semibold text-sm text-emerald-900">
                {process.creditAnticipated
                  ? 'Crédito Antecipado Liberado'
                  : 'Crédito ao Cliente Liberado'}
              </h4>
              <p className="text-xs text-emerald-700 mt-1">
                O crédito deste processo já foi disponibilizado ao cliente.
              </p>
            </div>
          </div>
        )}

        {process.status === 'Pendente de Análise' && (
          <div className="flex gap-2">
            <Button
              onClick={() =>
                handleAction('Autorizado emissão da nota fiscal', 'Emissão autorizada.')
              }
              className="bg-brand-blue hover:bg-blue-600 text-white flex-1"
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
            onClick={() => handleAction('Envio da Mercadoria Autorizado', 'Nota aprovada.')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Check className="w-4 h-4 mr-2" /> Aprovar e Autorizar Envio
          </Button>
        )}

        {process.status === 'Envio da Mercadoria Autorizado' && (
          <Button
            onClick={() => handleAction('Produto Recebido', 'Produto recebido.')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <Package className="w-4 h-4 mr-2" /> Confirmar Recebimento
          </Button>
        )}

        {process.status === 'Produto Recebido' &&
          (process.type === 'Devolução Comum' ? (
            <Button
              onClick={() => handleAction('Conferência de Estoque', 'Em conferência.')}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              <ClipboardCheck className="w-4 h-4 mr-2" /> Conferência de Estoque
            </Button>
          ) : (
            <Button
              onClick={() => handleAction('Enviado ao Fornecedor', 'Enviado ao fornecedor.')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Truck className="w-4 h-4 mr-2" /> Confirmar envio ao Fornecedor
            </Button>
          ))}

        {process.status === 'Conferência de Estoque' && (
          <div className="flex gap-2">
            <Button
              onClick={() => openReasonDialog('approve')}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
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
            onClick={() => handleAction('Aguardando Créditos', 'Acompanhamento iniciado.')}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white"
          >
            <ArrowRight className="w-4 h-4 mr-2" /> Acompanhamento de Créditos
          </Button>
        )}

        {process.status === 'Aguardando Créditos' && process.customerCreditReleased && (
          <Button
            onClick={() => handleAction('Finalizado', 'Processo finalizado!')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Check className="w-4 h-4 mr-2" /> Arquivar / Finalizar Processo
          </Button>
        )}

        {(process.status === 'Crédito Liberado' || process.status === 'Crédito Recusado') && (
          <Button
            onClick={() => handleAction('Finalizado', 'Processo finalizado.')}
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
