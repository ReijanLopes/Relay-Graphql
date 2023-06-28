import { GraphQLID, GraphQLObjectType } from "graphql";

import user from "../models/user";

import { userTypeDefinition } from "./types/userType";
import { cardTypeDefinition } from "./types/cardType";

export const query = new GraphQLObjectType({
  name: "Query",
  description: "Root of all queries",
  fields: () => ({
    getUser: {
      name: "getUser",
      type: userTypeDefinition,
      args: {
        _id: {
          type: GraphQLID,
        },
      },
      resolve: async (_, args) => {
        return await user
          .findById({ _id: args?._id })
          .populate("cards")
          .populate("debts");
      },
    },
    getCard: {
      name: "getCard",
      type: cardTypeDefinition,
      args: {
        _id: {
          type: GraphQLID,
        },
      },
      resolve: async (_, args) => {},
    },
  }),
});
