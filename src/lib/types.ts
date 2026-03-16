export type ProcessStatus =
  | 'Pendente de Análise'
  | 'NF Recusada'
  | 'Produto Recebido'
  | 'Enviado ao Fornecedor'
  | 'Análise Crédito'
  | 'Crédito Antecipado'
  | 'Crédito Liberado'
  | 'Finalizado'

export type ProcessType = 'Devolução Comum' | 'Garantia'
export type ProductCategory = 'Amortecedor' | 'Outros'

export interface Process {
  id: string
  type: ProcessType
  customer: string
  product: string
  sku: string
  supplier: string
  seller: string
  requestDate: string
  value: number
  status: ProcessStatus
  slaDays: number
  category: ProductCategory

  // New fields for Warranty & Return
  purchaseDate?: string
  invoiceNumber?: string
  applicationDate?: string
  applicationKm?: number
  defectDate?: string
  defectKm?: number
  defectDescription?: string
  returnReason?: string
  returnDescription?: string
  otherReason?: string

  // Contact Info
  customerEmail?: string
  customerPhone?: string

  // Media & Tracking
  evidenceUrls?: string[]
}

export type Role = 'Admin' | 'Vendedor' | 'Cliente'
