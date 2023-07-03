export type UserInput = {
  _id: string
  name: string
  email: string
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
  debts: [string]
  user: string
}