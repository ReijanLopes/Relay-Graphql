import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLInputObjectType,
} from "graphql";

import { userType } from "./userType";
import { debtType } from "./debtType";
import { TimestampInterface, timestamps } from "./timestampType";

const card = {
  _id: { type: GraphQLID },
  name: { type: GraphQLString },
  number: { type: GraphQLString },
  cpf: { type: GraphQLString },
  expiration: { type: GraphQLString },
  cvv: { type: GraphQLString },
};

export const cardType = new GraphQLObjectType({
  name: "CardType",
  interfaces: [TimestampInterface],
  fields: {
    ...card,
  },
});

export const cardInput = new GraphQLInputObjectType({
  name: "cardInput",
  fields: {
    ...card,
    ...timestamps,
    debts: { type: new GraphQLList(GraphQLID) },
    user: { type: GraphQLID },
  },
});

export const cardTypeDefinition = new GraphQLObjectType({
  name: "Card",
  fields: {
    ...card,
    ...timestamps,
    debts: { type: new GraphQLList(debtType) },
    user: { type: userType },
  },
});

// createdAt: { type: GraphQLString },
// updatedAt: { type: GraphQLString },

// remova todos os status
