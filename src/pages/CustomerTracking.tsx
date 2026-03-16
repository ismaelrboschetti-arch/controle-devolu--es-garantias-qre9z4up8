import { useState, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useProcessStore } from '@/contexts/ProcessContext'
import { StatusBadge } from '@/components/StatusBadge'
import { ProcessTimeline } from '@/components/process/ProcessTimeline'
import { Search, Package, ArrowLeft, FileText, Upload, Info } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

export default function CustomerTracking() {
  const [ticketId, setTicketId] = useState('')
  const [searched, setSearched] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { processes, updateProcess } = useProcessStore()

  const process = processes.find((p) => p.id.toUpperCase() === ticketId.trim().toUpperCase())

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (ticketId.trim()) {
      setSearched(true)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && process) {
      setUploading(true)
      // Simulate upload delay
      setTimeout(() => {
        updateProcess(process.id, {
          status: 'Nota Fiscal em Análise',
          returnInvoiceUrl: URL.createObjectURL(file),
        })
        setUploading(false)
        toast.success('Nota Fiscal enviada com sucesso! Em análise.')
      }, 1500)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 animate-fade-in">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <Link
            to="/processos/novo"
            className="text-slate-500 hover:text-slate-900 flex items-center gap-2 w-fit transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para Solicitações
          </Link>
        </div>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-blue/10 text-brand-blue mb-6 shadow-sm">
            <Package className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Rastrear Solicitação</h1>
          <p className="text-slate-500 mt-3 text-lg">
            Acompanhe o status da sua devolução ou garantia de forma rápida.
          </p>
        </div>

        <Card className="border-none shadow-md mb-8 overflow-hidden">
          <CardContent className="p-2 sm:p-4">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Digite o código (ex: DEV-1234 ou GRT-5678)"
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  className="pl-12 h-14 text-base sm:text-lg border-slate-200 bg-slate-50/50 focus-visible:bg-white"
                />
              </div>
              <Button
                type="submit"
                className="h-14 px-8 bg-brand-blue hover:bg-blue-600 text-base sm:text-lg font-semibold w-full sm:w-auto"
              >
                Consultar
              </Button>
            </form>
          </CardContent>
        </Card>

        {searched && (
          <div className="animate-slide-up">
            {process ? (
              <Card className="border-none shadow-md overflow-hidden">
                <CardHeader className="border-b bg-white pb-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <CardTitle className="text-2xl flex items-center gap-3 text-slate-900">
                        {process.id}
                      </CardTitle>
                      <p className="text-sm font-medium text-slate-500 mt-1.5">
                        Criado em {process.requestDate} • {process.type}
                      </p>
                    </div>
                    <StatusBadge status={process.status} className="text-sm px-3 py-1.5" />
                  </div>
                </CardHeader>
                <CardContent className="pt-8 bg-slate-50/30 pb-8">
                  <ProcessTimeline currentStatus={process.status} />

                  {process.status === 'Autorizado emissão da nota fiscal' && (
                    <Card className="mt-8 border-brand-blue/30 bg-blue-50/50 shadow-sm animate-fade-in-up">
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className="p-3 bg-brand-blue/10 rounded-full">
                            <FileText className="w-8 h-8 text-brand-blue" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900">
                              Ação Necessária: Enviar Nota Fiscal
                            </h3>
                            <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto leading-relaxed">
                              Sua solicitação foi aprovada. Para prosseguirmos, por favor emita a{' '}
                              <strong>Nota Fiscal de Devolução</strong> e anexe-a abaixo (Formatos
                              aceitos: PDF, JPG, PNG).
                            </p>
                          </div>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileUpload}
                          />
                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            size="lg"
                            className="bg-brand-blue hover:bg-blue-600 w-full sm:w-auto mt-2"
                          >
                            {uploading ? (
                              'Enviando arquivo...'
                            ) : (
                              <>
                                <Upload className="w-4 h-4 mr-2" /> Anexar Nota Fiscal de Devolução
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {process.status === 'Envio da Mercadoria Autorizado' && (
                    <Card className="mt-8 border-teal-200 bg-teal-50 shadow-sm animate-fade-in-up">
                      <CardContent className="pt-6 pb-6">
                        <div className="flex gap-4 items-start">
                          <Info className="w-6 h-6 text-teal-600 shrink-0 mt-0.5" />
                          <div>
                            <h3 className="text-lg font-semibold text-teal-900">
                              Instruções de Envio da Mercadoria
                            </h3>
                            <p className="text-sm text-teal-800 mt-2 leading-relaxed">
                              Sua Nota Fiscal de Devolução foi validada com sucesso!
                              <br />
                              <br />
                              Por favor, embale o produto adequadamente e envie para o seguinte
                              endereço:
                              <br />
                              <strong className="block mt-1 text-teal-900 bg-teal-100/50 p-2 rounded border border-teal-200">
                                Rua das Peças, 123 - Centro Logístico
                                <br />
                                São Paulo/SP - CEP 01000-000
                              </strong>
                              <br />
                              Lembre-se de incluir uma cópia impressa da Nota Fiscal junto à
                              mercadoria.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="border border-rose-100 shadow-sm bg-rose-50/50">
                <CardContent className="pt-6 text-center text-rose-600 font-medium">
                  Nenhuma solicitação encontrada com o código <strong>{ticketId}</strong>.<br />
                  Verifique o código digitado e tente novamente.
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
