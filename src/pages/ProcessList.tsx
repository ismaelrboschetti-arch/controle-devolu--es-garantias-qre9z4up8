import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Search, Plus, Filter } from 'lucide-react'
import { useProcessStore } from '@/contexts/ProcessContext'
import { StatusBadge } from '@/components/StatusBadge'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'

export default function ProcessList() {
  const { processes } = useProcessStore()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('todos')

  const filtered = processes.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.customer.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'todos' || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Processos</h1>
          <p className="text-slate-500 mt-1">Gerencie devoluções e garantias.</p>
        </div>
        <Button
          onClick={() => navigate('/processos/novo')}
          className="bg-brand-blue hover:bg-blue-600 gap-2 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Nova Solicitação
        </Button>
      </div>

      <Card className="p-4 flex flex-col md:flex-row gap-4 border-none shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por ID ou Cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-slate-50 border-slate-200"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-[250px]">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-slate-50 border-slate-200">
              <SelectValue placeholder="Filtrar por Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Status</SelectItem>
              <SelectItem value="Pendente de Análise">Pendente de Análise</SelectItem>
              <SelectItem value="Produto Recebido">Produto Recebido</SelectItem>
              <SelectItem value="Enviado ao Fornecedor">Enviado ao Fornecedor</SelectItem>
              <SelectItem value="Crédito Liberado">Crédito Liberado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="border-none shadow-sm overflow-hidden">
        {isMobile ? (
          <div className="divide-y divide-slate-100">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="p-4 cursor-pointer hover:bg-slate-50"
                onClick={() => navigate(`/processos/${p.id}`)}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-brand-blue flex items-center gap-2">{p.id}</span>
                  <StatusBadge status={p.status} />
                </div>
                <div className="text-sm font-medium text-slate-800">{p.customer}</div>
                <div className="text-xs text-slate-500">{p.product}</div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-600">{p.requestDate}</span>
                  <span
                    className={cn(
                      'text-xs font-bold',
                      p.slaDays > 60 ? 'text-amber-500 animate-pulse' : 'text-slate-500',
                    )}
                  >
                    {p.slaDays} dias
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Cliente / Produto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">SLA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    Nenhum processo encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow
                    key={p.id}
                    className="cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => navigate(`/processos/${p.id}`)}
                  >
                    <TableCell className="font-semibold text-brand-blue">
                      <div className="flex items-center gap-2">{p.id}</div>
                    </TableCell>
                    <TableCell>{p.requestDate}</TableCell>
                    <TableCell>
                      <div className="font-medium text-slate-800">{p.customer}</div>
                      <div className="text-xs text-slate-500">{p.product}</div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-600 font-medium">
                        {p.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={p.status} />
                    </TableCell>
                    <TableCell
                      className={cn(
                        'text-right font-medium',
                        p.slaDays > 60 && 'text-amber-500 animate-pulse',
                      )}
                    >
                      {p.slaDays} dias
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
