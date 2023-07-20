export type UserInput = {
  _id: string
  name: string
  email: string
  cashDesk: number
  createdAt: string
  updatedAt: string
  cards: [string]
  debts: [string]
}

export type CardInput = {
  _id: string
  name: string
  number: string
  cpf: string
  expiration: string
  cvv: number
  createdAt: string
  updatedAt: string
  debts: string
  user: string
}

export type DebtInput = {
  _id: string
  value: number
  cashback: number
  numberOfInstallments: number
  totalValue: number
  cet: number
  createdAt: string
  updatedAt: string
  user: string
  card: string
  tax: string
  installments: [InstallmentsInput]
}

export type InstallmentsInput = {
  status: string
  idMonth: number
  value: number
  expires: string
  createdAt: string
  updatedAt: string
}