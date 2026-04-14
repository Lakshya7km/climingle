/**
 * socket.js
 * WebSocket client — connects to the relay server.
 * Includes auto-reconnection logic for free-tier "cold starts" (Render/Koyeb).
 */

import WebSocket from 'ws';
import { EventEmitter } from 'events';

// Default to production relay for public use.
// Users can still override via environment variable for local testing.
const RELAY_URL = process.env.RELAY_URL || 'wss://climingle.onrender.com';

class SocketClient extends EventEmitter {
  constructor() {
    super();
    this.ws = null;
    this.reconnectTimeout = null;
    this.isQuitting = false;
    this.connectionParams = null; // store last interests/name for reconnect
  }

  /**
   * Connect to relay and join the matchmaking queue.
   * Includes exponential backoff for reconnection.
   */
  connect(interests, name, isReconnect = false) {
    this.isQuitting = false;
    this.connectionParams = { interests, name };

    if (this.ws) {
      this.ws.removeAllListeners();
      this.ws.close();
    }

    if (!isReconnect) {
      this.emit('connecting');
    }

    this.ws = new WebSocket(RELAY_URL);

    // Timeout if connection doesn't open within 15s (Render cold start can be slow)
    const coldStartTimer = setTimeout(() => {
      if (this.ws.readyState !== WebSocket.OPEN) {
        this.emit('waking_up');
      }
    }, 3000);

    this.ws.on('open', () => {
      clearTimeout(coldStartTimer);
      this.ws.send(JSON.stringify({ type: 'join', interests, name }));
      this.emit('searching');
    });

    this.ws.on('message', (raw) => {
      let msg;
      try { msg = JSON.parse(raw.toString()); } catch { return; }

      switch (msg.type) {
        case 'connected':
          this.emit('connected', { partnerName: msg.partnerName, partnerInterests: msg.partnerInterests });
          break;
        case 'message':
          this.emit('message', msg.text);
          break;
        case 'disconnected':
          this.emit('stranger_left');
          break;
        case 'queue':
          this.emit('queue_update', msg.online);
          break;
        case 'banned':
          this.isQuitting = true; // stop reconnecting if banned
          this.emit('banned', { reason: msg.reason, until: msg.until });
          break;
      }
    });

    this.ws.on('close', () => {
      this.emit('disconnected');
      
      // Attempt reconnect if we didn't explicitly quit
      if (!this.isQuitting) {
        this.emit('retrying');
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = setTimeout(() => {
          this.connect(this.connectionParams.interests, this.connectionParams.name, true);
        }, 3000);
      }
    });

    this.ws.on('error', (err) => {
      // On error, let 'close' handle the reconnection logic
      this.emit('error', err.message);
    });
  }

  /** Send a chat message to the current partner */
  send(text) {
    this._send({ type: 'message', text });
  }

  /** Skip current stranger and find next */
  next() {
    this._send({ type: 'next' });
  }

  /** Report current stranger and move to next */
  report(reason = 'inappropriate behavior') {
    this._send({ type: 'report', reason });
  }

  /** Gracefully quit */
  quit() {
    this.isQuitting = true;
    clearTimeout(this.reconnectTimeout);
    this._send({ type: 'quit' });
    this.ws?.close();
  }

  _send(obj) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(obj));
    }
  }
}

export default new SocketClient();
