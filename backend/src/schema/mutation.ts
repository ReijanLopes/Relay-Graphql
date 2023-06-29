import { GraphQLBoolean, GraphQLID, GraphQLObjectType } from "graphql";

import { deleteUser, mutationUser } from "./resolvers/userResolvers";
import { mutationCard } from "./resolvers/cardResolvers";

import {
  cardInput,
  cardTypeDefinition,
  userInput,
  userTypeDefinition,
} from "./types";

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
    deleteUser: {
      type: GraphQLBoolean,
      args: {
        _id: { type: GraphQLID },
      },
      resolve: deleteUser,
    },
  },
});

export default mutation;
