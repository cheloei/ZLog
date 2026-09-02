/**
 * @file Post-build script to ensure CJS output is properly recognized.
 * Creates a package.json inside dist/cjs with "type": "commonjs"
 * so Node.js treats all .cjs files in that directory as CommonJS.
 */

import { mkdir, writeFile } from "node:fs/promises";

await mkdir("dist/cjs", { recursive: true });

await writeFile(
  "dist/cjs/package.json",
  JSON.stringify({ type: "commonjs" })
);

console.log("✅ Created dist/cjs/package.json with type: commonjs");