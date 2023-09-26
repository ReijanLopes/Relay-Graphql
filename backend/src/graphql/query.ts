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
    user: {
      name: "user",
      type: userTypeDefinition,
      args: {
        _id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: getUser,
    },
    card: {
      name: "card",
      type: cardTypeDefinition,
      args: {
        _id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: getCard,
    },
    debt: {
      name: "debt",
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
