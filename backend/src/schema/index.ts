import { GraphQLSchema } from "graphql";

import query from "./query";
import mutation from "./mutation";
import generateSchema_graphql from "../utils/generateSchema";

export const schema = new GraphQLSchema({
  query,
  mutation,
});

generateSchema_graphql(schema);
