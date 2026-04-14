# CliMingle 🖥️

> **Anonymous CLI chat for devs. Like Omegle — but in your terminal.**

```bash
npx climingle
```

No accounts. No logs. Messages vanish when you disconnect.

---

## Features
- 🎯 **Interest-based matching** — JavaScript, LeetCode, Rust, System Design, night-grind + more
- 🌐 **Global matching** with subnet proximity bonus (same ISP = faster match)
- 🎲 **Random dev names** — GhostCoder42, NullWizard7, you get the idea  
- 🛡️ **ANSI injection protection** — no terminal hijacking
- ⚡ **Rate limiting** — flood prevention built in
- 🚫 **IP ban system** — `/report` → 3 reports/24h = 48h ban, 5 lifetime = permanent
- 💾 **Stateless server** — zero message storage, Supabase only stores ban records

## Commands (in chat)

| Command | Action |
|---|---|
| `/next` | Skip stranger, find next |
| `/report` | Report + skip (triggers ban system) |
| `/quit` | Exit CliMingle |

## Local Development

### 1. Clone & install
```bash
git clone https://github.com/yourname/climingle
cd climingle
npm install
```

### 2. Set up Supabase
1. Go to [supabase.com](https://supabase.com) → New Project
2. Run `supabase/schema.sql` in the SQL Editor
3. Copy `.env.example` → `.env` in `packages/relay/`
4. Fill in `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`

### 3. Start the relay server
```bash
cd packages/relay
npm run dev
# Relay running on ws://localhost:3001
```

### 4. Start the CLI (in another terminal)
```bash
cd packages/cli
npm start
```

### 5. Test with two terminals
Open two terminals. Run `npm start` in each. They should match!

## Stack

| Layer | Tech |
|---|---|
| CLI UI | Node.js + Ink (React for terminals) |
| CLI transport | ws (WebSocket) |
| Relay server | Express + ws |
| Matchmaking | In-memory FIFO queue + score function |
| Persistence | Supabase (PostgreSQL) |
| Distribution | npm / npx |

## License
MIT
