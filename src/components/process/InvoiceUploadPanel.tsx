import { useState } from 'react'
import { Upload, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Process } from '@/lib/types'
import { useProcessStore } from '@/contexts/ProcessContext'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function InvoiceUploadPanel({ process }: { process: Process }) {
  const [isUploading, setIsUploading] = useState(false)
  const { updateProcess, updateStatus } = useProcessStore()

  if (process.status !== 'Autorizado emissão da nota fiscal') return null

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false)
      const fileUrl = URL.createObjectURL(file)

      updateProcess(process.id, {
        returnInvoiceUrl: fileUrl,
        returnInvoiceName: file.name,
      })
      updateStatus(process.id, 'Nota Fiscal em Análise')

      toast.success('Nota Fiscal anexada com sucesso!')
    }, 1500)
  }

  return (
    <Card className="border-blue-200 shadow-sm bg-blue-50/50 animate-fade-in-up">
      <CardHeader className="pb-3 border-b border-blue-100 bg-blue-50/50 rounded-t-lg">
        <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Anexar Nota Fiscal de Devolução
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 bg-white rounded-b-lg">
        <p className="text-sm text-slate-700 mb-6">
          Sua solicitação foi aprovada. Por favor, anexe a Nota Fiscal de Devolução (PDF, PNG ou
          JPG) para prosseguirmos com a autorização de envio.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Button
            asChild
            disabled={isUploading}
            className="bg-blue-600 hover:bg-blue-700 relative overflow-hidden cursor-pointer w-full sm:w-auto"
          >
            <label>
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando documento...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Selecionar e Enviar Arquivo
                </>
              )}
              <input
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
          </Button>
          <span className="text-xs text-slate-500">Tamanho máximo: 5MB</span>
        </div>
      </CardContent>
    </Card>
  )
}
