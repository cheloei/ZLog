import fs from 'fs';
import path from 'path';
import { minify } from 'terser';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

// ==================== Helper: Walk Directory ====================
function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, callback);
    } else {
      callback(fullPath);
    }
  }
}

// ==================== Minify .js files with terser ====================
async function minifyJsFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`⚠️ Directory not found: ${dir}`);
    return;
  }

  const jsFiles = [];
  walkDir(dir, (filePath) => {
    if (filePath.endsWith('.js')) {
      jsFiles.push(filePath);
    }
  });

  if (jsFiles.length === 0) {
    console.log(`⚠️ No JS files found in ${dir}`);
    return;
  }

  for (const filePath of jsFiles) {
    const code = fs.readFileSync(filePath, 'utf8');
    try {
      const result = await minify(code, {
        compress: { passes: 2, unsafe: true },
        mangle: { keep_fnames: false },
        sourceMap: false,
        output: { beautify: false },
      });
      if (result.code) {
        fs.writeFileSync(filePath, result.code, 'utf8');
        const original = (code.length / 1024).toFixed(1);
        const minified = (result.code.length / 1024).toFixed(1);
        console.log(`✅ JS  ${path.relative(rootDir, filePath)}: ${original}KB → ${minified}KB`);
      }
    } catch (err) {
      console.error(`❌ Error in ${filePath}:`, err.message);
    }
  }
}

// ==================== Minify .d.ts files (remove whitespace & comments) ====================
function minifyDtsFiles(dir) {
  if (!fs.existsSync(dir)) return;

  const dtsFiles = [];
  walkDir(dir, (filePath) => {
    if (filePath.endsWith('.d.ts')) {
      dtsFiles.push(filePath);
    }
  });

  if (dtsFiles.length === 0) return;

  for (const filePath of dtsFiles) {
    const code = fs.readFileSync(filePath, 'utf8');
    let minified = code
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*/g, '')
      .replace(/\s+/g, ' ')
      .replace(/;\s*}/g, '}')
      .replace(/\}\s*else\s*\{/g, '}else{')
      .trim();

    if (minified.length < code.length) {
      fs.writeFileSync(filePath, minified, 'utf8');
      const original = (code.length / 1024).toFixed(1);
      const minifiedSize = (minified.length / 1024).toFixed(1);
      console.log(`✅ DTS ${path.relative(rootDir, filePath)}: ${original}KB → ${minifiedSize}KB`);
    }
  }
}

// ==================== Main ====================
(async () => {
  console.log('🔧 Minifying files in dist/ ...\n');

  // 1. Minify dist/esm
  console.log('📁 Processing dist/esm ...');
  await minifyJsFiles(path.resolve(rootDir, 'dist/esm'));
  minifyDtsFiles(path.resolve(rootDir, 'dist/esm'));

  // 2. Minify dist/cjs
  console.log('\n📁 Processing dist/cjs ...');
  await minifyJsFiles(path.resolve(rootDir, 'dist/cjs'));
  minifyDtsFiles(path.resolve(rootDir, 'dist/cjs'));

  console.log('\n🎉 All dist files minified (src untouched)!');
})();