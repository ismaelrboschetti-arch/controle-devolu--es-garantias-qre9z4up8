import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useProcessStore } from '@/contexts/ProcessContext'
import { StatusBadge } from '@/components/StatusBadge'
import { ProcessTimeline } from '@/components/process/ProcessTimeline'
import { Search, Package, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CustomerTracking() {
  const [ticketId, setTicketId] = useState('')
  const [searched, setSearched] = useState(false)
  const { processes } = useProcessStore()

  const process = processes.find((p) => p.id.toUpperCase() === ticketId.trim().toUpperCase())

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (ticketId.trim()) {
      setSearched(true)
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
                        {process.autoApproved && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-md font-bold tracking-wide uppercase">
                            Auto-Aprovado
                          </span>
                        )}
                      </CardTitle>
                      <p className="text-sm font-medium text-slate-500 mt-1.5">
                        Criado em {process.requestDate} • {process.type}
                      </p>
                    </div>
                    <StatusBadge status={process.status} className="text-sm px-3 py-1.5" />
                  </div>
                </CardHeader>
                <CardContent className="pt-8 bg-slate-50/30">
                  <ProcessTimeline currentStatus={process.status} />
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
