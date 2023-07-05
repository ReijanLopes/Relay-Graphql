import { GraphQLObjectType } from "graphql";
import { debtTypeDefinition, debtInput } from "./graphqlTypes";

import pubsub from "../redis";

const subscription = new GraphQLObjectType({
  name: "Subscription",
  description: "Root of all subscription",
  fields: {
    debtAdded: {
      type: debtTypeDefinition,
      args: {
        input: { type: debtInput },
      },
      subscribe: () => pubsub.asyncIterator("DEBT_ADDED"),
      resolve: (payload) => {
        return payload.debtAdded;
      },
    },
  },
});

export default subscription;
