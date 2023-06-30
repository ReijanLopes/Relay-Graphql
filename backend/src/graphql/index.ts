import { GraphQLSchema } from "graphql";

import query from "./query";
import mutation from "./mutation";
import generate_schemaGraphql from "../utils/generateSchema";

export const schema = new GraphQLSchema({
  query,
  mutation,
});

generate_schemaGraphql(schema);
