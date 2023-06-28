import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

const tax = {
  cet: { type: GraphQLFloat },
  type: { type: GraphQLString },
  value: { type: GraphQLFloat },
};

export const taxType = new GraphQLObjectType({
  name: "Tax",
  fields: {
    ...tax,
  },
});

export const taxInput = new GraphQLInputObjectType({
  name: "TaxInput",
  fields: {
    ...tax,
  },
});
