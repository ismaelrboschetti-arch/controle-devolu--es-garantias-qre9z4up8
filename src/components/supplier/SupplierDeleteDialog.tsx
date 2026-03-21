import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Supplier } from '@/lib/types'
import { useSupplierStore } from '@/contexts/SupplierContext'
import { toast } from 'sonner'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier?: Supplier
}

export function SupplierDeleteDialog({ open, onOpenChange, supplier }: Props) {
  const { deleteSupplier } = useSupplierStore()

  const handleConfirm = () => {
    if (supplier) {
      deleteSupplier(supplier.id)
      toast.success('Fornecedor removido com sucesso!')
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Fornecedor</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o fornecedor <strong>{supplier?.name}</strong>? Esta ação
            não pode ser desfeita e pode afetar os processos vinculados a ele.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
