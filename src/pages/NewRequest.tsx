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
import { ProcessType, ProcessStatus } from '@/lib/types'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Search, UploadCloud, X } from 'lucide-react'

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

  const [files, setFiles] = useState<{ file: File; url: string }[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((f) => ({
        file: f,
        url: URL.createObjectURL(f),
      }))
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

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

    let finalStatus: ProcessStatus = 'Aguardando Autorização'
    let autoApproved = false

    if (type === 'Devolução Comum' && formData.returnReason === '1 - Comprei errado') {
      const pDate = new Date(formData.purchaseDate)
      const today = new Date()
      const diffDays = Math.floor((today.getTime() - pDate.getTime()) / (1000 * 60 * 60 * 24))
      if (diffDays >= 0 && diffDays <= 7) {
        finalStatus = 'Produto Recebido'
        autoApproved = true
      }
    }

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
      status: finalStatus,
      slaDays: 0,
      purchaseDate: formData.purchaseDate,
      invoiceNumber: formData.invoiceNumber,
      evidenceUrls: files.map((f) => f.url),
      autoApproved,
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

    if (autoApproved) {
      toast.success('Solicitação aprovada automaticamente!', {
        description: 'Notificação enviada ao cliente e vendedor via e-mail/WhatsApp.',
        icon: '✅',
      })
    } else {
      toast.success('Solicitação criada com sucesso!')
    }
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
            <div className="space-y-6">
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

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-500 font-medium">ou</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-14 text-base font-semibold text-brand-blue border-brand-blue/30 hover:bg-blue-50"
                onClick={() => navigate('/consultar-ticket')}
              >
                <Search className="w-5 h-5 mr-2" />
                Consultar Status de Solicitação Existente
              </Button>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Vendedor que fez a venda *</Label>
                  <Select
                    value={formData.seller}
                    onValueChange={(v) => setFormData({ ...formData, seller: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Adrian">Adrian</SelectItem>
                      <SelectItem value="Alex">Alex</SelectItem>
                      <SelectItem value="Eric">Eric</SelectItem>
                      <SelectItem value="Lucas Orlando">Lucas Orlando</SelectItem>
                      <SelectItem value="Lucas Prestes">Lucas Prestes</SelectItem>
                      <SelectItem value="Northon">Northon</SelectItem>
                    </SelectContent>
                  </Select>
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
                        <SelectItem value="5 - Meu cliente desistiu">
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

              <div className="space-y-3 pt-4 border-t">
                <Label className="flex items-center gap-2">
                  Evidências do Produto (Fotos/Vídeos)
                  {type === 'Devolução Comum' && formData.returnReason.includes('avariado') && (
                    <span className="text-rose-500 font-normal text-xs bg-rose-50 px-2 py-0.5 rounded">
                      Obrigatório
                    </span>
                  )}
                </Label>

                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors relative cursor-pointer">
                  <Input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-700">
                    Clique ou arraste arquivos aqui
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Formatos: JPG, PNG, MP4 (Máx: 50MB)</p>
                </div>

                {files.length > 0 && (
                  <div className="flex gap-3 flex-wrap mt-4 animate-fade-in">
                    {files.map((file, i) => (
                      <div
                        key={i}
                        className="relative w-20 h-20 border rounded-md overflow-hidden bg-slate-100 group shadow-sm"
                      >
                        {file.file.type.startsWith('image/') ? (
                          <img
                            src={file.url}
                            className="w-full h-full object-cover"
                            alt="preview"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white text-[10px] font-bold tracking-wider">
                            VÍDEO
                          </div>
                        )}
                        <button
                          onClick={() => removeFile(i)}
                          className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20"
                          title="Remover arquivo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
