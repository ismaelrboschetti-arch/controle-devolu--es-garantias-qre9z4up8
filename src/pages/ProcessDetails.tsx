import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  AlertTriangle,
  CalendarDays,
  User,
  Package,
  Receipt,
  FileImage,
  FileText,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useProcessStore } from '@/contexts/ProcessContext'
import { StatusBadge } from '@/components/StatusBadge'
import { ProcessTimeline } from '@/components/process/ProcessTimeline'
import { ActionPanel } from '@/components/process/ActionPanel'
import { InvoiceUploadPanel } from '@/components/process/InvoiceUploadPanel'

export default function ProcessDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { processes } = useProcessStore()
  const process = processes.find((p) => p.id === id)

  if (!process) {
    return (
      <div className="text-center py-20 animate-fade-in">
        Processo não encontrado.{' '}
        <Button variant="link" onClick={() => navigate('/processos')}>
          Voltar
        </Button>
      </div>
    )
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
  const isOverdue =
    process.slaDays > 60 && process.status !== 'Crédito Liberado' && process.status !== 'Finalizado'

  return (
    <div className="flex flex-col gap-6 animate-slide-up pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/processos')}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex flex-wrap items-center gap-3">
              {process.id}
              <StatusBadge status={process.status} className="text-sm" />
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {process.type} • Iniciado em {process.requestDate}
            </p>
          </div>
        </div>
      </div>

      {isOverdue && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-amber-900">Prazo Legal Excedido (60 dias)</h4>
            <p className="text-sm text-amber-700 mt-1">
              Este processo de garantia excedeu o limite do CDC. O crédito antecipado ao cliente é
              recomendado.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg">Dados da Solicitação</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <User className="w-3 h-3" /> Cliente
                  </p>
                  <p className="font-semibold text-slate-800">{process.customer}</p>
                  {(process.customerEmail || process.customerPhone) && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {process.customerEmail}{' '}
                      {process.customerPhone && `• ${process.customerPhone}`}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <Package className="w-3 h-3" /> Fornecedor
                  </p>
                  <p className="font-semibold text-slate-800">{process.supplier}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <Receipt className="w-3 h-3" /> Produto / SKU
                  </p>
                  <p className="font-semibold text-slate-800">
                    {process.product}{' '}
                    <span className="text-slate-400 font-normal">({process.sku})</span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500">Valor Reivindicado</p>
                  <p className="font-bold text-brand-blue text-lg">
                    {formatCurrency(process.value)}
                  </p>
                </div>

                {process.purchaseDate && (
                  <div className="space-y-1 col-span-2 pt-4 border-t">
                    <p className="text-xs font-medium text-slate-500">
                      Data da Compra / NF / Vendedor
                    </p>
                    <p className="font-semibold text-slate-800">
                      {process.purchaseDate} — NF: {process.invoiceNumber} — Vendedor:{' '}
                      {process.seller}
                    </p>
                  </div>
                )}

                {process.type === 'Garantia' && process.defectDescription && (
                  <div className="space-y-2 col-span-2 mt-2 p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs font-medium text-slate-500">Aplicação</p>
                        <p className="text-sm font-semibold">
                          {process.applicationDate} ({process.applicationKm} km)
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500">Defeito</p>
                        <p className="text-sm font-semibold">
                          {process.defectDate} ({process.defectKm} km)
                        </p>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-500 mb-1">Defeito Apresentado</p>
                    <p className="text-sm text-slate-700">{process.defectDescription}</p>
                  </div>
                )}

                {process.type === 'Devolução Comum' && process.returnReason && (
                  <div className="space-y-1 col-span-2 mt-2 p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <p className="text-xs font-medium text-slate-500 mb-1">Motivo da Devolução</p>
                    <p className="text-sm font-semibold text-slate-800">
                      {process.returnReason}
                      {process.otherReason ? ` - ${process.otherReason}` : ''}
                    </p>
                    <p className="text-xs font-medium text-slate-500 mt-3 mb-1">Descrição</p>
                    <p className="text-sm text-slate-700">{process.returnDescription}</p>
                  </div>
                )}

                {process.returnInvoiceUrl && (
                  <div className="col-span-2 mt-2 p-4 bg-purple-50 rounded-lg border border-purple-100 flex items-center justify-between shadow-sm">
                    <div>
                      <p className="text-xs font-medium text-purple-600 mb-1 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" /> Nota Fiscal de Devolução Anexada
                      </p>
                      <p className="text-sm text-purple-900 font-medium truncate max-w-[200px] sm:max-w-md">
                        {process.returnInvoiceName ||
                          'Documento disponível para validação da equipe'}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white border-purple-200 text-purple-700 hover:bg-purple-100 shrink-0 ml-4"
                      asChild
                    >
                      <a href={process.returnInvoiceUrl} target="_blank" rel="noreferrer">
                        Visualizar NF
                      </a>
                    </Button>
                  </div>
                )}

                {process.evidenceUrls && process.evidenceUrls.length > 0 && (
                  <div className="col-span-2 pt-4 border-t">
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5 mb-3">
                      <FileImage className="w-3.5 h-3.5" /> Evidências Anexadas
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      {process.evidenceUrls.map((url, i) => (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="block relative w-20 h-20 sm:w-24 sm:h-24 border rounded-md overflow-hidden bg-slate-100 group shadow-sm hover:ring-2 ring-brand-blue ring-offset-2 transition-all"
                        >
                          <img
                            src={url}
                            className="w-full h-full object-cover"
                            alt={`Evidência ${i + 1}`}
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
                              Ver
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <InvoiceUploadPanel process={process} />

          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg">Linha do Tempo</CardTitle>
            </CardHeader>
            <CardContent className="pt-8 pl-4">
              <ProcessTimeline currentStatus={process.status} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-slate-900 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-slate-800 rounded-lg">
                  <CalendarDays className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Tempo Decorrido</p>
                  <p className="text-2xl font-bold">{process.slaDays} dias</p>
                </div>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full transition-all duration-1000 ${isOverdue ? 'bg-amber-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min((process.slaDays / 60) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-400 text-right">Limite Legal: 60 dias</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg">Ações Disponíveis</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ActionPanel process={process} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
