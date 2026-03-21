import React, { createContext, useContext, useState } from 'react'
import { Supplier } from '@/lib/types'

interface SupplierContextType {
  suppliers: Supplier[]
  addSupplier: (s: Omit<Supplier, 'id'>) => void
  updateSupplier: (id: string, s: Partial<Supplier>) => void
  deleteSupplier: (id: string) => void
}

const mockSuppliers: Supplier[] = [
  {
    id: 'SUP-001',
    name: 'Filtros S/A',
    manufacturer: 'Filtros S/A',
    contactEmail: 'contato@filtros.com',
    phone: '(11) 3333-3333',
    defaultWarrantyDays: 90,
  },
  {
    id: 'SUP-002',
    name: 'Monroe Brasil',
    manufacturer: 'Monroe',
    contactEmail: 'garantia@monroe.com',
    defaultWarrantyDays: 365,
  },
  {
    id: 'SUP-003',
    name: 'Bosch Distribuição',
    manufacturer: 'Bosch',
    contactEmail: 'suporte@bosch.com.br',
    defaultWarrantyDays: 180,
  },
  {
    id: 'SUP-004',
    name: 'Gates Autopeças',
    manufacturer: 'Gates',
    contactEmail: 'sac@gates.com',
    defaultWarrantyDays: 90,
  },
  {
    id: 'SUP-005',
    name: 'NGK Brasil',
    manufacturer: 'NGK',
    contactEmail: 'sac@ngk.com.br',
    defaultWarrantyDays: 90,
  },
]

const SupplierContext = createContext<SupplierContextType | undefined>(undefined)

export function SupplierProvider({ children }: { children: React.ReactNode }) {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers)

  const addSupplier = (s: Omit<Supplier, 'id'>) => {
    const id = `SUP-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0')}`
    setSuppliers((prev) => [{ ...s, id }, ...prev])
  }

  const updateSupplier = (id: string, s: Partial<Supplier>) => {
    setSuppliers((prev) => prev.map((sup) => (sup.id === id ? { ...sup, ...s } : sup)))
  }

  const deleteSupplier = (id: string) => {
    setSuppliers((prev) => prev.filter((sup) => sup.id !== id))
  }

  return React.createElement(
    SupplierContext.Provider,
    { value: { suppliers, addSupplier, updateSupplier, deleteSupplier } },
    children,
  )
}

export function useSupplierStore() {
  const context = useContext(SupplierContext)
  if (!context) {
    throw new Error('useSupplierStore must be used within a SupplierProvider')
  }
  return context
}
