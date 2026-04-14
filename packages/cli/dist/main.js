#!/usr/bin/env node

// src/main.js
import { render } from "ink";
import React6 from "react";

// src/app.js
import React5, { useState as useState5, useEffect as useEffect4, useCallback, useRef } from "react";
import { Box as Box5 } from "ink";

// src/ui/Welcome.js
import React, { useState, useEffect } from "react";
import { Box, Text, useInput } from "ink";
import { jsx, jsxs } from "react/jsx-runtime";
var BANNER = [
  "  \u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2557     \u2588\u2588\u2557\u2588\u2588\u2588\u2557   \u2588\u2588\u2588\u2557\u2588\u2588\u2557\u2588\u2588\u2588\u2557   \u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2557     \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557",
  " \u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2551     \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D \u2588\u2588\u2551     \u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D",
  " \u2588\u2588\u2551     \u2588\u2588\u2551     \u2588\u2588\u2551\u2588\u2588\u2554\u2588\u2588\u2588\u2588\u2554\u2588\u2588\u2551\u2588\u2588\u2551\u2588\u2588\u2554\u2588\u2588\u2557 \u2588\u2588\u2551\u2588\u2588\u2551  \u2588\u2588\u2588\u2557\u2588\u2588\u2551     \u2588\u2588\u2588\u2588\u2588\u2557  ",
  " \u2588\u2588\u2551     \u2588\u2588\u2551     \u2588\u2588\u2551\u2588\u2588\u2551\u255A\u2588\u2588\u2554\u255D\u2588\u2588\u2551\u2588\u2588\u2551\u2588\u2588\u2551\u255A\u2588\u2588\u2557\u2588\u2588\u2551\u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2551     \u2588\u2588\u2554\u2550\u2550\u255D  ",
  " \u255A\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2551\u2588\u2588\u2551 \u255A\u2550\u255D \u2588\u2588\u2551\u2588\u2588\u2551\u2588\u2588\u2551 \u255A\u2588\u2588\u2588\u2588\u2551\u255A\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557",
  "  \u255A\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u255D\u255A\u2550\u255D     \u255A\u2550\u255D\u255A\u2550\u255D\u255A\u2550\u255D  \u255A\u2550\u2550\u2550\u255D \u255A\u2550\u2550\u2550\u2550\u2550\u255D \u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D"
];
var TAGLINES = [
  "anonymous dev chat \xB7 terminal native \xB7 no accounts",
  "for devs who grind late and need someone to talk to",
  "omegle died. the terminal lives on."
];
function Welcome({ onStart }) {
  const [pulse, setPulse] = useState(true);
  const [tagIdx, setTagIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPulse((p) => !p), 550);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setTagIdx((i) => (i + 1) % TAGLINES.length), 3e3);
    return () => clearInterval(t);
  }, []);
  useInput((input, key) => {
    if (key.return || input === " ")
      onStart();
    if (input === "q" || input === "Q")
      process.exit(0);
  });
  return /* @__PURE__ */ jsxs(Box, { flexDirection: "column", alignItems: "center", paddingTop: 1, paddingX: 2, children: [
    /* @__PURE__ */ jsx(Box, { flexDirection: "column", alignItems: "center", children: BANNER.map((line, i) => /* @__PURE__ */ jsx(Text, { color: "cyan", bold: true, children: line }, i)) }),
    /* @__PURE__ */ jsx(Box, { marginTop: 1, children: /* @__PURE__ */ jsx(Text, { color: "gray", children: TAGLINES[tagIdx] }) }),
    /* @__PURE__ */ jsx(Box, { marginTop: 1, children: /* @__PURE__ */ jsx(Text, { color: "gray", dimColor: true, children: "\u2500".repeat(72) }) }),
    /* @__PURE__ */ jsxs(Box, { marginTop: 1, gap: 4, children: [
      /* @__PURE__ */ jsx(Text, { color: "yellow", children: "\u{1F525} v1.0.0" }),
      /* @__PURE__ */ jsx(Text, { color: "green", children: "\u2705 Anonymous" }),
      /* @__PURE__ */ jsx(Text, { color: "cyan", children: "\u{1F5A5}\uFE0F  CLI Native" }),
      /* @__PURE__ */ jsx(Text, { color: "magenta", children: "\u26A1 Zero install" })
    ] }),
    /* @__PURE__ */ jsx(Box, { marginTop: 2, children: /* @__PURE__ */ jsx(Text, { color: pulse ? "greenBright" : "green", bold: true, children: "\u25B6  Press ENTER to connect with a dev stranger" }) }),
    /* @__PURE__ */ jsx(Box, { marginTop: 1, children: /* @__PURE__ */ jsx(Text, { color: "gray", dimColor: true, children: "[Q] quit" }) }),
    /* @__PURE__ */ jsx(Box, { marginTop: 2, children: /* @__PURE__ */ jsx(Text, { color: "gray", dimColor: true, children: "No accounts. No logs. Messages vanish when you disconnect." }) })
  ] });
}

// src/ui/Selector.js
import React2, { useState as useState2 } from "react";
import { Box as Box2, Text as Text2, useInput as useInput2 } from "ink";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var INTEREST_GROUPS = [
  {
    label: "\u26A1 Languages",
    items: ["javascript", "typescript", "python", "rust", "go", "java", "cpp", "kotlin", "swift"]
  },
  {
    label: "\u{1F9E0} Topics",
    items: ["leetcode", "system-design", "open-source", "devops", "web3", "ml-ai", "frontend", "backend", "databases", "security", "networking"]
  },
  {
    label: "\u{1F319} Vibes",
    items: ["night-grind", "job-hunt", "debugging-hell", "just-shipped", "learning", "career-change", "side-project"]
  }
];
var ALL_ITEMS = INTEREST_GROUPS.flatMap((g) => g.items);
var MAX_SELECT = 5;
function Selector({ onSelect }) {
  const [cursor, setCursor] = useState2(0);
  const [selected, setSelected] = useState2(/* @__PURE__ */ new Set());
  useInput2((input, key) => {
    if (key.upArrow)
      setCursor((c) => Math.max(0, c - 1));
    if (key.downArrow)
      setCursor((c) => Math.min(ALL_ITEMS.length - 1, c + 1));
    if (input === " ") {
      setSelected((prev) => {
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
        onSelect([]);
      } else {
        onSelect([...selected]);
      }
    }
    if (input === "q" || input === "Q")
      process.exit(0);
  });
  let globalIdx = 0;
  return /* @__PURE__ */ jsxs2(Box2, { flexDirection: "column", paddingX: 3, paddingTop: 1, children: [
    /* @__PURE__ */ jsxs2(Box2, { marginBottom: 1, flexDirection: "column", children: [
      /* @__PURE__ */ jsx2(Text2, { color: "cyan", bold: true, children: "\u{1F3AF} Pick your interests" }),
      /* @__PURE__ */ jsxs2(Text2, { color: "gray", dimColor: true, children: [
        "\u2191\u2193 navigate \xB7 Space toggle \xB7 Enter confirm \xB7 max ",
        MAX_SELECT
      ] })
    ] }),
    INTEREST_GROUPS.map((group) => {
      const groupStartIdx = globalIdx;
      const rendered = /* @__PURE__ */ jsxs2(Box2, { flexDirection: "column", marginBottom: 1, children: [
        /* @__PURE__ */ jsx2(Text2, { color: "yellow", bold: true, children: group.label }),
        /* @__PURE__ */ jsx2(Box2, { flexDirection: "column", paddingLeft: 2, children: group.items.map((item) => {
          const idx = globalIdx++;
          const isCursor = cursor === idx;
          const isSelected = selected.has(item);
          return /* @__PURE__ */ jsx2(Box2, { children: /* @__PURE__ */ jsxs2(
            Text2,
            {
              color: isCursor ? "cyanBright" : isSelected ? "greenBright" : "gray",
              bold: isCursor || isSelected,
              children: [
                isCursor ? "\u25B6 " : "  ",
                isSelected ? "\u25C9 " : "\u25CB ",
                item
              ]
            }
          ) }, item);
        }) })
      ] }, group.label);
      return rendered;
    }),
    /* @__PURE__ */ jsxs2(Box2, { marginTop: 1, flexDirection: "column", children: [
      /* @__PURE__ */ jsxs2(Text2, { color: selected.size > 0 ? "greenBright" : "gray", children: [
        "Selected (",
        selected.size,
        "/",
        MAX_SELECT,
        "):",
        " ",
        selected.size > 0 ? [...selected].join(" \xB7 ") : "none"
      ] }),
      /* @__PURE__ */ jsxs2(Box2, { marginTop: 1, children: [
        /* @__PURE__ */ jsx2(Text2, { color: "cyan", bold: true, children: selected.size > 0 ? "[ Enter ] \u2192 Find matching devs" : "[ Enter ] \u2192 Random match (any dev)" }),
        /* @__PURE__ */ jsx2(Text2, { color: "gray", dimColor: true, children: "   [Q] quit" })
      ] })
    ] })
  ] });
}

// src/ui/Searching.js
import React3, { useState as useState3, useEffect as useEffect2 } from "react";
import { Box as Box3, Text as Text3, useInput as useInput3 } from "ink";

// src/net/socket.js
import WebSocket from "ws";
import { EventEmitter } from "events";
var RELAY_URL = process.env.RELAY_URL || "wss://climingle.onrender.com";
var SocketClient = class extends EventEmitter {
  constructor() {
    super();
    this.ws = null;
    this.reconnectTimeout = null;
    this.isQuitting = false;
    this.connectionParams = null;
  }
  /**
   * Connect to relay and join the matchmaking queue.
   * Includes exponential backoff for reconnection.
   */
  connect(interests, name, isReconnect = false) {
    this.isQuitting = false;
    this.connectionParams = { interests, name };
    if (this.ws) {
      this.ws.removeAllListeners();
      this.ws.close();
    }
    if (!isReconnect) {
      this.emit("connecting");
    }
    this.ws = new WebSocket(RELAY_URL);
    const coldStartTimer = setTimeout(() => {
      if (this.ws.readyState !== WebSocket.OPEN) {
        this.emit("waking_up");
      }
    }, 3e3);
    this.ws.on("open", () => {
      clearTimeout(coldStartTimer);
      this.ws.send(JSON.stringify({ type: "join", interests, name }));
      this.emit("searching");
    });
    this.ws.on("message", (raw) => {
      let msg;
      try {
        msg = JSON.parse(raw.toString());
      } catch {
        return;
      }
      switch (msg.type) {
        case "connected":
          this.emit("connected", { partnerName: msg.partnerName, partnerInterests: msg.partnerInterests });
          break;
        case "message":
          this.emit("message", msg.text);
          break;
        case "disconnected":
          this.emit("stranger_left");
          break;
        case "queue":
          this.emit("queue_update", msg.online);
          break;
        case "banned":
          this.isQuitting = true;
          this.emit("banned", { reason: msg.reason, until: msg.until });
          break;
      }
    });
    this.ws.on("close", () => {
      this.emit("disconnected");
      if (!this.isQuitting) {
        this.emit("retrying");
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = setTimeout(() => {
          this.connect(this.connectionParams.interests, this.connectionParams.name, true);
        }, 3e3);
      }
    });
    this.ws.on("error", (err) => {
      this.emit("error", err.message);
    });
  }
  /** Send a chat message to the current partner */
  send(text) {
    this._send({ type: "message", text });
  }
  /** Skip current stranger and find next */
  next() {
    this._send({ type: "next" });
  }
  /** Report current stranger and move to next */
  report(reason = "inappropriate behavior") {
    this._send({ type: "report", reason });
  }
  /** Gracefully quit */
  quit() {
    this.isQuitting = true;
    clearTimeout(this.reconnectTimeout);
    this._send({ type: "quit" });
    this.ws?.close();
  }
  _send(obj) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(obj));
    }
  }
};
var socket_default = new SocketClient();
pocket - logic;

// src/ui/Searching.js
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var SPINNER_FRAMES = ["\u280B", "\u2819", "\u2839", "\u2838", "\u283C", "\u2834", "\u2826", "\u2827", "\u2807", "\u280F"];
var SEARCH_QUIPS = [
  "Scanning for devs who also scrolled past sleep...",
  "Looking for someone debugging at 2AM...",
  "Finding a fellow LeetCode victim...",
  "Hunting for a dev who knows what rm -rf feels like...",
  "Searching for someone with 47 Stack Overflow tabs open...",
  "Locating a dev who ships at midnight..."
];
function Searching({ onlineCount, interests, onQuit }) {
  const [frame, setFrame] = useState3(0);
  const [elapsed, setElapsed] = useState3(0);
  const [quipIdx, setQuipIdx] = useState3(0);
  const [statusMessage, setStatus] = useState3("SEARCHING");
  useEffect2(() => {
    const spinnerTimer = setInterval(() => {
      setFrame((f) => (f + 1) % SPINNER_FRAMES.length);
      setElapsed((e) => e + 1);
    }, 100);
    const quipTimer = setInterval(() => {
      setQuipIdx((i) => (i + 1) % SEARCH_QUIPS.length);
    }, 3500);
    const onWaking = () => setStatus("WAKING_UP");
    const onRetry = () => setStatus("RETRYING");
    const onDone = () => setStatus("SEARCHING");
    socket_default.on("waking_up", onWaking);
    socket_default.on("retrying", onRetry);
    socket_default.on("searching", onDone);
    return () => {
      clearInterval(spinnerTimer);
      clearInterval(quipTimer);
      socket_default.off("waking_up", onWaking);
      socket_default.off("retrying", onRetry);
      socket_default.off("searching", onDone);
    };
  }, []);
  useInput3((input, key) => {
    if (input === "q" || input === "Q" || key.escape)
      onQuit();
  });
  const seconds = Math.floor(elapsed / 10);
  return /* @__PURE__ */ jsxs3(Box3, { flexDirection: "column", alignItems: "center", paddingTop: 3, paddingX: 2, children: [
    /* @__PURE__ */ jsxs3(Box3, { marginBottom: 1, children: [
      statusMessage === "WAKING_UP" && /* @__PURE__ */ jsx3(Text3, { color: "yellow", bold: true, children: "\u23F3 Server is waking up (Render cold start)..." }),
      statusMessage === "RETRYING" && /* @__PURE__ */ jsx3(Text3, { color: "red", bold: true, children: "\u{1F4E1} Connection lost. Retrying..." }),
      statusMessage === "SEARCHING" && /* @__PURE__ */ jsx3(Text3, { color: "cyan", bold: true, children: "\u{1F4E1} Connected to Relay" })
    ] }),
    /* @__PURE__ */ jsxs3(Box3, { children: [
      /* @__PURE__ */ jsxs3(Text3, { color: "cyanBright", bold: true, children: [
        SPINNER_FRAMES[frame],
        "  "
      ] }),
      /* @__PURE__ */ jsx3(Text3, { color: "white", bold: true, children: SEARCH_QUIPS[quipIdx] })
    ] }),
    /* @__PURE__ */ jsxs3(Box3, { marginTop: 2, gap: 4, children: [
      /* @__PURE__ */ jsxs3(Text3, { color: "green", children: [
        "\u{1F310} ",
        onlineCount ?? "?",
        " dev",
        onlineCount !== 1 ? "s" : "",
        " online"
      ] }),
      /* @__PURE__ */ jsxs3(Text3, { color: "gray", children: [
        "\u23F1  ",
        seconds,
        "s elapsed"
      ] })
    ] }),
    interests && interests.length > 0 && /* @__PURE__ */ jsx3(Box3, { marginTop: 1, children: /* @__PURE__ */ jsxs3(Text3, { color: "gray", dimColor: true, children: [
      "Matching on: ",
      interests.join(" \xB7 ")
    ] }) }),
    /* @__PURE__ */ jsx3(Box3, { marginTop: 2, children: /* @__PURE__ */ jsx3(Text3, { color: "gray", dimColor: true, children: "\u2500".repeat(50) }) }),
    /* @__PURE__ */ jsx3(Box3, { marginTop: 1, children: /* @__PURE__ */ jsx3(Text3, { color: "gray", dimColor: true, children: seconds < 5 ? "\u{1F4A1} Tip: more interests = better match quality" : seconds < 15 ? "\u{1F4A1} Tip: /report removes bad actors permanently" : "\u26A1 Almost there \u2014 widening search radius..." }) }),
    /* @__PURE__ */ jsx3(Box3, { marginTop: 2, children: /* @__PURE__ */ jsx3(Text3, { color: "gray", children: "[Q] cancel and quit" }) })
  ] });
}

// src/ui/Chat.js
import React4, { useState as useState4, useEffect as useEffect3 } from "react";
import { Box as Box4, Text as Text4, useInput as useInput4 } from "ink";
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var MAX_VISIBLE_MESSAGES = 20;
function Chat({ partnerName, partnerInterests, myName, onNext, onReport, onQuit }) {
  const [messages, setMessages] = useState4([
    { from: "system", text: `\u2500\u2500\u2500 Connected to ${partnerName} \u2500\u2500\u2500` },
    {
      from: "system",
      text: partnerInterests?.length ? `Interests: ${partnerInterests.join(" \xB7 ")}` : "Interests: not specified"
    },
    { from: "system", text: "Say hi! Shortcuts: [N]ext \xB7 [R]eport \xB7 [Q]uit" },
    { from: "system", text: "\u2500".repeat(52) }
  ]);
  const [inputText, setInputText] = useState4("");
  const pushMessage = (msg) => setMessages((prev) => [...prev, msg]);
  useEffect3(() => {
    const onMessage = (text) => {
      pushMessage({ from: "stranger", name: partnerName, text });
    };
    const onLeft = () => {
      pushMessage({ from: "system", text: `${partnerName} disconnected. Finding next dev...` });
      setTimeout(() => onNext(), 1800);
    };
    socket_default.on("message", onMessage);
    socket_default.on("stranger_left", onLeft);
    return () => {
      socket_default.off("message", onMessage);
      socket_default.off("stranger_left", onLeft);
    };
  }, [partnerName]);
  useInput4((char, key) => {
    if (key.return) {
      const text = inputText.trim();
      if (!text)
        return;
      if (text === "/next") {
        setInputText("");
        onNext();
        return;
      }
      if (text === "/report") {
        setInputText("");
        onReport();
        return;
      }
      if (text === "/quit") {
        setInputText("");
        onQuit();
        return;
      }
      socket_default.send(text);
      pushMessage({ from: "you", text });
      setInputText("");
    } else if (key.backspace || key.delete) {
      setInputText((prev) => prev.slice(0, -1));
    } else if (key.escape) {
      setInputText("");
    } else if (char && !key.ctrl && !key.meta) {
      if (inputText.length === 0) {
        if (char === "n" || char === "N") {
          onNext();
          return;
        }
        if (char === "r" || char === "R") {
          onReport();
          return;
        }
        if (char === "q" || char === "Q") {
          onQuit();
          return;
        }
      }
      setInputText((prev) => prev + char);
    }
  });
  const visible = messages.slice(-MAX_VISIBLE_MESSAGES);
  return /* @__PURE__ */ jsxs4(Box4, { flexDirection: "column", paddingX: 1, paddingTop: 1, children: [
    /* @__PURE__ */ jsxs4(Box4, { marginBottom: 1, children: [
      /* @__PURE__ */ jsx4(Text4, { color: "greenBright", bold: true, children: "\u25CF " }),
      /* @__PURE__ */ jsx4(Text4, { color: "white", bold: true, children: partnerName }),
      partnerInterests?.length > 0 && /* @__PURE__ */ jsxs4(Text4, { color: "gray", children: [
        "  [",
        partnerInterests.join(" \xB7 "),
        "]"
      ] }),
      /* @__PURE__ */ jsx4(Text4, { color: "gray", children: "   You: " }),
      /* @__PURE__ */ jsx4(Text4, { color: "cyan", children: myName })
    ] }),
    /* @__PURE__ */ jsx4(Box4, { flexDirection: "column", minHeight: MAX_VISIBLE_MESSAGES, children: visible.map((msg, i) => /* @__PURE__ */ jsx4(MessageLine, { msg }, i)) }),
    /* @__PURE__ */ jsx4(Box4, { children: /* @__PURE__ */ jsx4(Text4, { color: "gray", dimColor: true, children: "\u2500".repeat(60) }) }),
    /* @__PURE__ */ jsxs4(Box4, { paddingTop: 0, children: [
      /* @__PURE__ */ jsx4(Text4, { color: "cyan", bold: true, children: "\u25B6 " }),
      /* @__PURE__ */ jsx4(Text4, { color: "white", children: inputText }),
      /* @__PURE__ */ jsx4(Text4, { color: "cyan", bold: true, children: "\u2588" })
    ] }),
    /* @__PURE__ */ jsxs4(Box4, { marginTop: 1, gap: 3, children: [
      /* @__PURE__ */ jsx4(Text4, { color: "yellow", dimColor: true, children: "[N] next" }),
      /* @__PURE__ */ jsx4(Text4, { color: "redBright", dimColor: true, children: "[R] report" }),
      /* @__PURE__ */ jsx4(Text4, { color: "gray", dimColor: true, children: "[Q] quit" }),
      /* @__PURE__ */ jsx4(Text4, { color: "gray", dimColor: true, children: "[ESC] clear" }),
      /* @__PURE__ */ jsxs4(Text4, { color: "gray", dimColor: true, children: [
        "  ",
        inputText.length,
        "/500"
      ] })
    ] })
  ] });
}
function MessageLine({ msg }) {
  if (msg.from === "system") {
    return /* @__PURE__ */ jsx4(Box4, { children: /* @__PURE__ */ jsx4(Text4, { color: "gray", dimColor: true, children: msg.text }) });
  }
  if (msg.from === "you") {
    return /* @__PURE__ */ jsxs4(Box4, { children: [
      /* @__PURE__ */ jsx4(Text4, { color: "cyanBright", bold: true, children: "You  " }),
      /* @__PURE__ */ jsx4(Text4, { color: "white", children: msg.text })
    ] });
  }
  return /* @__PURE__ */ jsxs4(Box4, { children: [
    /* @__PURE__ */ jsxs4(Text4, { color: "yellowBright", bold: true, children: [
      (msg.name || "???").padEnd(4, " "),
      " "
    ] }),
    /* @__PURE__ */ jsx4(Text4, { color: "white", children: msg.text })
  ] });
}

// src/utils/nameGen.js
var ADJECTIVES = [
  "Ghost",
  "Silent",
  "Dark",
  "Neon",
  "Fuzzy",
  "Rogue",
  "Byte",
  "Void",
  "Sigma",
  "Echo",
  "Null",
  "Async",
  "Lazy",
  "Stack",
  "Root",
  "Kernel",
  "Binary",
  "Sudo",
  "Anon",
  "Cipher",
  "Debug",
  "Segfault",
  "Overflow"
];
var NOUNS = [
  "Coder",
  "Hacker",
  "Dev",
  "Builder",
  "Rustacean",
  "Pythonista",
  "Nodist",
  "Scripter",
  "Gopher",
  "Kernel",
  "Wizard",
  "Ninja",
  "Monk",
  "Rebel",
  "Pioneer"
];
function generateName() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 99);
  return `${adj}${noun}${num}`;
}

// src/app.js
import { jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
var SCREENS = {
  WELCOME: "welcome",
  SELECTOR: "selector",
  SEARCHING: "searching",
  CHAT: "chat"
};
function App() {
  const [screen, setScreen] = useState5(SCREENS.WELCOME);
  const [myName] = useState5(() => generateName());
  const [interests, setInterests] = useState5([]);
  const [onlineCount, setOnlineCount] = useState5(null);
  const [partner, setPartner] = useState5({ name: "", interests: [] });
  const screenRef = useRef(screen);
  screenRef.current = screen;
  useEffect4(() => {
    socket_default.on("connected", ({ partnerName, partnerInterests }) => {
      setPartner({ name: partnerName, interests: partnerInterests });
      setScreen(SCREENS.CHAT);
    });
    socket_default.on("queue_update", (count) => {
      setOnlineCount(count);
    });
    socket_default.on("banned", ({ reason }) => {
      process.stderr.write(`

  ${reason}

`);
      process.exit(1);
    });
    socket_default.on("error", (msg) => {
      process.stderr.write(`

  \u26A0\uFE0F  Connection failed: ${msg}
  Is the relay server running?

`);
      process.exit(1);
    });
    socket_default.on("disconnected", () => {
      if (screenRef.current === SCREENS.CHAT) {
        setScreen(SCREENS.SEARCHING);
      }
    });
    return () => socket_default.removeAllListeners();
  }, []);
  const handleStart = useCallback(() => {
    setScreen(SCREENS.SELECTOR);
  }, []);
  const handleSelectInterests = useCallback((selected) => {
    setInterests(selected);
    setScreen(SCREENS.SEARCHING);
    socket_default.connect(selected, myName);
  }, [myName]);
  const handleNext = useCallback(() => {
    setPartner({ name: "", interests: [] });
    setScreen(SCREENS.SEARCHING);
    socket_default.next();
  }, []);
  const handleReport = useCallback(() => {
    setPartner({ name: "", interests: [] });
    setScreen(SCREENS.SEARCHING);
    socket_default.report("inappropriate behavior");
  }, []);
  const handleQuit = useCallback(() => {
    socket_default.quit();
    process.exit(0);
  }, []);
  return /* @__PURE__ */ jsxs5(Box5, { children: [
    screen === SCREENS.WELCOME && /* @__PURE__ */ jsx5(Welcome, { onStart: handleStart }),
    screen === SCREENS.SELECTOR && /* @__PURE__ */ jsx5(Selector, { onSelect: handleSelectInterests }),
    screen === SCREENS.SEARCHING && /* @__PURE__ */ jsx5(
      Searching,
      {
        onlineCount,
        interests,
        onQuit: handleQuit
      }
    ),
    screen === SCREENS.CHAT && /* @__PURE__ */ jsx5(
      Chat,
      {
        partnerName: partner.name,
        partnerInterests: partner.interests,
        myName,
        onNext: handleNext,
        onReport: handleReport,
        onQuit: handleQuit
      }
    )
  ] });
}

// src/main.js
process.stdout.write("\x1Bc");
render(React6.createElement(App), {
  exitOnCtrlC: true
});
