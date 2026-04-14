/**
 * nameGen.js
 * Generates a random anonymous developer name like "GhostCoder42"
 */

const ADJECTIVES = [
  'Ghost', 'Silent', 'Dark', 'Neon', 'Fuzzy', 'Rogue',
  'Byte', 'Void', 'Sigma', 'Echo', 'Null', 'Async',
  'Lazy', 'Stack', 'Root', 'Kernel', 'Binary', 'Sudo',
  'Anon', 'Cipher', 'Debug', 'Segfault', 'Overflow',
];

const NOUNS = [
  'Coder', 'Hacker', 'Dev', 'Builder', 'Rustacean',
  'Pythonista', 'Nodist', 'Scripter', 'Gopher', 'Kernel',
  'Wizard', 'Ninja', 'Monk', 'Rebel', 'Pioneer',
];

export function generateName() {
  const adj  = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num  = Math.floor(Math.random() * 99);
  return `${adj}${noun}${num}`;
}
