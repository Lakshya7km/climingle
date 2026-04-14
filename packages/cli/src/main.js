/**
 * main.js — Real entry point.
 * This gets bundled by esbuild → dist/main.js
 * Run: node dist/main.js
 */

import { render } from 'ink';
import React from 'react';
import App from './app.js';

// Clear screen for a clean start
process.stdout.write('\x1Bc');

render(React.createElement(App), {
  exitOnCtrlC: true,
});
