import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import Index from './pages/Index'
import ProcessList from './pages/ProcessList'
import ProcessDetails from './pages/ProcessDetails'
import NewRequest from './pages/NewRequest'
import NotFound from './pages/NotFound'
import { ProcessProvider } from './contexts/ProcessContext'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <ProcessProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" richColors />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/processos" element={<ProcessList />} />
            <Route path="/processos/novo" element={<NewRequest />} />
            <Route path="/processos/:id" element={<ProcessDetails />} />
            {/* Placeholder routes to avoid 404s in navigation */}
            <Route
              path="/fornecedores"
              element={
                <div className="p-8 font-semibold text-slate-500">
                  Módulo de Fornecedores em construção.
                </div>
              }
            />
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
    </ProcessProvider>
  </BrowserRouter>
)

export default App
