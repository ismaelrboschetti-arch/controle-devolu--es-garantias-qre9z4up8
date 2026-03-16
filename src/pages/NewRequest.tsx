import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProcessStore } from '@/contexts/ProcessContext'
import { generateId } from '@/lib/mock'
import { ProcessType, ProductCategory } from '@/lib/types'
import { differenceInDays, parseISO } from 'date-fns'
import { toast } from 'sonner'

export default function NewRequest() {
  const navigate = useNavigate()
  const { addProcess } = useProcessStore()

  const [step, setStep] = useState(1)
  const [type, setType] = useState<ProcessType>('Devolução Comum')
  const [category, setCategory] = useState<ProductCategory>('Outros')
  const [purchaseDate, setPurchaseDate] = useState('')
  const [error, setError] = useState('')

  // Form Data
  const [formData, setFormData] = useState({
    customer: '',
    product: '',
    sku: '',
    supplier: '',
    value: '',
  })

  const handleValidation = () => {
    if (!purchaseDate) return setError('Selecione a data da compra.')
    const days = differenceInDays(new Date(), parseISO(purchaseDate))

    if (type === 'Devolução Comum' && days > 7) {
      return setError('O prazo para devolução comum é de até 7 dias da compra.')
    }
    if (type === 'Garantia') {
      if (category === 'Amortecedor' && days > 365)
        return setError('Garantia de amortecedor expirada (máx 1 ano).')
      if (category === 'Outros' && days > 90) return setError('Garantia expirada (máx 90 dias).')
    }

    setError('')
    setStep(3)
  }

  const handleSubmit = () => {
    if (!formData.customer || !formData.product || !formData.value)
      return toast.error('Preencha os campos obrigatórios')

    const newProc = {
      id: generateId(),
      type,
      category,
      customer: formData.customer,
      product: formData.product,
      sku: formData.sku || 'N/A',
      supplier: formData.supplier || 'N/A',
      seller: 'Vendedor Logado',
      requestDate: new Date().toISOString().split('T')[0],
      value: parseFloat(formData.value),
      status: 'Aguardando Autorização' as const,
      slaDays: 0,
    }

    addProcess(newProc)
    toast.success('Solicitação criada com sucesso!')
    navigate(`/processos/${newProc.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto py-8 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Nova Solicitação</h1>

      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-colors ${step >= i ? 'bg-brand-blue' : 'bg-slate-200'}`}
          />
        ))}
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>
            {step === 1 && 'Tipo de Solicitação'}
            {step === 2 && 'Validação de Prazos'}
            {step === 3 && 'Detalhes do Produto'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <RadioGroup
              value={type}
              onValueChange={(v) => setType(v as ProcessType)}
              className="gap-4"
            >
              <div
                className={`flex items-center space-x-3 border p-4 rounded-xl cursor-pointer transition-colors ${type === 'Devolução Comum' ? 'border-brand-blue bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'}`}
                onClick={() => setType('Devolução Comum')}
              >
                <RadioGroupItem value="Devolução Comum" id="r1" />
                <Label htmlFor="r1" className="flex-1 cursor-pointer font-semibold text-lg">
                  Devolução Comum (Arrependimento)
                </Label>
              </div>
              <div
                className={`flex items-center space-x-3 border p-4 rounded-xl cursor-pointer transition-colors ${type === 'Garantia' ? 'border-brand-blue bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'}`}
                onClick={() => setType('Garantia')}
              >
                <RadioGroupItem value="Garantia" id="r2" />
                <Label htmlFor="r2" className="flex-1 cursor-pointer font-semibold text-lg">
                  Garantia (Defeito de Fábrica)
                </Label>
              </div>
            </RadioGroup>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              {type === 'Garantia' && (
                <div className="space-y-2">
                  <Label>Categoria do Produto</Label>
                  <Select value={category} onValueChange={(v) => setCategory(v as ProductCategory)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Outros">Geral (90 dias)</SelectItem>
                      <SelectItem value="Amortecedor">Amortecedor (1 ano)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2">
                <Label>Data da Compra na NF</Label>
                <Input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                />
              </div>
              {error && (
                <p className="text-sm font-medium text-brand-rose bg-rose-50 p-3 rounded-md">
                  {error}
                </p>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Cliente</Label>
                  <Input
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    placeholder="Nome da Oficina/Cliente"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Produto</Label>
                  <Input
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    placeholder="Ex: Filtro de Óleo"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Valor (R$)</Label>
                  <Input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>SKU / Código</Label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fornecedor</Label>
                  <Input
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button
            variant="outline"
            onClick={() => (step > 1 ? setStep(step - 1) : navigate('/processos'))}
          >
            {step === 1 ? 'Cancelar' : 'Voltar'}
          </Button>
          <Button
            onClick={() => {
              if (step === 1) setStep(2)
              else if (step === 2) handleValidation()
              else handleSubmit()
            }}
            className="bg-brand-blue hover:bg-blue-600"
          >
            {step === 3 ? 'Finalizar Solicitação' : 'Continuar'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
