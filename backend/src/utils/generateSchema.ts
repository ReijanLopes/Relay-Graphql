import fs from "fs";
import { printSchema, GraphQLSchema } from "graphql";

export default function generate_schemaGraphql(schema: GraphQLSchema) {
  const schemaText = printSchema(schema);

  fs.writeFile("../schema.graphql", schemaText, (err) => {
    if (err) {
      throw err;
    }
  });
}
