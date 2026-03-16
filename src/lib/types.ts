export type ProcessStatus =
  | 'Aguardando Autorização'
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
}

export type Role = 'Admin' | 'Vendedor' | 'Cliente'
