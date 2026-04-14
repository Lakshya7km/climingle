/**
 * test-connection.mjs
 * Simulates two users connecting to the relay, getting matched,
 * and exchanging a message. Pure console output — no UI needed.
 *
 * Run: node test-connection.mjs
 */

import WebSocket from 'ws';

const RELAY = 'ws://localhost:3001';

const log = (label, color, msg) => {
  const colors = { cyan: '\x1b[36m', green: '\x1b[32m', yellow: '\x1b[33m', red: '\x1b[31m', gray: '\x1b[90m', reset: '\x1b[0m', bold: '\x1b[1m' };
  console.log(`${colors[color]}${colors.bold}[${label}]${colors.reset} ${msg}`);
};

let passed = 0;
let failed = 0;

function check(label, condition, details = '') {
  if (condition) {
    log('✅ PASS', 'green', label + (details ? ` — ${details}` : ''));
    passed++;
  } else {
    log('❌ FAIL', 'red', label + (details ? ` — ${details}` : ''));
    failed++;
  }
}

async function runTest() {
  console.log('\n\x1b[36m\x1b[1m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m');
  console.log('\x1b[36m\x1b[1m  CliMingle — Connection Test Suite\x1b[0m');
  console.log('\x1b[36m\x1b[1m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n');

  // ── Test 1: Relay health check ────────────────────────────────────────────
  log('TEST 1', 'cyan', 'Checking relay health endpoint...');
  try {
    const res  = await fetch('http://localhost:3001/health');
    const data = await res.json();
    check('Relay is reachable',      res.ok,              `status: ${res.status}`);
    check('Health returns "ok"',     data.status === 'ok', `got: ${data.status}`);
    check('Queue count is a number', typeof data.queue === 'number', `queue: ${data.queue}`);
  } catch (e) {
    check('Relay is reachable', false, `Error: ${e.message} — is the relay running?`);
    console.log('\n\x1b[31mAborting — relay is not running. Start it with:\x1b[0m');
    console.log('  cd packages/relay && node server.js\n');
    process.exit(1);
  }

  // ── Test 2: WebSocket connects ────────────────────────────────────────────
  console.log();
  log('TEST 2', 'cyan', 'Connecting User A via WebSocket...');

  await new Promise((resolve) => {
    const userA = new WebSocket(RELAY);
    let userA_connected = false;
    let userA_queued    = false;
    let userA_matched   = false;

    userA.on('open', () => {
      userA_connected = true;
      check('User A WebSocket connected', true, 'ws://localhost:3001');

      // Join matchmaking
      userA.send(JSON.stringify({
        type:      'join',
        name:      'TestUserA',
        interests: ['javascript', 'leetcode'],
      }));
      log('INFO', 'gray', 'User A sent join with interests: javascript, leetcode');
    });

    userA.on('message', (raw) => {
      const msg = JSON.parse(raw.toString());
      log('INFO', 'gray', `User A received: type="${msg.type}"`);

      if (msg.type === 'queue') {
        userA_queued = true;
        check('User A entered the queue', true, `online devs in queue: ${msg.online}`);

        // Now connect User B
        console.log();
        log('TEST 3', 'cyan', 'Connecting User B via WebSocket...');
        connectUserB(userA, (matched) => {
          userA_matched = matched;
        });
      }

      if (msg.type === 'connected') {
        userA_matched = true;
        check('User A matched!', true, `Partner: ${msg.partnerName} | Interests: ${(msg.partnerInterests || []).join(', ')}`);
      }
    });

    userA.on('error', (e) => {
      check('User A WebSocket connected', false, e.message);
      resolve();
    });

    // Give 8 seconds for full test to complete
    setTimeout(() => {
      if (!userA_connected) check('User A WebSocket connected', false, 'timeout');
      if (!userA_queued)    check('User A entered the queue',   false, 'timeout — never received queue event');
      if (!userA_matched)   check('User A matched!',            false, 'timeout — nobody to match with?');
      userA.close();
      resolve();
    }, 8000);
  });

  // ── Test 4: ANSI injection stripping ─────────────────────────────────────
  console.log();
  log('TEST 4', 'cyan', 'Testing ANSI injection protection...');

  const ANSI_REGEX = /\x1b\[[0-9;]*[A-Za-z]|\x1b\][^\x07]*\x07?|\x1b[@-Z\\-_]/g;
  const ESC = '\u001b'; // actual ESC byte
  const malicious = `${ESC}[2J${ESC}[?1049h CLEAR YOUR SCREEN evil payload here`;
  const sanitized = malicious.replace(ANSI_REGEX, '').trim();
  check(
    'ANSI escape codes stripped from message',
    !sanitized.includes(ESC),
    `stripped to: "${sanitized}"`
  );
  check('Stripped text still has safe content', sanitized.length > 0, sanitized);

  // ── Results ───────────────────────────────────────────────────────────────
  console.log('\n\x1b[1m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m');
  const all = passed + failed;
  console.log(`\x1b[1m  Results: ${passed}/${all} tests passed\x1b[0m`);
  if (failed === 0) {
    console.log('\x1b[32m\x1b[1m  ✅ All systems go! CliMingle is working.\x1b[0m');
  } else {
    console.log(`\x1b[31m\x1b[1m  ❌ ${failed} test(s) failed — check output above.\x1b[0m`);
  }
  console.log('\x1b[1m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n');
  process.exit(failed > 0 ? 1 : 0);
}

function connectUserB(userA, onMatched) {
  const userB = new WebSocket(RELAY);
  let userB_connected = false;
  let messageReceived = false;

  userB.on('open', () => {
    userB_connected = true;
    check('User B WebSocket connected', true, 'ws://localhost:3001');

    userB.send(JSON.stringify({
      type:      'join',
      name:      'TestUserB',
      interests: ['javascript', 'system-design'], // overlapping interest: javascript
    }));
    log('INFO', 'gray', 'User B sent join with interests: javascript, system-design');
  });

  userB.on('message', (raw) => {
    const msg = JSON.parse(raw.toString());
    log('INFO', 'gray', `User B received: type="${msg.type}"`);

    if (msg.type === 'queue') {
      check('User B entered the queue', true, `online devs in queue: ${msg.online}`);
    }

    if (msg.type === 'connected') {
      check('User B matched!', true, `Partner: ${msg.partnerName} | Interests: ${(msg.partnerInterests || []).join(', ')}`);
      onMatched(true);

      // ── Test 3b: Send a message from B → A ──────────────────────────────
      console.log();
      log('TEST 5', 'cyan', 'Testing message delivery (B → A)...');
      userB.send(JSON.stringify({ type: 'message', text: 'hello from TestUserB!' }));
      log('INFO', 'gray', 'User B sent: "hello from TestUserB!"');

      // Listen on A for the message
      userA.on('message', (raw2) => {
        const m2 = JSON.parse(raw2.toString());
        if (m2.type === 'message') {
          messageReceived = true;
          check('Message delivered A←B', true, `received: "${m2.text}"`);
          check('Message content intact', m2.text === 'hello from TestUserB!', m2.text);
          userA.close();
          userB.close();
        }
      });

      setTimeout(() => {
        if (!messageReceived) {
          check('Message delivered A←B', false, 'timeout — message never arrived');
          userA.close();
          userB.close();
        }
      }, 3000);
    }
  });

  userB.on('error', (e) => {
    check('User B WebSocket connected', false, e.message);
  });
}

runTest().catch(console.error);
