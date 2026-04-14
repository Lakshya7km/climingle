/**
 * banService.js
 * Interfaces with Supabase to check IP bans and process reports.
 *
 * Ban escalation:
 *   ≥3 reports in 24 hours  → 48-hour temporary ban
 *   ≥5 lifetime reports      → permanent ban
 *
 * Self-reports (reporter === target) are silently discarded.
 */

const { createClient } = require('@supabase/supabase-js');

// Graceful no-op when Supabase keys aren't set (local dev without ban system)
const SUPABASE_READY =
  process.env.SUPABASE_URL &&
  process.env.SUPABASE_SERVICE_KEY &&
  !process.env.SUPABASE_URL.includes('YOUR_PROJECT_ID');

if (!SUPABASE_READY) {
  console.warn('[banService] ⚠️  Supabase keys not set — ban system disabled (local dev mode)');
}

// Supabase client uses service_role key — never expose this to the CLI
const supabase = SUPABASE_READY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  : null;

// ─── Check ban status for an IP ───────────────────────────────────────────────

/**
 * @param {string} ip
 * @returns {Promise<{ banned: boolean, reason?: string, until?: string }>}
 */
async function checkBan(ip) {
  if (!SUPABASE_READY || !ip || ip === 'unknown') return { banned: false };

  const { data, error } = await supabase
    .from('ip_bans')
    .select('*')
    .eq('ip', ip)
    .maybeSingle();

  if (error || !data) return { banned: false };

  // Temp ban expired → clean up row and allow
  if (!data.permanent && data.expires_at && new Date(data.expires_at) < new Date()) {
    await supabase.from('ip_bans').delete().eq('ip', ip);
    return { banned: false };
  }

  return {
    banned: true,
    reason: data.permanent
      ? '⛔ You have been permanently banned from CliMingle.'
      : `⏳ You are temporarily banned until ${new Date(data.expires_at).toUTCString()}.`,
    until: data.expires_at,
  };
}

// ─── Process a report ─────────────────────────────────────────────────────────

/**
 * @param {string} reporterIp
 * @param {string} targetIp
 * @param {string} reason
 */
async function report(reporterIp, targetIp, reason) {
  // Discard if target unknown, self-report abuse, or Supabase not configured
  if (!SUPABASE_READY || !targetIp || reporterIp === targetIp) {
    return;
  }

  // Insert the raw report
  const { error: insertError } = await supabase.from('reports').insert({
    reporter_ip: reporterIp,
    target_ip:   targetIp,
    reason:      reason || 'no reason given',
  });


  if (insertError) {
    console.error(`[report error] Failed to insert report: ${insertError.message}`);
    return;
  }


  // Count reports in last 24 hours
  const { data: recentCount } = await supabase
    .rpc('count_recent_reports', { target: targetIp, hours: 24 });

  // Count lifetime reports
  const { data: lifetimeCount } = await supabase
    .rpc('count_recent_reports', { target: targetIp, hours: 876000 }); // ~100 years

  if (lifetimeCount >= 5) {
    // Permanent ban
    await supabase.from('ip_bans').upsert({
      ip:         targetIp,
      permanent:  true,
      reason:     'Permanent ban: 5+ lifetime reports',
      expires_at: null,
    });

  } else if (recentCount >= 3) {
    // 48-hour temporary ban
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
    await supabase.from('ip_bans').upsert({
      ip:         targetIp,
      permanent:  false,
      reason:     '48h ban: 3+ reports in 24 hours',
      expires_at: expiresAt,
    });
  }
}

module.exports = { checkBan, report };
