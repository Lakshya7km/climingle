-- CliMingle Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query

-- ─── Table: ip_bans ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ip_bans (
  ip          TEXT        PRIMARY KEY,
  permanent   BOOLEAN     NOT NULL DEFAULT FALSE,
  reason      TEXT,
  expires_at  TIMESTAMPTZ,               -- NULL when permanent = TRUE
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Table: reports ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reports (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_ip TEXT        NOT NULL,
  target_ip   TEXT        NOT NULL,
  reason      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookup of reports by target
CREATE INDEX IF NOT EXISTS reports_target_idx ON reports (target_ip, created_at);

-- ─── Table: analytics ────────────────────────────────────────────────────────
-- Lightweight event tracking. Each row is ~80 bytes.
-- 500MB free tier ≈ 6 million events ≈ 16 years at 1000 events/day.
CREATE TABLE IF NOT EXISTS analytics (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event      TEXT        NOT NULL,   -- connect, match, next, report, quit, disconnect
  region     TEXT,                   -- 2-octet IP prefix like "49.36" (no PII)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for time-range queries on analytics
CREATE INDEX IF NOT EXISTS analytics_event_time_idx ON analytics (event, created_at);

-- ─── View: analytics_summary ─────────────────────────────────────────────────
-- Quick dashboard view — run: SELECT * FROM analytics_summary;
CREATE OR REPLACE VIEW analytics_summary AS
SELECT
  event,
  COUNT(*)                                               AS total,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours')  AS last_24h,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')    AS last_7d,
  COUNT(DISTINCT region)                                 AS unique_regions
FROM analytics
GROUP BY event
ORDER BY total DESC;

-- ─── View: analytics_regions ─────────────────────────────────────────────────
-- See where users come from — run: SELECT * FROM analytics_regions;
CREATE OR REPLACE VIEW analytics_regions AS
SELECT
  region,
  COUNT(*)                                               AS total_events,
  COUNT(*) FILTER (WHERE event = 'connect')              AS connects,
  COUNT(*) FILTER (WHERE event = 'match')                AS matches,
  MAX(created_at)                                        AS last_seen
FROM analytics
WHERE region IS NOT NULL AND region != 'local'
GROUP BY region
ORDER BY total_events DESC
LIMIT 50;

-- ─── Function: count_recent_reports ──────────────────────────────────────────
-- Counts unique reporter IPs that reported a given target within N hours.
-- Discards self-reports (reporter == target).
CREATE OR REPLACE FUNCTION count_recent_reports(target TEXT, hours INT)
RETURNS INT
LANGUAGE SQL
STABLE
AS $$
  SELECT COUNT(DISTINCT reporter_ip)::INT
  FROM   reports
  WHERE  target_ip   = target
    AND  reporter_ip != target
    AND  created_at  > NOW() - (hours || ' hours')::INTERVAL;
$$;

-- ─── Row Level Security ───────────────────────────────────────────────────────
-- The relay server uses service_role key (bypasses RLS).
-- Enable RLS to block any accidental anon access.
ALTER TABLE ip_bans   ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports   ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- No public access to any table
-- Use DROP POLICY IF EXISTS to avoid errors on re-run
DO $$
BEGIN
  -- ip_bans
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'service_role_only_bans' AND tablename = 'ip_bans') THEN
    CREATE POLICY service_role_only_bans ON ip_bans FOR ALL USING (false);
  END IF;
  -- reports
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'service_role_only_reports' AND tablename = 'reports') THEN
    CREATE POLICY service_role_only_reports ON reports FOR ALL USING (false);
  END IF;
  -- analytics
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'service_role_only_analytics' AND tablename = 'analytics') THEN
    CREATE POLICY service_role_only_analytics ON analytics FOR ALL USING (false);
  END IF;
END $$;
