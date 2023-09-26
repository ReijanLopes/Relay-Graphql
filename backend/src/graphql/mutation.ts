import { GraphQLID, GraphQLObjectType } from "graphql";

import { deleteUser, createAndUpdateUser } from "./resolvers/userResolvers";
import { createAndUpdateCard } from "./resolvers/cardResolvers";
import { createAndUpdateDebt } from "./resolvers/debtResolvers";

import {
  cardInput,
  cardTypeDefinition,
  userInput,
  userTypeDefinition,
  deleteMessage,
  debtTypeDefinition,
  debtInput,
} from "./graphqlTypes";

const mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "The root of all mutations",
  fields: {
    createAndUpdateUser: {
      type: userTypeDefinition,
      args: {
        input: { type: userInput },
      },
      resolve: createAndUpdateUser,
    },
    createAndUpdateCard: {
      type: cardTypeDefinition,
      args: {
        input: { type: cardInput },
      },
      resolve: createAndUpdateCard,
    },
    createAndUpdateDebt: {
      type: debtTypeDefinition,
      args: {
        input: { type: debtInput },
      },
      resolve: createAndUpdateDebt,
    },
    deleteUser: {
      type: deleteMessage,
      args: {
        _id: { type: GraphQLID },
      },
      resolve: deleteUser,
    },
  },
});

export default mutation;
