/**
 * matchmaker.js
 * FIFO queue with interest overlap + subnet proximity scoring.
 *
 * Score formula:
 *   score = (interest_overlap / max_interests) * 0.70
 *           + subnet_match * 0.20    ← same /24 subnet
 *           + 0.10 (constant warmth bias when any overlap exists)
 *
 * Matching rules:
 *   1. Score >= 0.30 → instant pair
 *   2. Candidate waited > 5s with any score → FIFO pair
 *   3. Nobody in queue → wait and retry on next join
 */

const sessionBridge = require('./sessionBridge');
const WebSocket      = require('ws');
const analytics      = require('./analytics');

/** @type {WebSocket[]} */
const queue = [];

// ─── Scoring ─────────────────────────────────────────────────────────────────

function scoreMatch(a, b) {
  const aSet = new Set(a.interests);
  const bSet = new Set(b.interests);

  const overlap     = [...aSet].filter(i => bSet.has(i)).length;
  const maxPossible = Math.max(aSet.size, bSet.size, 1);
  const interestScore = (overlap / maxPossible) * 0.70;

  // Subnet proximity: compare first 3 octets of IPv4
  const subnet = (ip) => (ip || '').split('.').slice(0, 3).join('.');
  const subnetBonus = subnet(a.clientIp) === subnet(b.clientIp) &&
                      subnet(a.clientIp) !== '' ? 0.20 : 0;

  return interestScore + subnetBonus;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Add a user to the matchmaking queue.
 * Immediately tries to find the best match.
 */
function join(ws) {
  if (ws.readyState !== WebSocket.OPEN) return;

  // Remove from queue if already waiting (re-join after /next)
  remove(ws);

  ws.joinedQueueAt = Date.now();

  // ── Scan for best match ──────────────────────────────────────────────────
  let bestMatch = null;
  let bestScore = -1;

  for (const candidate of queue) {
    if (candidate === ws) continue;
    if (candidate.readyState !== WebSocket.OPEN) continue;

    const score = scoreMatch(ws, candidate);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = candidate;
    }
  }

  const now = Date.now();

  if (bestMatch) {
    const waited = now - bestMatch.joinedQueueAt;
    // Pair if score is good OR candidate has waited long enough (FIFO fallback)
    if (bestScore >= 0.30 || waited > 5000) {
      remove(bestMatch);
      analytics.track('match', ws.clientIp);
      analytics.track('match', bestMatch.clientIp);
      sessionBridge.bridge(ws, bestMatch);
      broadcastQueueSize();
      return;
    }
  }

  // ── Nobody to match yet — join queue ────────────────────────────────────
  queue.push(ws);

  // Notify THIS user first (they need to know queue size before broadcast)
  safeSend(ws, { type: 'queue', online: queue.length });

  // Then broadcast new queue size to everyone else
  broadcastQueueSize();

  // FIFO timer: after 5s try to pair with whoever is first in queue

  const timer = setTimeout(() => {
    if (!queue.includes(ws)) return; // already matched

    // Find ANY available partner
    const partner = queue.find(u => u !== ws && u.readyState === WebSocket.OPEN);
    if (partner) {
      remove(partner);
      remove(ws);
      analytics.track('match', ws.clientIp);
      analytics.track('match', partner.clientIp);
      sessionBridge.bridge(ws, partner);
      broadcastQueueSize();
    }
  }, 5000);

  // Store timer so we can cancel if matched earlier
  ws._matchTimer = timer;
}

/**
 * Remove a user from the queue (disconnect, quit, or matched).
 */
function remove(ws) {
  const idx = queue.indexOf(ws);
  if (idx !== -1) {
    queue.splice(idx, 1);
    if (ws._matchTimer) {
      clearTimeout(ws._matchTimer);
      ws._matchTimer = null;
    }
  }
}

function queueSize() {
  return queue.length;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function broadcastQueueSize() {
  const msg = JSON.stringify({ type: 'queue', online: queue.length });
  for (const ws of queue) {
    if (ws.readyState === WebSocket.OPEN) ws.send(msg);
  }
}

function safeSend(ws, obj) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(obj));
  }
}

module.exports = { join, remove, queueSize };
