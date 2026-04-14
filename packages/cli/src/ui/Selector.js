/**
 * Selector.js — Interest picker screen.
 * Navigate with arrow keys, toggle with Space, confirm with Enter.
 */

import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';

const INTEREST_GROUPS = [
  {
    label: '⚡ Languages',
    items: ['javascript', 'typescript', 'python', 'rust', 'go', 'java', 'cpp', 'kotlin', 'swift'],
  },
  {
    label: '🧠 Topics',
    items: ['leetcode', 'system-design', 'open-source', 'devops', 'web3', 'ml-ai', 'frontend', 'backend', 'databases', 'security', 'networking'],
  },
  {
    label: '🌙 Vibes',
    items: ['night-grind', 'job-hunt', 'debugging-hell', 'just-shipped', 'learning', 'career-change', 'side-project'],
  },
];

// Flatten to a single list for cursor navigation
const ALL_ITEMS  = INTEREST_GROUPS.flatMap(g => g.items);
const MAX_SELECT = 5;

export default function Selector({ onSelect }) {
  const [cursor,   setCursor]   = useState(0);
  const [selected, setSelected] = useState(new Set());

  useInput((input, key) => {
    if (key.upArrow)   setCursor(c => Math.max(0, c - 1));
    if (key.downArrow) setCursor(c => Math.min(ALL_ITEMS.length - 1, c + 1));

    if (input === ' ') {
      setSelected(prev => {
        const next = new Set(prev);
        const item = ALL_ITEMS[cursor];
        if (next.has(item)) {
          next.delete(item);
        } else if (next.size < MAX_SELECT) {
          next.add(item);
        }
        return next;
      });
    }

    if (key.return) {
      if (selected.size === 0) {
        // Skip interest filter — match purely FIFO
        onSelect([]);
      } else {
        onSelect([...selected]);
      }
    }

    if (input === 'q' || input === 'Q') process.exit(0);
  });

  let globalIdx = 0;

  return (
    <Box flexDirection="column" paddingX={3} paddingTop={1}>
      {/* Header */}
      <Box marginBottom={1} flexDirection="column">
        <Text color="cyan" bold>🎯 Pick your interests</Text>
        <Text color="gray" dimColor>↑↓ navigate · Space toggle · Enter confirm · max {MAX_SELECT}</Text>
      </Box>

      {/* Groups */}
      {INTEREST_GROUPS.map(group => {
        const groupStartIdx = globalIdx;
        const rendered = (
          <Box key={group.label} flexDirection="column" marginBottom={1}>
            <Text color="yellow" bold>{group.label}</Text>
            <Box flexDirection="column" paddingLeft={2}>
              {group.items.map(item => {
                const idx       = globalIdx++;
                const isCursor  = cursor === idx;
                const isSelected = selected.has(item);

                return (
                  <Box key={item}>
                    <Text
                      color={isCursor ? 'cyanBright' : isSelected ? 'greenBright' : 'gray'}
                      bold={isCursor || isSelected}
                    >
                      {isCursor   ? '▶ ' : '  '}
                      {isSelected ? '◉ ' : '○ '}
                      {item}
                    </Text>
                  </Box>
                );
              })}
            </Box>
          </Box>
        );
        void groupStartIdx; // suppress lint
        return rendered;
      })}

      {/* Footer */}
      <Box marginTop={1} flexDirection="column">
        <Text color={selected.size > 0 ? 'greenBright' : 'gray'}>
          Selected ({selected.size}/{MAX_SELECT}):{' '}
          {selected.size > 0 ? [...selected].join(' · ') : 'none'}
        </Text>
        <Box marginTop={1}>
          <Text color="cyan" bold>
            {selected.size > 0
              ? '[ Enter ] → Find matching devs'
              : '[ Enter ] → Random match (any dev)'}
          </Text>
          <Text color="gray" dimColor>   [Q] quit</Text>
        </Box>
      </Box>
    </Box>
  );
}
