#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const MODULE_ORDER = [
  'js/state.js',
  'js/audio.js',
  'js/svg-art.js',
  'js/data/glossary.js',
  'js/data/episodes.js',
  'js/main.js',
];

function stripModuleSyntax(source) {
  // Remove single-line and multi-line ES import statements
  let out = source.replace(/^\s*import\s+[\s\S]*?from\s+['"][^'"]+['"];\s*\r?\n?/gm, '');
  // Remove side-effect-only imports if any
  out = out.replace(/^\s*import\s+['"][^'"]+['"];\s*\r?\n?/gm, '');
  // Strip leading `export ` on declarations
  out = out.replace(/^\s*export\s+(?=(?:async\s+)?(?:function|const|let|var|class)\b)/gm, '');
  return out.trim();
}

const chunks = MODULE_ORDER.map((relPath) => {
  const fullPath = path.join(rootDir, relPath);
  const raw = fs.readFileSync(fullPath, 'utf8');
  const transformed = stripModuleSyntax(raw);
  return `  // === ${relPath} ===\n${transformed}`;
});

const bundle = `(function () {\n  "use strict";\n${chunks.join('\n\n')}\n})();\n`;
const outPath = path.join(rootDir, 'js/bundle.js');
fs.writeFileSync(outPath, bundle, 'utf8');
console.log(`Built ${path.relative(rootDir, outPath)} (${Buffer.byteLength(bundle, 'utf8')} bytes)`);
