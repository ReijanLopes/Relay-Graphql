import { GraphQLID, GraphQLObjectType } from "graphql";

import { deleteUser, mutationUser } from "./resolvers/userResolvers";
import { mutationCard } from "./resolvers/cardResolvers";
import { mutationDebt } from "./resolvers/debtResolvers";

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
    mutationUser: {
      type: userTypeDefinition,
      args: {
        input: { type: userInput },
      },
      resolve: mutationUser,
    },
    mutationCard: {
      type: cardTypeDefinition,
      args: {
        input: { type: cardInput },
      },
      resolve: mutationCard,
    },
    mutationDebt: {
      type: debtTypeDefinition,
      args: {
        input: { type: debtInput },
      },
      resolve: mutationDebt,
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
