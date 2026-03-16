import React, { createContext, useContext, useState } from 'react'
import { Process, ProcessStatus, Role } from '@/lib/types'
import { mockProcesses } from '@/lib/mock'

interface ProcessContextType {
  processes: Process[]
  role: Role
  setRole: (role: Role) => void
  addProcess: (p: Process) => void
  updateStatus: (id: string, status: ProcessStatus) => void
}

const ProcessContext = createContext<ProcessContextType | undefined>(undefined)

export function ProcessProvider({ children }: { children: React.ReactNode }) {
  const [processes, setProcesses] = useState<Process[]>(mockProcesses)
  const [role, setRole] = useState<Role>('Admin')

  const addProcess = (p: Process) => {
    setProcesses((prev) => [p, ...prev])
  }

  const updateStatus = (id: string, status: ProcessStatus) => {
    setProcesses((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))
  }

  return React.createElement(
    ProcessContext.Provider,
    { value: { processes, role, setRole, addProcess, updateStatus } },
    children,
  )
}

export function useProcessStore() {
  const context = useContext(ProcessContext)
  if (!context) {
    throw new Error('useProcessStore must be used within a ProcessProvider')
  }
  return context
}
