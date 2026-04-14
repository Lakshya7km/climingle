/**
 * Searching.js — Shown while in the matchmaking queue.
 * Displays a spinner, online count, and time elapsed.
 */

import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import socket from '../net/socket.js';

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

const SEARCH_QUIPS = [
  'Scanning for devs who also scrolled past sleep...',
  'Looking for someone debugging at 2AM...',
  'Finding a fellow LeetCode victim...',
  'Hunting for a dev who knows what rm -rf feels like...',
  'Searching for someone with 47 Stack Overflow tabs open...',
  'Locating a dev who ships at midnight...',
];

export default function Searching({ onlineCount, interests, onQuit }) {
  const [frame,         setFrame]   = useState(0);
  const [elapsed,       setElapsed] = useState(0);
  const [quipIdx,       setQuipIdx] = useState(0);
  const [statusMessage, setStatus]  = useState('SEARCHING'); // SEARCHING, WAKING_UP, RETRYING

  useEffect(() => {
    const spinnerTimer = setInterval(() => {
      setFrame(f => (f + 1) % SPINNER_FRAMES.length);
      setElapsed(e => e + 1);
    }, 100);

    const quipTimer = setInterval(() => {
      setQuipIdx(i => (i + 1) % SEARCH_QUIPS.length);
    }, 3500);

    // Listen for connection states for better hosting UX
    const onWaking = () => setStatus('WAKING_UP');
    const onRetry  = () => setStatus('RETRYING');
    const onDone   = () => setStatus('SEARCHING');

    socket.on('waking_up', onWaking);
    socket.on('retrying',  onRetry);
    socket.on('searching', onDone);

    return () => {
      clearInterval(spinnerTimer);
      clearInterval(quipTimer);
      socket.off('waking_up', onWaking);
      socket.off('retrying',  onRetry);
      socket.off('searching', onDone);
    };
  }, []);

  useInput((input, key) => {
    if (input === 'q' || input === 'Q' || key.escape) onQuit();
  });

  const seconds = Math.floor(elapsed / 10);

  return (
    <Box flexDirection="column" alignItems="center" paddingTop={3} paddingX={2}>
      {/* Status indicator */}
      <Box marginBottom={1}>
        {statusMessage === 'WAKING_UP' && (
          <Text color="yellow" bold>⏳ Server is waking up (Render cold start)...</Text>
        )}
        {statusMessage === 'RETRYING' && (
          <Text color="red" bold>📡 Connection lost. Retrying...</Text>
        )}
        {statusMessage === 'SEARCHING' && (
          <Text color="cyan" bold>📡 Connected to Relay</Text>
        )}
      </Box>

      {/* Spinner + main text */}
      <Box>
        <Text color="cyanBright" bold>
          {SPINNER_FRAMES[frame]}{'  '}
        </Text>
        <Text color="white" bold>
          {SEARCH_QUIPS[quipIdx]}
        </Text>
      </Box>

      {/* Stats row */}
      <Box marginTop={2} gap={4}>
        <Text color="green">
          🌐 {onlineCount ?? '?'} dev{onlineCount !== 1 ? 's' : ''} online
        </Text>
        <Text color="gray">
          ⏱  {seconds}s elapsed
        </Text>
      </Box>

      {/* Selected interests */}
      {interests && interests.length > 0 && (
        <Box marginTop={1}>
          <Text color="gray" dimColor>
            Matching on: {interests.join(' · ')}
          </Text>
        </Box>
      )}

      {/* Divider */}
      <Box marginTop={2}>
        <Text color="gray" dimColor>{'─'.repeat(50)}</Text>
      </Box>

      {/* Tip */}
      <Box marginTop={1}>
        <Text color="gray" dimColor>
          {seconds < 5
            ? '💡 Tip: more interests = better match quality'
            : seconds < 15
            ? '💡 Tip: /report removes bad actors permanently'
            : '⚡ Almost there — widening search radius...'}
        </Text>
      </Box>

      {/* Cancel */}
      <Box marginTop={2}>
        <Text color="gray">[Q] cancel and quit</Text>
      </Box>
    </Box>
  );
}
