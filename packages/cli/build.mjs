/**
 * build.mjs
 * Compiles all JSX source files into a single plain-JS bundle in dist/cli.js
 * Run: node build.mjs
 */

import { build } from 'esbuild';
import { mkdirSync } from 'fs';

mkdirSync('./dist', { recursive: true });

await build({
  entryPoints: ['src/main.js'],   // entry that calls render() — not just the component
  bundle:      true,              // inline all imports
  platform:    'node',           // target Node.js (not browser)
  format:      'esm',            // keep ES modules
  outfile:     'dist/main.js',   // output single bundled runnable file
  jsx:         'automatic',      // transform JSX → React.createElement automatically
  jsxImportSource: 'react',      // use react as JSX runtime
  target:      'node18',         // minimum Node version
  packages:    'external',       // keep node_modules external (don't bundle them)
  loader:      { '.js': 'jsx' }, // treat .js files as JSX
  banner:      { js: '#!/usr/bin/env node' }, // Add shebang so npx execution works
  logLevel:    'info',
});

console.log('✅ Build complete → dist/cli.js');
