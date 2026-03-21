import { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Supplier } from '@/lib/types'
import { useSupplierStore } from '@/contexts/SupplierContext'
import { toast } from 'sonner'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier?: Supplier
}

export function SupplierFormDialog({ open, onOpenChange, supplier }: Props) {
  const { addSupplier, updateSupplier } = useSupplierStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    manufacturer: '',
    contactEmail: '',
    phone: '',
    defaultWarrantyDays: '',
  })

  const [policyFile, setPolicyFile] = useState<File | null>(null)

  useEffect(() => {
    if (open) {
      if (supplier) {
        setFormData({
          name: supplier.name,
          manufacturer: supplier.manufacturer,
          contactEmail: supplier.contactEmail,
          phone: supplier.phone || '',
          defaultWarrantyDays: supplier.defaultWarrantyDays?.toString() || '',
        })
      } else {
        setFormData({
          name: '',
          manufacturer: '',
          contactEmail: '',
          phone: '',
          defaultWarrantyDays: '',
        })
      }
      setPolicyFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }, [open, supplier])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.manufacturer || !formData.contactEmail) {
      toast.error('Preencha todos os campos obrigatórios.')
      return
    }

    let warrantyPolicyUrl = supplier?.warrantyPolicyUrl
    if (policyFile) {
      warrantyPolicyUrl = URL.createObjectURL(policyFile)
    }

    const payload = {
      name: formData.name,
      manufacturer: formData.manufacturer,
      contactEmail: formData.contactEmail,
      phone: formData.phone || undefined,
      defaultWarrantyDays: formData.defaultWarrantyDays
        ? parseInt(formData.defaultWarrantyDays, 10)
        : undefined,
      warrantyPolicyUrl,
    }

    if (supplier) {
      updateSupplier(supplier.id, payload)
      toast.success('Fornecedor atualizado com sucesso!')
    } else {
      addSupplier(payload)
      toast.success('Fornecedor cadastrado com sucesso!')
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{supplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Nome do Fornecedor *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Fabricante / Marca *</Label>
            <Input
              value={formData.manufacturer}
              onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>E-mail de Contato *</Label>
            <Input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Telefone</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Prazo de Garantia Padrão (dias)</Label>
            <Input
              type="number"
              value={formData.defaultWarrantyDays}
              onChange={(e) => setFormData({ ...formData, defaultWarrantyDays: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Política de Garantia (PDF)</Label>
            <Input
              type="file"
              accept=".pdf"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) setPolicyFile(file)
                else setPolicyFile(null)
              }}
            />
            {supplier?.warrantyPolicyUrl && !policyFile && (
              <p className="text-xs text-slate-500 mt-1">
                Já possui uma política anexada. Enviar novo arquivo irá substituí-la.
              </p>
            )}
            {policyFile && (
              <p className="text-xs text-brand-blue font-medium mt-1">
                Arquivo selecionado: {policyFile.name}
              </p>
            )}
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-brand-blue hover:bg-blue-600">
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
