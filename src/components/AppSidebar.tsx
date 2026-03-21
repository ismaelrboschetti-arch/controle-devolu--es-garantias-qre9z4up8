import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileText, Truck, Users, BarChart3, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const navigation = [
  { name: 'Início', path: '/', icon: LayoutDashboard },
  { name: 'Processos', path: '/processos', icon: FileText },
  { name: 'Lotes de Envio', path: '/lotes', icon: Layers },
  { name: 'Fornecedores', path: '/fornecedores', icon: Truck },
  { name: 'Clientes', path: '/clientes', icon: Users },
  { name: 'Relatórios', path: '/relatorios', icon: BarChart3 },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="py-4 px-4 flex items-center justify-center border-b border-sidebar-border">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center shrink-0">
            <FileText className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-white truncate group-data-[collapsible=icon]:hidden">
            Devoluções PRO
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400 mt-4">Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/' && location.pathname.startsWith(item.path))
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.name}>
                      <Link
                        to={item.path}
                        className={cn(
                          'flex items-center gap-3 py-2',
                          isActive && 'bg-brand-blue text-white hover:bg-brand-blue/90',
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
