import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import Index from './pages/Index'
import ProcessList from './pages/ProcessList'
import ProcessDetails from './pages/ProcessDetails'
import NewRequest from './pages/NewRequest'
import CustomerTracking from './pages/CustomerTracking'
import SupplierList from './pages/SupplierList'
import BatchList from './pages/BatchList'
import NotFound from './pages/NotFound'
import { ProcessProvider } from './contexts/ProcessContext'
import { SupplierProvider } from './contexts/SupplierContext'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <ProcessProvider>
      <SupplierProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" richColors />
          <Routes>
            <Route path="/consultar-ticket" element={<CustomerTracking />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/processos" element={<ProcessList />} />
              <Route path="/processos/novo" element={<NewRequest />} />
              <Route path="/processos/:id" element={<ProcessDetails />} />
              <Route path="/lotes" element={<BatchList />} />
              <Route path="/fornecedores" element={<SupplierList />} />
              {/* Placeholder routes to avoid 404s in navigation */}
              <Route
                path="/clientes"
                element={
                  <div className="p-8 font-semibold text-slate-500">
                    Módulo de Clientes em construção.
                  </div>
                }
              />
              <Route
                path="/relatorios"
                element={
                  <div className="p-8 font-semibold text-slate-500">
                    Módulo de Relatórios em construção.
                  </div>
                }
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </SupplierProvider>
    </ProcessProvider>
  </BrowserRouter>
)

export default App
