export type User = {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  cards: [string];
  debts: [string];
};

export type Card = {
  _id: string;
  name: string;
  number: string;
  cpf: string;
  expiration: string;
  cvv: string;
  createdAt: string;
  updatedAt: string;
  debts: [string];
  user: string;
};
