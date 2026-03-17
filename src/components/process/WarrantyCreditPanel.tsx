import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Process } from '@/lib/types'
import { useProcessStore } from '@/contexts/ProcessContext'
import { Building2, UserCircle } from 'lucide-react'

export function WarrantyCreditPanel({ process }: { process: Process }) {
  const { updateProcess } = useProcessStore()

  if (process.type !== 'Garantia') return null

  return (
    <Card className="border-none shadow-sm bg-slate-50 border border-slate-100 mb-6 animate-fade-in">
      <CardHeader className="pb-3 border-b border-slate-200">
        <CardTitle className="text-md flex items-center gap-2 text-slate-800">
          Gestão de Créditos (Garantia)
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-md border shadow-sm">
              <Building2 className="w-5 h-5 text-slate-500" />
            </div>
            <div>
              <Label className="text-sm font-semibold text-slate-800 cursor-pointer">
                Crédito do Fornecedor Recebido
              </Label>
              <p className="text-xs text-slate-500 mt-0.5">
                O fornecedor autorizou/reembolsou a garantia
              </p>
            </div>
          </div>
          <Switch
            checked={!!process.supplierCreditReceived}
            disabled={process.status === 'Finalizado'}
            onCheckedChange={(checked) =>
              updateProcess(process.id, { supplierCreditReceived: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-md border shadow-sm flex-shrink-0">
              <UserCircle className="w-5 h-5 text-brand-blue" />
            </div>
            <div>
              <Label className="text-sm font-semibold text-slate-800">
                Crédito ao Cliente Liberado
              </Label>
              <p className="text-xs text-slate-500 mt-0.5">
                O crédito foi disponibilizado na conta do cliente
              </p>
              {!process.customerCreditReleased && process.status !== 'Finalizado' && (
                <p className="text-xs text-brand-blue mt-1 font-medium">
                  * Utilize o painel de Ações Disponíveis para liberar.
                </p>
              )}
            </div>
          </div>
          <Switch
            checked={!!process.customerCreditReleased}
            disabled={true} // Controlled via Action Panel to enforce reason collection
          />
        </div>
      </CardContent>
    </Card>
  )
}
