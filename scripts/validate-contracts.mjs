import { readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const root = fileURLToPath(new URL("../", import.meta.url));
const schemaDirectory = join(root, "schemas");
const exampleDirectory = join(root, "examples");
const readJSON = (path) => JSON.parse(readFileSync(path, "utf8"));

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);

const schemas = new Map();
for (const filename of readdirSync(schemaDirectory).filter((name) => name.endsWith(".json"))) {
  const schema = readJSON(join(schemaDirectory, filename));
  schemas.set(filename, schema);
  ajv.addSchema(schema, filename);
}

for (const filename of schemas.keys()) {
  if (!ajv.getSchema(filename)) throw new Error(`Schema did not compile: ${filename}`);
}

const examples = [
  ["true950-load-content-request-v1.json", "true950-load-content-request-v1.json"],
  ["aim-export-program-request-v1.json", "aim-export-program-request-v1.json"],
  ["aim-export-program-completed-response-v1.json", "operation-response-v1.json"]
];

for (const [exampleName, schemaName] of examples) {
  const validate = ajv.getSchema(schemaName);
  const examplePath = join(exampleDirectory, exampleName);
  if (!validate(readJSON(examplePath))) {
    throw new Error(`${basename(examplePath)} is invalid:\n${ajv.errorsText(validate.errors, { separator: "\n" })}`);
  }
  console.log(`valid  examples/${exampleName}`);
}

console.log(`compiled ${schemas.size} schemas`);
