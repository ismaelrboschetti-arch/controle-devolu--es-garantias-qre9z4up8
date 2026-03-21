import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useProcessStore } from '@/contexts/ProcessContext'
import { Process } from '@/lib/types'
import { Layers, AlertTriangle, Eye, Printer, PackageCheck } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type BatchData = {
  supplier: string
  items: Process[]
  oldestDate: string
  daysElapsed: number
}

export default function BatchList() {
  const { processes, updateStatus } = useProcessStore()

  const [viewBatch, setViewBatch] = useState<BatchData | null>(null)
  const [shippingNote, setShippingNote] = useState<BatchData | null>(null)

  const groupedBatches = useMemo(() => {
    const pending = processes.filter((p) => p.status === 'Produto Recebido')
    const groups: Record<string, Process[]> = {}

    pending.forEach((p) => {
      const supplierName = p.supplier || 'Fornecedor Desconhecido'
      if (!groups[supplierName]) groups[supplierName] = []
      groups[supplierName].push(p)
    })

    return Object.entries(groups)
      .map(([supplier, items]) => {
        const sortedItems = [...items].sort(
          (a, b) => new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime(),
        )
        const oldest = sortedItems[0]
        const diffTime = Math.abs(new Date().getTime() - new Date(oldest.requestDate).getTime())
        const daysElapsed = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        return {
          supplier,
          items: sortedItems,
          oldestDate: oldest.requestDate,
          daysElapsed,
        }
      })
      .sort((a, b) => b.daysElapsed - a.daysElapsed)
  }, [processes])

  const handleGenerateNote = (batch: BatchData) => {
    batch.items.forEach((item) => updateStatus(item.id, 'Enviado ao Fornecedor'))
    setShippingNote(batch)
    toast.success(`Lote de ${batch.supplier} fechado.`, {
      description: 'Status dos itens atualizados para Enviado ao Fornecedor.',
    })
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex flex-col gap-6 animate-slide-up pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Lotes</h1>
          <p className="text-slate-500 mt-1">
            Consolide itens por fornecedor para otimizar custos de frete.
          </p>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Fornecedor</TableHead>
              <TableHead className="text-center">Qtd. Itens</TableHead>
              <TableHead>Data Mais Antiga</TableHead>
              <TableHead>Tempo de Espera</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedBatches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">Nenhum item aguardando consolidação.</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Itens com status "Produto Recebido" aparecerão aqui.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              groupedBatches.map((batch, index) => {
                const isOverdue = batch.daysElapsed >= 15
                return (
                  <TableRow
                    key={index}
                    className={cn(
                      'transition-colors',
                      isOverdue ? 'bg-amber-50/30 hover:bg-amber-50' : 'hover:bg-slate-50',
                    )}
                  >
                    <TableCell className="font-semibold text-slate-900">{batch.supplier}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-bold text-sm">
                        {batch.items.length}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600">{batch.oldestDate}</TableCell>
                    <TableCell>
                      {isOverdue ? (
                        <div className="flex items-center gap-2 text-amber-700 font-semibold bg-amber-100/50 w-fit px-2 py-1 rounded-md">
                          <AlertTriangle className="w-4 h-4" />
                          {batch.daysElapsed} dias
                        </div>
                      ) : (
                        <span className="text-slate-600 font-medium">{batch.daysElapsed} dias</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewBatch(batch)}
                          className="text-brand-blue hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Itens
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleGenerateNote(batch)}
                          className="bg-brand-blue hover:bg-blue-600"
                        >
                          <PackageCheck className="w-4 h-4 mr-2" />
                          Gerar Guia
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Visualizar Itens do Lote Dialog */}
      <Dialog open={!!viewBatch} onOpenChange={(open) => !open && setViewBatch(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Itens Pendentes - {viewBatch?.supplier}</DialogTitle>
            <DialogDescription>
              Lista detalhada dos produtos aguardando envio para este fornecedor.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto border rounded-md mt-4">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 shadow-sm z-10">
                <TableRow>
                  <TableHead>Processo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>SKU / Produto</TableHead>
                  <TableHead>Tipo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {viewBatch?.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-brand-blue">{item.id}</TableCell>
                    <TableCell>{item.requestDate}</TableCell>
                    <TableCell>
                      <div className="font-medium">{item.sku}</div>
                      <div className="text-xs text-slate-500">{item.product}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setViewBatch(null)}>
              Fechar
            </Button>
            <Button
              className="bg-brand-blue hover:bg-blue-600"
              onClick={() => {
                if (viewBatch) {
                  handleGenerateNote(viewBatch)
                  setViewBatch(null)
                }
              }}
            >
              <PackageCheck className="w-4 h-4 mr-2" />
              Fechar Lote e Gerar Guia
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Guia de Remessa (Shipping Note) Dialog */}
      <Dialog open={!!shippingNote} onOpenChange={(open) => !open && setShippingNote(null)}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader className="print:hidden border-b pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Printer className="w-5 h-5 text-slate-500" />
              Checklist de Envio Gerado
            </DialogTitle>
          </DialogHeader>

          {/* Printable Area */}
          <div id="printable-guia" className="space-y-6 pt-4 text-slate-900">
            <div className="flex justify-between items-start border-b-2 border-slate-200 pb-4">
              <div>
                <h2 className="font-extrabold text-2xl uppercase tracking-wider text-slate-800">
                  Guia de Remessa
                </h2>
                <p className="text-sm font-medium mt-1 text-slate-500">
                  Documento de acompanhamento logístico
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">{shippingNote?.supplier}</p>
                <p className="text-sm text-slate-500">
                  Data de emissão: {new Date().toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Resumo do Lote
                </p>
                <p className="text-lg font-bold">Total de Itens: {shippingNote?.items.length}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Status Atualizado
                </p>
                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none shadow-none">
                  Enviado ao Fornecedor
                </Badge>
              </div>
            </div>

            <Table className="border rounded-md overflow-hidden">
              <TableHeader className="bg-slate-100">
                <TableRow>
                  <TableHead className="font-bold text-slate-700">Ref. Processo</TableHead>
                  <TableHead className="font-bold text-slate-700">Cód. SKU</TableHead>
                  <TableHead className="font-bold text-slate-700">Descrição do Produto</TableHead>
                  <TableHead className="text-center font-bold text-slate-700">Qtd.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shippingNote?.items.map((item) => (
                  <TableRow key={item.id} className="border-b border-slate-100">
                    <TableCell className="font-mono text-sm">{item.id}</TableCell>
                    <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                    <TableCell className="text-sm">{item.product}</TableCell>
                    <TableCell className="text-center font-semibold">1</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-12 pt-8 border-t-2 border-dashed border-slate-200 grid grid-cols-2 gap-8 text-center text-sm">
              <div>
                <div className="w-48 mx-auto border-b border-slate-400 mb-2 h-8"></div>
                <p className="font-semibold text-slate-600">Assinatura Expedição</p>
              </div>
              <div>
                <div className="w-48 mx-auto border-b border-slate-400 mb-2 h-8"></div>
                <p className="font-semibold text-slate-600">Assinatura Transportador</p>
              </div>
            </div>
          </div>

          <DialogFooter className="print:hidden mt-6 pt-4 border-t">
            <Button variant="outline" onClick={() => setShippingNote(null)}>
              Fechar
            </Button>
            <Button onClick={handlePrint} className="bg-slate-900 hover:bg-slate-800 text-white">
              <Printer className="w-4 h-4 mr-2" />
              Imprimir Documento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
