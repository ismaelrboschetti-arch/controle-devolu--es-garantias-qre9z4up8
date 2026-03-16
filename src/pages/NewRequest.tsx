import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useProcessStore } from '@/contexts/ProcessContext'
import { ProcessType } from '@/lib/types'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function NewRequest() {
  const navigate = useNavigate()
  const { addProcess } = useProcessStore()

  const [step, setStep] = useState(1)
  const [type, setType] = useState<ProcessType>('Devolução Comum')

  const [formData, setFormData] = useState({
    seller: '',
    purchaseDate: '',
    invoiceNumber: '',
    sku: '',
    applicationDate: '',
    applicationKm: '',
    defectDate: '',
    defectKm: '',
    defectDescription: '',
    returnDescription: '',
    returnReason: '',
    otherReason: '',
  })

  const handleSubmit = () => {
    if (!formData.seller || !formData.purchaseDate || !formData.invoiceNumber || !formData.sku) {
      return toast.error('Preencha os campos obrigatórios comuns.')
    }
    if (type === 'Garantia') {
      if (
        !formData.applicationDate ||
        !formData.applicationKm ||
        !formData.defectDate ||
        !formData.defectKm ||
        !formData.defectDescription
      ) {
        return toast.error('Preencha todos os campos de garantia.')
      }
    } else {
      if (!formData.returnDescription || !formData.returnReason) {
        return toast.error('Preencha todos os campos de devolução.')
      }
      if (formData.returnReason.includes('Outros') && !formData.otherReason) {
        return toast.error('Descreva o motivo da devolução.')
      }
    }

    const num = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0')
    const id = type === 'Garantia' ? `GRT-${num}` : `DEV-${num}`

    addProcess({
      id,
      type,
      category: 'Outros',
      customer: 'Não Informado',
      product: 'Não Informado',
      sku: formData.sku,
      supplier: 'Não Informado',
      seller: formData.seller,
      requestDate: new Date().toISOString().split('T')[0],
      value: 0,
      status: 'Aguardando Autorização',
      slaDays: 0,
      purchaseDate: formData.purchaseDate,
      invoiceNumber: formData.invoiceNumber,
      ...(type === 'Garantia'
        ? {
            applicationDate: formData.applicationDate,
            applicationKm: parseFloat(formData.applicationKm),
            defectDate: formData.defectDate,
            defectKm: parseFloat(formData.defectKm),
            defectDescription: formData.defectDescription,
          }
        : {
            returnDescription: formData.returnDescription,
            returnReason: formData.returnReason,
            otherReason: formData.otherReason,
          }),
    })
    toast.success('Solicitação criada com sucesso!')
    navigate(`/processos/${id}`)
  }

  return (
    <div className="max-w-3xl mx-auto py-8 animate-fade-in">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Nova Solicitação</h1>
      <Card className="border-none shadow-sm">
        <CardHeader>
          <CardTitle>{step === 1 ? 'Tipo de Solicitação' : 'Detalhes da Solicitação'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 ? (
            <RadioGroup
              value={type}
              onValueChange={(v) => setType(v as ProcessType)}
              className="gap-4"
            >
              <div
                className={cn(
                  'flex items-center space-x-3 border p-4 rounded-xl cursor-pointer transition-colors',
                  type === 'Devolução Comum'
                    ? 'border-brand-blue bg-blue-50/50'
                    : 'border-slate-200 hover:bg-slate-50',
                )}
                onClick={() => setType('Devolução Comum')}
              >
                <RadioGroupItem value="Devolução Comum" id="r1" />
                <Label htmlFor="r1" className="flex-1 cursor-pointer font-semibold text-lg">
                  Devolução (Arrependimento/Outros)
                </Label>
              </div>
              <div
                className={cn(
                  'flex items-center space-x-3 border p-4 rounded-xl cursor-pointer transition-colors',
                  type === 'Garantia'
                    ? 'border-brand-blue bg-blue-50/50'
                    : 'border-slate-200 hover:bg-slate-50',
                )}
                onClick={() => setType('Garantia')}
              >
                <RadioGroupItem value="Garantia" id="r2" />
                <Label htmlFor="r2" className="flex-1 cursor-pointer font-semibold text-lg">
                  Garantia (Defeito de Fábrica)
                </Label>
              </div>
            </RadioGroup>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Vendedor que fez a venda *</Label>
                  <Input
                    value={formData.seller}
                    onChange={(e) => setFormData({ ...formData, seller: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data da compra *</Label>
                  <Input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nota fiscal de compra *</Label>
                  <Input
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Código do produto *</Label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
              </div>

              {type === 'Garantia' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label>Data da aplicação *</Label>
                    <Input
                      type="date"
                      value={formData.applicationDate}
                      onChange={(e) =>
                        setFormData({ ...formData, applicationDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>KM da aplicação *</Label>
                    <Input
                      type="number"
                      value={formData.applicationKm}
                      onChange={(e) => setFormData({ ...formData, applicationKm: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Data do defeito *</Label>
                    <Input
                      type="date"
                      value={formData.defectDate}
                      onChange={(e) => setFormData({ ...formData, defectDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>KM do defeito *</Label>
                    <Input
                      type="number"
                      value={formData.defectKm}
                      onChange={(e) => setFormData({ ...formData, defectKm: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Defeito apresentado *</Label>
                    <Textarea
                      value={formData.defectDescription}
                      onChange={(e) =>
                        setFormData({ ...formData, defectDescription: e.target.value })
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label>Motivo da devolução *</Label>
                    <Select
                      value={formData.returnReason}
                      onValueChange={(v) => setFormData({ ...formData, returnReason: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 - Comprei errado">1 - Comprei errado</SelectItem>
                        <SelectItem value="2 - Me venderam errado">
                          2 - Me venderam errado
                        </SelectItem>
                        <SelectItem value="3 - Demorou demais">3 - Demorou demais</SelectItem>
                        <SelectItem value="4 - Chegou avariado">4 - Chegou avariado</SelectItem>
                        <SelectItem value="5 - Meu cliente desisitiu">
                          5 - Meu cliente desistiu
                        </SelectItem>
                        <SelectItem value="6 - Outros (descreva o motivo)">
                          6 - Outros (descreva o motivo)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.returnReason.includes('Outros') && (
                    <div className="space-y-2 animate-fade-in">
                      <Label>Descreva o motivo *</Label>
                      <Input
                        value={formData.otherReason}
                        onChange={(e) => setFormData({ ...formData, otherReason: e.target.value })}
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Descrição *</Label>
                    <Textarea
                      value={formData.returnDescription}
                      onChange={(e) =>
                        setFormData({ ...formData, returnDescription: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button
            variant="outline"
            onClick={() => (step > 1 ? setStep(1) : navigate('/processos'))}
          >
            {step === 1 ? 'Cancelar' : 'Voltar'}
          </Button>
          <Button
            onClick={() => (step === 1 ? setStep(2) : handleSubmit())}
            className="bg-brand-blue hover:bg-blue-600"
          >
            {step === 1 ? 'Continuar' : 'Finalizar Solicitação'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
