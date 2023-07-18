import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";

import { getCard } from "./resolvers/cardResolvers";
import { getDebt } from "./resolvers/debtResolvers";
import { getUser, listUser } from "./resolvers/userResolvers";

import {
  cardTypeDefinition,
  debtTypeDefinition,
  userTypeDefinition,
} from "./graphqlTypes";

const query = new GraphQLObjectType({
  name: "Query",
  description: "Root of all queries",
  fields: () => ({
    getUser: {
      name: "getUser",
      type: userTypeDefinition,
      args: {
        _id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: getUser,
    },
    getCard: {
      name: "getCard",
      type: cardTypeDefinition,
      args: {
        _id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: getCard,
    },
    getDebt: {
      name: "getDebt",
      type: debtTypeDefinition,
      args: {
        _id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: getDebt,
    },
    listUser: {
      name: "listUser",
      type: new GraphQLList(userTypeDefinition),
      args: {
        cards: {
          type: GraphQLID,
        },
        debts: {
          type: GraphQLID,
        },
      },
      resolve: listUser,
    },
  }),
});

export default query;
