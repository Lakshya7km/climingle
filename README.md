# 📡 CliMingle

**Anonymous, interest-based CLI chat for developers.**  
*Match with strangers over shared interests, entirely from your terminal.*

![CliMingle Preview](https://avatars.githubusercontent.com/u/180313971?s=400&u=56ea64c7dd5cfb2698ae6c9d204dfee4fe77f0cf&v=4)) *

---

## ✨ Features

- **Terminal-Native**: Built with **React Ink**, it feels like a modern CLI tool but behaves like a real-time chat app.
- **Smart Matchmaking**: A FIFO queue system that scores and pairs users based on **interest overlap** and **subnet proximity**.
- **Privacy First**: No PII (Personally Identifiable Information) is stored. Analytics use 2-octet IP hashing to keep your identity safe.
- **Moderation Ready**: Integrated with **Supabase** for IP-based reports and automated bans for bad actors.
- **Zero Configuration**: Just run `npx climingle` and start chatting. No setup required.

---

## 🛠️ Architecture

CliMingle consists of two main components:
1.  **Relay Server**: A stateless Node.js/Express backend that handles WebSocket connections, matchmaking scores, and Supabase integration for moderation.
2.  **CLI Client**: A React-based terminal UI that interacts with the relay server via secure WebSockets.

---

## 🚀 Quick Start

No installation needed. Just run:

```bash
npx climingle
```

### Keyboard Shortcuts
- **`N`**: Skip current partner & find next.
- **`R`**: Report partner & find next.
- **`Q`**: Quit CliMingle.
- **`ESC`**: Clear your message input.

---

## 👨‍💻 Behind the Project

This project was built as a journey into **Real-Time Backend Engineering**.

### The Learning Journey
Hi, I'm **lakshya mandavi** ([@Lakshya7km](https://github.com/Lakshya7km)). I built CliMingle because I am deeply passionate about building networking tools that connect people. 

To be completely honest: I am still in the **learning phase of Node.js and Backend Development**. Building a real-time matchmaking system with WebSockets and Supabase presented many challenges, and this project was a major step in my growth as a developer.

### Human-AI Collaboration 🤖
CliMingle is a product of **Human-AI Pair Programming**. 
- **My Role**: I served as the **System Architect and Designer**. I guided the logic, designed the features, and oversaw the entire system flow.
- **AI Support**: I used **Antigravity (Google DeepMind)** to help translate my designs into implementation, debugging tricky WebSocket race conditions, and refining the React CLI components.

This project shows what is possible when a passionate learner uses modern AI tools to build complex systems.

---

## ⚖️ License & Copyright

Copyright (c) 2026 **lakshya mandavi**.  
Distributed under the **MIT License**. See `LICENSE` for more information.
