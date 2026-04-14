/**
 * analytics.js
 * Lightweight event tracker — writes minimal data to Supabase analytics table.
 * 
 * Tracked events: connect, match, next, report, quit
 * Stored per event: event name, 2-octet region (e.g. "49.36"), timestamp
 * 
 * Free tier math: ~80 bytes/row → 500MB = ~6 million events.
 * At 1000 events/day that's 16 years. Plenty. 
 * 
 * Analytics failures are ALWAYS silent — never crash the relay for this.
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_READY =
  process.env.SUPABASE_URL &&
  process.env.SUPABASE_SERVICE_KEY &&
  !process.env.SUPABASE_URL.includes('YOUR_PROJECT_ID');

const supabase = SUPABASE_READY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  : null;

/**
 * Extract 2-octet region prefix from IP.
 * "49.36.112.5" → "49.36"   (Jio India)
 * "::1"         → "local"   (localhost)
 * @param {string} ip
 * @returns {string|null}
 */
function getRegion(ip) {
  if (!ip || ip === 'unknown') return null;
  if (ip.includes('::')) return 'local'; // IPv6 loopback
  const parts = ip.split('.');
  return parts.length >= 2 ? `${parts[0]}.${parts[1]}` : null;
}

/**
 * Track an event asynchronously. Never throws.
 * @param {'connect'|'match'|'next'|'report'|'quit'|'disconnect'} event
 * @param {string} [ip]   — will be converted to 2-octet region only
 */
async function track(event, ip = null) {
  if (!supabase) return;

  try {
    await supabase.from('analytics').insert({
      event,
      region: getRegion(ip),
    });
  } catch (_) {
    // Never let analytics crash the relay
  }
}

module.exports = { track };
