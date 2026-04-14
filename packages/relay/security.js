/**
 * security.js
 * Two protections:
 *   1. ANSI escape injection stripping  — terminal's equivalent of XSS
 *   2. Per-socket rate limiting          — 3 messages/second max
 *   3. /next cooldown                   — prevents rapid socket recycling
 */

// Covers: CSI sequences (\x1b[...m), OSC sequences (\x1b]...\x07), bare ESC sequences
const ANSI_REGEX = /\x1b\[([\d;]*)([A-Za-z])|(\x1b\][^\x07]*\x07)|(\x1b[^[\]])/g;

const MAX_MESSAGE_LENGTH = 500;
const MAX_MSGS_PER_SECOND = 3;
const MAX_NAME_LENGTH = 20;

/**
 * Strip ANSI escape codes and trim to max length.
 * @param {string} text
 * @returns {string}
 */
function sanitize(text) {
  if (typeof text !== 'string') return '';
  return text.replace(ANSI_REGEX, '').slice(0, MAX_MESSAGE_LENGTH).trim();
}

/**
 * Sanitize display name — alphanumeric + a few chars only.
 * @param {string} name
 * @returns {string}
 */
function sanitizeName(name) {
  if (typeof name !== 'string') return 'Anonymous';
  return name
    .replace(ANSI_REGEX, '')
    .replace(/[^a-zA-Z0-9_\-]/g, '')
    .slice(0, MAX_NAME_LENGTH) || 'Anonymous';
}

// ─── Rate Limiting ────────────────────────────────────────────────────────────
/** @type {Map<WebSocket, number[]>} */
const rateLimitMap = new Map();

/**
 * Returns true if this socket is sending too fast (should be dropped).
 * @param {import('ws').WebSocket} ws
 * @returns {boolean}
 */
function isRateLimited(ws) {
  const now     = Date.now();
  const history = rateLimitMap.get(ws) || [];
  const recent  = history.filter(t => now - t < 1000);
  rateLimitMap.set(ws, [...recent, now]);
  return recent.length >= MAX_MSGS_PER_SECOND;
}

/**
 * Clean up rate limit state when socket closes.
 * @param {import('ws').WebSocket} ws
 */
function clearRateLimit(ws) {
  rateLimitMap.delete(ws);
}

// ─── /next Cooldown ───────────────────────────────────────────────────────────
/** @type {Map<WebSocket, boolean>} */
const cooldownMap = new Map();

/**
 * Execute fn after cooldown period if not already cooling down.
 * @param {import('ws').WebSocket} ws
 * @param {number} ms
 * @param {Function} fn
 */
function cooldown(ws, ms, fn) {
  if (cooldownMap.get(ws)) return; // already cooling down, ignore
  cooldownMap.set(ws, true);
  fn();
  setTimeout(() => cooldownMap.delete(ws), ms);
}

module.exports = { sanitize, sanitizeName, isRateLimited, clearRateLimit, cooldown };
