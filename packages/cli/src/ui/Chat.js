/**
 * Chat.js — Main chat screen after a match is found.
 *
 * Shortcuts (when input is empty):
 *   N        → skip this stranger, find next
 *   R        → report and skip
 *   Q        → exit climingle
 *
 * Commands (typed into input):
 *   /next    → skip this stranger, find another
 *   /report  → report and skip
 *   /quit    → exit climingle
 */

import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import socket from '../net/socket.js';

const MAX_VISIBLE_MESSAGES = 20;

export default function Chat({ partnerName, partnerInterests, myName, onNext, onReport, onQuit }) {
  const [messages, setMessages] = useState([
    { from: 'system', text: `─── Connected to ${partnerName} ───` },
    {
      from: 'system',
      text: partnerInterests?.length
        ? `Interests: ${partnerInterests.join(' · ')}`
        : 'Interests: not specified',
    },
    { from: 'system', text: 'Say hi! Shortcuts: [N]ext · [R]eport · [Q]uit' },
    { from: 'system', text: '─'.repeat(52) },
  ]);

  const [inputText, setInputText] = useState('');
  const pushMessage = (msg) => setMessages(prev => [...prev, msg]);

  // Listen to socket events
  useEffect(() => {
    const onMessage = (text) => {
      pushMessage({ from: 'stranger', name: partnerName, text });
    };

    const onLeft = () => {
      pushMessage({ from: 'system', text: `${partnerName} disconnected. Finding next dev...` });
      setTimeout(() => onNext(), 1800);
    };

    socket.on('message',      onMessage);
    socket.on('stranger_left', onLeft);

    return () => {
      socket.off('message',      onMessage);
      socket.off('stranger_left', onLeft);
    };
  }, [partnerName]);

  // Keyboard input handling
  useInput((char, key) => {
    if (key.return) {
      const text = inputText.trim();
      if (!text) return;

      // Typed commands
      if (text === '/next')   { setInputText(''); onNext();   return; }
      if (text === '/report') { setInputText(''); onReport(); return; }
      if (text === '/quit')   { setInputText(''); onQuit();   return; }

      // Send message
      socket.send(text);
      pushMessage({ from: 'you', text });
      setInputText('');

    } else if (key.backspace || key.delete) {
      setInputText(prev => prev.slice(0, -1));

    } else if (key.escape) {
      // ESC clears input
      setInputText('');

    } else if (char && !key.ctrl && !key.meta) {
      // ── Shortcuts only when input is empty ──────────────────────────────
      if (inputText.length === 0) {
        if (char === 'n' || char === 'N') { onNext();   return; }
        if (char === 'r' || char === 'R') { onReport(); return; }
        if (char === 'q' || char === 'Q') { onQuit();   return; }
      }
      setInputText(prev => prev + char);
    }
  });

  // Show last N messages
  const visible = messages.slice(-MAX_VISIBLE_MESSAGES);

  return (
    <Box flexDirection="column" paddingX={1} paddingTop={1}>
      {/* Header bar */}
      <Box marginBottom={1}>
        <Text color="greenBright" bold>● </Text>
        <Text color="white" bold>{partnerName}</Text>
        {partnerInterests?.length > 0 && (
          <Text color="gray">  [{partnerInterests.join(' · ')}]</Text>
        )}
        <Text color="gray">   You: </Text>
        <Text color="cyan">{myName}</Text>
      </Box>

      {/* Message history */}
      <Box flexDirection="column" minHeight={MAX_VISIBLE_MESSAGES}>
        {visible.map((msg, i) => (
          <MessageLine key={i} msg={msg} />
        ))}
      </Box>

      {/* Divider */}
      <Box>
        <Text color="gray" dimColor>{'─'.repeat(60)}</Text>
      </Box>

      {/* Input line */}
      <Box paddingTop={0}>
        <Text color="cyan" bold>▶ </Text>
        <Text color="white">{inputText}</Text>
        <Text color="cyan" bold>█</Text>
      </Box>

      {/* Command hint bar */}
      <Box marginTop={1} gap={3}>
        <Text color="yellow" dimColor>[N] next</Text>
        <Text color="redBright" dimColor>[R] report</Text>
        <Text color="gray" dimColor>[Q] quit</Text>
        <Text color="gray" dimColor>[ESC] clear</Text>
        <Text color="gray" dimColor>  {inputText.length}/500</Text>
      </Box>
    </Box>
  );
}

// ─── Sub-component ──────────────────────────────────────────────────────────

function MessageLine({ msg }) {
  if (msg.from === 'system') {
    return (
      <Box>
        <Text color="gray" dimColor>{msg.text}</Text>
      </Box>
    );
  }

  if (msg.from === 'you') {
    return (
      <Box>
        <Text color="cyanBright" bold>You  </Text>
        <Text color="white">{msg.text}</Text>
      </Box>
    );
  }

  // from stranger
  return (
    <Box>
      <Text color="yellowBright" bold>{(msg.name || '???').padEnd(4, ' ')} </Text>
      <Text color="white">{msg.text}</Text>
    </Box>
  );
}
