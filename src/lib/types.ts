export type ProcessStatus =
  | 'Pendente de Análise'
  | 'NF Recusada'
  | 'Autorizado emissão da nota fiscal'
  | 'Nota Fiscal em Análise'
  | 'Envio da Mercadoria Autorizado'
  | 'Produto Recebido'
  | 'Conferência de Estoque'
  | 'Crédito Recusado'
  | 'Enviado ao Fornecedor'
  | 'Aguardando Créditos'
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
  returnInvoiceUrl?: string
  returnInvoiceName?: string

  // Credit Management
  creditDecisionReason?: string
  supplierCreditReceived?: boolean
  customerCreditReleased?: boolean
  creditAnticipated?: boolean
}

export type Role = 'Admin' | 'Vendedor' | 'Cliente'
