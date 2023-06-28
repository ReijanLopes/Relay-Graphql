import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} from "graphql";

import { cardType } from "./cardType";
import { debtType } from "./debtType";

const user = {
  _id: { type: GraphQLID },
  name: { type: GraphQLString },
  email: { type: GraphQLString },
  status: { type: GraphQLString },
};

export const userType = new GraphQLObjectType({
  name: "UserType",
  fields: {
    ...user,
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
// createdAt: { type: GraphQLString },
// updatedAt: { type: GraphQLString },
