const jsonSchemaToTs = require('json-schema-to-typescript');
const { compile, compileFromFile } = jsonSchemaToTs;
const path = require('path');
const fs = require('fs');

const basePath = path.join(__dirname, '../src/demo');

compileFromFile(path.join(__dirname, '../src/demo/event_schema.json'), { cwd: basePath })
  .then(ts => fs.writeFileSync(path.join(__dirname, '../src/demo/GameEvent.ts'), ts));
