require('dotenv').config();
const express = require('express');
const http    = require('http');
const WebSocket = require('ws');
const matchmaker    = require('./matchmaker');
const sessionBridge = require('./sessionBridge');
const security      = require('./security');
const banService    = require('./banService');
const analytics     = require('./analytics');

const app    = express();
const server = http.createServer(app);
const wss    = new WebSocket.Server({ server });

// ─── Health endpoint (keeps Render free tier alive / monitoring) ──────────────
// ─── Monitoring — keeps Render free tier alive ───────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', queue: matchmaker.queueSize(), ts: Date.now() });
});

// Simple endpoint for cron-job.org to ping every 14 mins
app.get('/ping', (req, res) => res.send('pong'));

// ─── WebSocket connection handler ─────────────────────────────────────────────
wss.on('connection', async (ws, req) => {
  // Resolve real IP (works behind Render/Railway/Nginx proxies)
  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket.remoteAddress ||
    'unknown';

  console.log(`[connect] New connection from ${ip}`);
  analytics.track('connect', ip);

  ws.clientIp    = ip;
  ws.isAlive     = true;
  ws.partner     = null;
  ws.interests   = [];
  ws.displayName = 'Anonymous';
  ws.banned      = false; // will be set true if ban check returns banned

  ws.on('pong', () => { ws.isAlive = true; });

  // ── Message router — REGISTERED IMMEDIATELY (before async ban check) ──────
  // This prevents race condition where client sends 'join' before
  // the async ban check completes and the handler would be unregistered.
  ws.on('message', async (rawData) => {
    // Silently drop messages if ban check is still pending or user is banned
    if (ws.banned) return;

    let msg;
    try { msg = JSON.parse(rawData.toString()); } catch { return; }


    switch (msg.type) {
      // Client wants to enter matchmaking
      case 'join':
        ws.interests   = Array.isArray(msg.interests) ? msg.interests.slice(0, 5) : [];
        ws.displayName = security.sanitizeName(msg.name || 'Anonymous');
        matchmaker.join(ws);
        break;


      // Client sends a chat message
      case 'message':
        if (security.isRateLimited(ws)) return;
        if (ws.partner && ws.partner.readyState === WebSocket.OPEN) {
          const clean = security.sanitize(msg.text || '');
          if (clean.length > 0) {
            ws.partner.send(JSON.stringify({ type: 'message', text: clean }));
          }
        }
        break;

      // Client wants next stranger
      case 'next':
        analytics.track('next', ip);
        security.cooldown(ws, 3000, () => {
          sessionBridge.disconnect(ws);
          matchmaker.join(ws);
        });
        break;

      // Client reports stranger
      case 'report':
        analytics.track('report', ip);
        if (ws.partner) {
          await banService.report(ws.clientIp, ws.partner.clientIp, msg.reason || 'reported');
        }
        sessionBridge.disconnect(ws);
        matchmaker.join(ws);
        break;

      // Client quits
      case 'quit':
        analytics.track('quit', ip);
        sessionBridge.disconnect(ws);
        matchmaker.remove(ws);
        ws.close();
        break;
    }
  });

  // ── Cleanup on disconnect ─────────────────────────────────────────────────
  ws.on('close', () => {
    sessionBridge.disconnect(ws);
    matchmaker.remove(ws);
    security.clearRateLimit(ws);
    analytics.track('disconnect', ip);
  });


  ws.on('error', (err) => {
    console.error(`[socket error] ${ip}: ${err.message}`);
    sessionBridge.disconnect(ws);
    matchmaker.remove(ws);
  });

  // ── Async ban check AFTER registering handlers ────────────────────────────
  // If banned, mark flag (drops future messages) and close.
  const banStatus = await banService.checkBan(ip);
  if (banStatus.banned) {
    ws.banned = true;
    ws.send(JSON.stringify({ type: 'banned', reason: banStatus.reason, until: banStatus.until }));
    ws.close();
    return;
  }
});

// ─── Heartbeat — kill dead connections every 30s ──────────────────────────────
const heartbeat = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) {
      ws.terminate();
      return;
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 30_000);

wss.on('close', () => clearInterval(heartbeat));

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`\n🔌 CliMingle relay running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health\n`);
});
