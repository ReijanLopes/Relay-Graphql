import fs from "fs";
import { printSchema, GraphQLSchema } from "graphql";

const generateSchema_graphql = (schema: GraphQLSchema) => {
  const schemaText = printSchema(schema);
  console.log(schemaText);
  fs.writeFile("../schema.graphql", schemaText, () => {});
};

export default generateSchema_graphql;
