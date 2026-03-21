import { useState } from 'react'
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
import { Card } from '@/components/ui/card'
import { Search, Plus, Edit, Trash2 } from 'lucide-react'
import { useSupplierStore } from '@/contexts/SupplierContext'
import { SupplierFormDialog } from '@/components/supplier/SupplierFormDialog'
import { SupplierDeleteDialog } from '@/components/supplier/SupplierDeleteDialog'
import { Supplier } from '@/lib/types'

export default function SupplierList() {
  const { suppliers } = useSupplierStore()
  const [search, setSearch] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>()

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingSupplier, setDeletingSupplier] = useState<Supplier | undefined>()

  const filtered = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.manufacturer.toLowerCase().includes(search.toLowerCase()),
  )

  const handleEdit = (s: Supplier) => {
    setEditingSupplier(s)
    setFormOpen(true)
  }

  const handleDelete = (s: Supplier) => {
    setDeletingSupplier(s)
    setDeleteOpen(true)
  }

  const openNew = () => {
    setEditingSupplier(undefined)
    setFormOpen(true)
  }

  return (
    <div className="flex flex-col gap-6 animate-slide-up pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fornecedores</h1>
          <p className="text-slate-500 mt-1">Gerencie os fabricantes e distribuidores parceiros.</p>
        </div>
        <Button
          onClick={openNew}
          className="bg-brand-blue hover:bg-blue-600 gap-2 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Adicionar Fornecedor
        </Button>
      </div>

      <Card className="p-4 flex flex-col md:flex-row gap-4 border-none shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por nome ou fabricante..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-slate-50 border-slate-200"
          />
        </div>
      </Card>

      <Card className="border-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Fabricante</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Garantia Padrão</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  Nenhum fornecedor encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((s) => (
                <TableRow key={s.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell className="font-medium text-slate-900">{s.name}</TableCell>
                  <TableCell>{s.manufacturer}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{s.contactEmail}</span>
                      {s.phone && <span className="text-xs text-slate-500 mt-0.5">{s.phone}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    {s.defaultWarrantyDays ? (
                      <span className="font-medium">{s.defaultWarrantyDays} dias</span>
                    ) : (
                      <span className="text-slate-400 text-sm">Não definido</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(s)}
                        className="text-brand-blue hover:text-blue-700 hover:bg-blue-50 h-8 w-8"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(s)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <SupplierFormDialog open={formOpen} onOpenChange={setFormOpen} supplier={editingSupplier} />
      <SupplierDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        supplier={deletingSupplier}
      />
    </div>
  )
}
