/**
 * Welcome.js — First screen the user sees.
 * Shows ASCII banner and waits for Enter to proceed.
 */

import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';

const BANNER = [
  '  ██████╗██╗     ██╗███╗   ███╗██╗███╗   ██╗ ██████╗ ██╗     ███████╗',
  ' ██╔════╝██║     ██║████╗ ████║██║████╗  ██║██╔════╝ ██║     ██╔════╝',
  ' ██║     ██║     ██║██╔████╔██║██║██╔██╗ ██║██║  ███╗██║     █████╗  ',
  ' ██║     ██║     ██║██║╚██╔╝██║██║██║╚██╗██║██║   ██║██║     ██╔══╝  ',
  ' ╚██████╗███████╗██║██║ ╚═╝ ██║██║██║ ╚████║╚██████╔╝███████╗███████╗',
  '  ╚═════╝╚══════╝╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚══════╝╚══════╝',
];

const TAGLINES = [
  'anonymous dev chat · terminal native · no accounts',
  'for devs who grind late and need someone to talk to',
  'omegle died. the terminal lives on.',
];

export default function Welcome({ onStart }) {
  const [pulse, setPulse]   = useState(true);
  const [tagIdx, setTagIdx] = useState(0);

  // Pulsing prompt
  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 550);
    return () => clearInterval(t);
  }, []);

  // Rotating taglines
  useEffect(() => {
    const t = setInterval(() => setTagIdx(i => (i + 1) % TAGLINES.length), 3000);
    return () => clearInterval(t);
  }, []);

  useInput((input, key) => {
    if (key.return || input === ' ') onStart();
    if (input === 'q' || input === 'Q') process.exit(0);
  });

  return (
    <Box flexDirection="column" alignItems="center" paddingTop={1} paddingX={2}>
      {/* ASCII Banner */}
      <Box flexDirection="column" alignItems="center">
        {BANNER.map((line, i) => (
          <Text key={i} color="cyan" bold>{line}</Text>
        ))}
      </Box>

      {/* Tagline */}
      <Box marginTop={1}>
        <Text color="gray">{TAGLINES[tagIdx]}</Text>
      </Box>

      {/* Divider */}
      <Box marginTop={1}>
        <Text color="gray" dimColor>{'─'.repeat(72)}</Text>
      </Box>

      {/* Stats row */}
      <Box marginTop={1} gap={4}>
        <Text color="yellow">🔥 v1.0.0</Text>
        <Text color="green">✅ Anonymous</Text>
        <Text color="cyan">🖥️  CLI Native</Text>
        <Text color="magenta">⚡ Zero install</Text>
      </Box>

      {/* CTA */}
      <Box marginTop={2}>
        <Text color={pulse ? 'greenBright' : 'green'} bold>
          ▶  Press ENTER to connect with a dev stranger
        </Text>
      </Box>
      <Box marginTop={1}>
        <Text color="gray" dimColor>[Q] quit</Text>
      </Box>

      {/* Footer */}
      <Box marginTop={2}>
        <Text color="gray" dimColor>
          No accounts. No logs. Messages vanish when you disconnect.
        </Text>
      </Box>
    </Box>
  );
}
