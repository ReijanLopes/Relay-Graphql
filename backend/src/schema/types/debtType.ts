import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
  GraphQLInt,
  GraphQLInputObjectType,
} from "graphql";

import { cardType } from "./cardType";
import { userType } from "./userType";
import { taxType } from "./taxType";

const installment = {
  status: { type: GraphQLString },
  idMonth: { type: GraphQLInt },
  value: { type: GraphQLFloat },
  expires: { type: GraphQLString },
};

const installmentType = new GraphQLObjectType({
  name: "Installments",
  fields: {
    ...installment,
  },
});

const installmentInput = new GraphQLInputObjectType({
  name: "InstallmentsInput",
  fields: {
    ...installment,
  },
});

const debt = {
  _id: { type: GraphQLID },
  value: { type: GraphQLFloat },
  cashback: { type: GraphQLFloat },
  numberOfInstallments: { type: GraphQLInt },
  totalValue: { type: GraphQLFloat },
  cet: { type: GraphQLFloat },
};

export const debtType = new GraphQLObjectType({
  name: "DebtType",
  fields: {
    ...debt,
    installments: { type: new GraphQLList(installmentType) },
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

// createdAt: { type: GraphQLString },
// updatedAt: { type: GraphQLString },
