import { GraphQLObjectType } from "graphql";

export const mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "The root of all mutations",
  fields: () => ({}),
});
