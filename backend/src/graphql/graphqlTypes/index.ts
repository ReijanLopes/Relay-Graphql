import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLBoolean,
} from "graphql";

const timestamps = {
  createdAt: { type: GraphQLString },
  updatedAt: { type: GraphQLString },
};

const user = {
  _id: { type: GraphQLID },
  name: { type: GraphQLString },
  email: { type: GraphQLString },
  ...timestamps,
};

const card = {
  _id: { type: GraphQLID },
  name: { type: GraphQLString },
  number: { type: GraphQLString },
  cpf: { type: GraphQLString },
  expiration: { type: GraphQLString },
  cvv: { type: GraphQLInt },
  ...timestamps,
};

export const debt = {
  _id: { type: GraphQLID },
  value: { type: GraphQLFloat },
  cashback: { type: GraphQLFloat },
  numberOfInstallments: { type: GraphQLInt },
  totalValue: { type: GraphQLFloat },
  cet: { type: GraphQLFloat },
  ...timestamps,
};

export const installment = {
  status: { type: GraphQLString },
  idMonth: { type: GraphQLInt },
  value: { type: GraphQLFloat },
  expires: { type: GraphQLString },
  ...timestamps,
};

const tax = {
  cet: { type: GraphQLFloat },
  type: { type: GraphQLString },
  value: { type: GraphQLFloat },
};

const userType = new GraphQLObjectType({
  name: "UserType",
  description: "Default user type",
  fields: {
    ...user,
  },
});

const cardType = new GraphQLObjectType({
  name: "CardType",
  description: "Default card type",
  fields: {
    ...card,
  },
});

const installmentType = new GraphQLObjectType({
  name: "InstallmentsType",
  description: "Default card type",
  fields: {
    ...installment,
  },
});

const taxType = new GraphQLObjectType({
  name: "TaxType",
  fields: {
    ...tax,
  },
});

const debtType = new GraphQLObjectType({
  name: "DebtType",
  fields: {
    ...debt,
    installments: { type: new GraphQLList(installmentType) },
  },
});

export const userTypeDefinition = new GraphQLObjectType({
  name: "User",
  fields: {
    ...user,
    cards: { type: new GraphQLList(cardType) },
    debts: { type: new GraphQLList(debtType) },
  },
});

export const cardTypeDefinition = new GraphQLObjectType({
  name: "Card",
  fields: {
    ...card,
    debts: { type: new GraphQLList(debtType) },
    user: { type: userType },
  },
});

export const debtTypeDefinition = new GraphQLObjectType({
  name: "Debt",
  fields: {
    ...debt,
    installments: { type: new GraphQLList(installmentType) },
    tax: { type: taxType },
    user: { type: userType },
    card: { type: cardType },
  },
});

export const userInput = new GraphQLInputObjectType({
  name: "UserInput",
  fields: {
    ...user,
    cards: { type: new GraphQLList(GraphQLString) },
    debts: { type: new GraphQLList(GraphQLString) },
  },
});

export const cardInput = new GraphQLInputObjectType({
  name: "CardInput",
  fields: {
    ...card,
    debts: { type: new GraphQLList(GraphQLID) },
    user: { type: GraphQLID },
  },
});

export const taxInput = new GraphQLInputObjectType({
  name: "TaxInput",
  fields: {
    ...tax,
  },
});

export const installmentInput = new GraphQLInputObjectType({
  name: "InstallmentsInput",
  fields: {
    ...installment,
  },
});

export const debtInput = new GraphQLInputObjectType({
  name: "DebtInput",
  fields: {
    ...debt,
    user: { type: GraphQLID },
    card: { type: GraphQLID },
    tax: { type: GraphQLID },
    installments: { type: new GraphQLList(installmentInput) },
  },
});

export const deleteMessage = new GraphQLObjectType({
  name: "DeleteMessage",
  fields: {
    message: { type: GraphQLBoolean },
  },
});
