import { GraphQLInterfaceType, GraphQLString } from "graphql";

export const timestamps = {
  createdAt: { type: GraphQLString },
  updatedAt: { type: GraphQLString },
};

export const TimestampInterface = new GraphQLInterfaceType({
  name: "Timestamp",
  fields: () => ({
    ...timestamps,
  }),
});
