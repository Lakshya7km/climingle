# 🚀 CliMingle Deployment Guide

Follow this guide to host your relay server **100% for free** (no credit card, no pay-later) and keep it alive 24/7.

## Phase 1: Upload to GitHub

1.  **Initialize Git**: In the root directory `climingle/`, run:
    ```bash
    git init
    git add .
    git commit -m "Initialize CliMingle"
    ```
2.  **Create Repository**: Go to [GitHub](https://github.com/new) and create a private repository named `climingle`.
3.  **Push Code**: Follow the GitHub instructions to push your local code to the repository.

---

## Phase 2: Host on Render.com ($0)

Render is great because it's truly free and requires no credit card.

1.  **Create Account**: Go to [Render.com](https://render.com) and sign up using your GitHub account.
2.  **New Web Service**: Click **New +** → **Web Service**.
3.  **Connect Repo**: Select your `climingle` repository.
4.  **Configure**:
    *   **Name**: `climingle-relay`
    *   **Region**: Pick the one closest to you (e.g., Singapore or Oregon).
    *   **Runtime**: `Node`
    *   **Build Command**: `cd packages/relay && npm install`
    *   **Start Command**: `cd packages/relay && node server.js`
    *   **Instance Type**: `Free` ($0/month)
5.  **Environment Variables**: Click **Advanced** → **Add Environment Variable**:
    *   `SUPABASE_URL`: (Your Supabase Project URL)
    *   `SUPABASE_SERVICE_KEY`: (Your `service_role` secret key)
    *   `PORT`: `3001`
6.  **Create**: Click **Create Web Service**. Wait for the logs to say `Relay running on port 3001`.
7.  **Copy URL**: Under the name `climingle-relay`, copy your public URL (e.g., `https://climingle-relay.onrender.com`).

---

## Phase 3: The "No-Sleep" Hack (Cron-job.org)

Render's free tier sleeps after 15 minutes of inactivity. We'll use a "pinger" to keep it awake.

1.  **Create Account**: Go to [Cron-job.org](https://cron-job.org) and sign up (Free).
2.  **Create Cronjob**: Click **Cronjobs** → **Create Cronjob**.
3.  **Title**: `CliMingle KeepAlive`
4.  **URL**: Paste your Render URL + `/ping` (e.g., `https://climingle-relay.onrender.com/ping`).
5.  **Execution**: Set to **Every 14 minutes** (Render sleeps at 15m, so this beats it).
6.  **Save**: Click **Create**.

**Done!** Your relay server will now stay awake 24/7 for $0.

---

## Phase 4: Configure the CLI

Now tell your CLI to connect to your new online relay instead of `localhost`.

1.  **Set Environment Variable**: In your terminal on your computer, run:
    ```powershell
    $env:RELAY_URL="wss://your-render-url.onrender.com"
    ```
    *(Replace `https://` with `wss://` because it is a Secure WebSocket.)*

2.  **Start CLI**:
    ```powershell
    cd packages/cli
    node dist/main.js
    ```

Now anyone in the world who uses your CLI will connect to your hosted relay! 🚀
