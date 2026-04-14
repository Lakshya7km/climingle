/**
 * app.js — Root Ink component.
 * Manages screen state: welcome → selector → searching → chat
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box } from 'ink';
import Welcome   from './ui/Welcome.js';
import Selector  from './ui/Selector.js';
import Searching from './ui/Searching.js';
import Chat      from './ui/Chat.js';
import socket    from './net/socket.js';
import { generateName } from './utils/nameGen.js';

// Screen states
const SCREENS = {
  WELCOME:   'welcome',
  SELECTOR:  'selector',
  SEARCHING: 'searching',
  CHAT:      'chat',
};

export default function App() {
  const [screen,      setScreen]      = useState(SCREENS.WELCOME);
  const [myName]                      = useState(() => generateName());
  const [interests,   setInterests]   = useState([]);
  const [onlineCount, setOnlineCount] = useState(null);
  const [partner,     setPartner]     = useState({ name: '', interests: [] });

  // Use a ref so the 'disconnected' handler always sees current screen
  const screenRef = useRef(screen);
  screenRef.current = screen;

  // ── Socket event wiring — done ONCE on mount ────────────────────────────
  useEffect(() => {
    socket.on('connected', ({ partnerName, partnerInterests }) => {
      setPartner({ name: partnerName, interests: partnerInterests });
      setScreen(SCREENS.CHAT);
    });

    socket.on('queue_update', (count) => {
      setOnlineCount(count);
    });

    socket.on('banned', ({ reason }) => {
      process.stderr.write(`\n\n  ${reason}\n\n`);
      process.exit(1);
    });

    socket.on('error', (msg) => {
      process.stderr.write(`\n\n  ⚠️  Connection failed: ${msg}\n  Is the relay server running?\n\n`);
      process.exit(1);
    });

    socket.on('disconnected', () => {
      // Only go to searching if we were chatting (use ref to avoid stale closure)
      if (screenRef.current === SCREENS.CHAT) {
        setScreen(SCREENS.SEARCHING);
      }
    });

    return () => socket.removeAllListeners();
  }, []);

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleStart = useCallback(() => {
    setScreen(SCREENS.SELECTOR);
  }, []);

  const handleSelectInterests = useCallback((selected) => {
    setInterests(selected);
    setScreen(SCREENS.SEARCHING);
    socket.connect(selected, myName);
  }, [myName]);

  const handleNext = useCallback(() => {
    setPartner({ name: '', interests: [] });
    setScreen(SCREENS.SEARCHING);
    socket.next();
  }, []);

  const handleReport = useCallback(() => {
    setPartner({ name: '', interests: [] });
    setScreen(SCREENS.SEARCHING);
    socket.report('inappropriate behavior');
  }, []);

  const handleQuit = useCallback(() => {
    socket.quit();
    process.exit(0);
  }, []);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <Box>
      {screen === SCREENS.WELCOME && (
        <Welcome onStart={handleStart} />
      )}

      {screen === SCREENS.SELECTOR && (
        <Selector onSelect={handleSelectInterests} />
      )}

      {screen === SCREENS.SEARCHING && (
        <Searching
          onlineCount={onlineCount}
          interests={interests}
          onQuit={handleQuit}
        />
      )}

      {screen === SCREENS.CHAT && (
        <Chat
          partnerName={partner.name}
          partnerInterests={partner.interests}
          myName={myName}
          onNext={handleNext}
          onReport={handleReport}
          onQuit={handleQuit}
        />
      )}
    </Box>
  );
}
