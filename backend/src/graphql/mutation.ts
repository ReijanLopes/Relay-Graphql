import { GraphQLID, GraphQLObjectType } from "graphql";

import { deleteUser, mutationUser } from "./resolvers/userResolvers";
import { mutationCard } from "./resolvers/cardResolvers";

import {
  cardInput,
  cardTypeDefinition,
  userInput,
  userTypeDefinition,
  deleteMessage,
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
