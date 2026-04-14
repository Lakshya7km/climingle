/**
 * sessionBridge.js
 * Pairs two WebSocket clients and notifies them.
 * On disconnect, notifies the remaining partner.
 */

const WebSocket = require('ws');

/**
 * Bridge two sockets together.
 * Stores a .partner reference on each socket.
 */
function bridge(a, b) {
  a.partner = b;
  b.partner = a;

  _notify(a, b);
  _notify(b, a);
}

/**
 * Disconnect a socket from its partner.
 * Notifies the partner that the stranger has left.
 */
function disconnect(ws) {
  if (!ws.partner) return;

  const partner = ws.partner;

  // Notify partner
  if (partner.readyState === WebSocket.OPEN) {
    partner.send(JSON.stringify({ type: 'disconnected' }));
    partner.partner = null;
  }

  ws.partner = null;
}

// ─── Internal ─────────────────────────────────────────────────────────────────

function _notify(ws, partner) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type:             'connected',
      partnerName:      partner.displayName,
      partnerInterests: partner.interests,
    }));
  }
}

module.exports = { bridge, disconnect };
