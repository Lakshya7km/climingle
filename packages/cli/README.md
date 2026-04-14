# 📡 CliMingle

**Anonymous, interest-based CLI chat for developers.**  
*Match with strangers over shared interests, entirely from your terminal.*

<p align="center">
  <img src="https://avatars.githubusercontent.com/u/180313971?s=400&u=56ea64c7dd5cfb2698ae6c9d204dfee4fe77f0cf&v=4" width="200" style="border-radius: 50%" />
</p>

---

## 🚀 Quick Start

No installation needed. Just run:

```bash
npx climingle
```

That's it. You'll be matched with another developer in seconds.

---

## ✨ Features

- **Terminal-Native**: Built with **React Ink**, it feels like a modern CLI tool but behaves like a real-time chat app.
- **Smart Matchmaking**: A FIFO queue system that scores and pairs users based on **interest overlap** and **subnet proximity**.
- **Privacy First**: No PII (Personally Identifiable Information) is stored. Analytics use 2-octet IP hashing to keep your identity safe.
- **Moderation Ready**: Integrated with **Supabase** for IP-based reports and automated bans for bad actors.
- **Zero Configuration**: Just run `npx climingle` and start chatting. No setup required.

---

## ⌨️ Keyboard Shortcuts

| Key   | Action                          |
|-------|---------------------------------|
| `N`   | Skip current partner & find next |
| `R`   | Report partner & find next       |
| `Q`   | Quit CliMingle                   |
| `ESC` | Clear your message input         |

---

## 🛠️ Architecture

CliMingle consists of two main components:
1.  **Relay Server**: A stateless Node.js/Express backend that handles WebSocket connections, matchmaking scores, and Supabase integration for moderation.
2.  **CLI Client**: A React-based terminal UI that interacts with the relay server via secure WebSockets.

---

## 🔧 Requirements

- **Node.js** >= 18.0.0

---

## 👨‍💻 Behind the Project

This project was built as a journey into **Real-Time Backend Engineering**.

Hi, I'm **lakshya mandavi** ([@Lakshya7km](https://github.com/Lakshya7km)). I built CliMingle because I am deeply passionate about building networking tools that connect people.

### Human-AI Collaboration 🤖
CliMingle is a product of **Human-AI Pair Programming**.
- **My Role**: I served as the **System Architect and Designer**. I guided the logic, designed the features, and oversaw the entire system flow.
- **AI Support**: I used **Antigravity (Google DeepMind)** to help translate my designs into implementation, debugging tricky WebSocket race conditions, and refining the React CLI components.

---

## 🔗 Links

- **GitHub**: [github.com/Lakshya7km/climingle](https://github.com/Lakshya7km/climingle)
- **npm**: [npmjs.com/package/climingle](https://www.npmjs.com/package/climingle)

---

## ⚖️ License & Copyright

Copyright (c) 2026 **lakshya mandavi**.  
Distributed under the **MIT License**. See `LICENSE` for more information.
