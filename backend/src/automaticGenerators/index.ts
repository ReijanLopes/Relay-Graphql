import fs from "fs";
import path from "path";
import { printSchema, GraphQLSchema } from "graphql";

function generate_typesInput(schemaText: string) {
  const typesInput = schemaText
    .replace(/type\s\w+\s\{[^}]+\}/g, "")
    .replace(/input\s(\w+\s\{[^}]+\})/g, "export type $1")
    .replace(/{/g, "= {")
    .replace(/""".+?"""/gs, "")
    .replace(/\b(Float|Int)\b/g, "number")
    .replace(/\b(ID|String)\b/g, "string")
    .trim();

  const directoryPath = path.join(__dirname, "../types");
  fs.mkdir(directoryPath, () => {
    const filePath = path.join(directoryPath, "index.ts");
    fs.writeFile(filePath, typesInput, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
}

function generate_schemaGraphql(schemaText: string) {
  fs.writeFile("../schema.graphql", schemaText, (err) => {
    if (err) {
      throw err;
    }
  });
}

export default function automaticGenerators(schema: GraphQLSchema) {
  const schemaText = printSchema(schema);
  generate_schemaGraphql(schemaText);
  generate_typesInput(schemaText);
}
