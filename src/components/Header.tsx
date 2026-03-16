import { Bell, Search, User } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { useProcessStore } from '@/contexts/ProcessContext'
import { Role } from '@/lib/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function Header() {
  const { role, setRole } = useProcessStore()

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4 md:px-6 shrink-0 z-10 sticky top-0">
      <div className="flex items-center gap-4 flex-1">
        <SidebarTrigger />
        <div className="relative w-full max-w-sm hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por ID ou Cliente..."
            className="pl-9 bg-slate-50 border-none focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative cursor-pointer hover:bg-slate-100 p-2 rounded-full transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-brand-rose rounded-full border-2 border-white"></span>
        </div>

        <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium text-slate-700">Simulação de Perfil</span>
            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger className="h-6 w-[120px] text-xs border-none bg-transparent p-0 justify-end gap-1 text-brand-blue font-semibold focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Vendedor">Vendedor</SelectItem>
                <SelectItem value="Cliente">Cliente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-100 border flex items-center justify-center">
            <User className="w-5 h-5 text-slate-500" />
          </div>
        </div>
      </div>
    </header>
  )
}
