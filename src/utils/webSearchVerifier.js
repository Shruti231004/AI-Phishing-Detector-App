/**
 * Web Search Verifier
 * Queries the URLhaus (abuse.ch) API to check if extracted URLs
 * have been reported as malware/phishing distribution endpoints.
 * Also generates Google Safe Browsing Transparency Report links.
 */

const URLHAUS_API = 'https://urlhaus-api.abuse.ch/v1/url/';

/**
 * Check a single URL against the URLhaus abuse database.
 * @param {string} url - URL to check
 * @returns {object} - { url, status, threat?, tags? }
 */
export async function checkUrlReputation(url) {
  try {
    const res = await fetch(URLHAUS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `url=${encodeURIComponent(url)}`,
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    if (data.query_status === 'no_results') {
      return { url, status: 'not_found', message: 'Not found in abuse database' };
    }

    return {
      url,
      status: 'flagged',
      threat: data.threat || 'malware_distribution',
      tags: data.tags || [],
      message: `FLAGGED — Reported as ${data.threat || 'malicious'}`,
    };
  } catch {
    return { url, status: 'offline', message: 'Web lookup unavailable (offline mode)' };
  }
}

/**
 * Check multiple URLs against URLhaus.
 * @param {string[]} urls - Array of URLs
 * @returns {object[]} - Array of results
 */
export async function checkMultipleUrls(urls) {
  if (!urls || urls.length === 0) return [];

  // Limit to first 5 URLs to avoid abuse
  const limited = urls.slice(0, 5);
  const results = await Promise.all(limited.map(checkUrlReputation));
  return results;
}

/**
 * Generate a Google Safe Browsing Transparency Report link for a domain.
 * Students can click this to manually verify a domain.
 * @param {string} domain - Domain to check
 * @returns {string} - Full URL to the transparency report
 */
export function getSafeBrowsingLink(domain) {
  if (!domain) return null;
  return `https://transparencyreport.google.com/safe-browsing/search?url=${encodeURIComponent(domain)}`;
}

/**
 * Extract domain from an email address for Safe Browsing lookup.
 * @param {string} email - Email address
 * @returns {string|null} - Domain or null
 */
export function extractDomainFromEmail(email) {
  if (!email) return null;
  const atIndex = email.lastIndexOf('@');
  if (atIndex === -1) return null;
  return email.slice(atIndex + 1).trim().toLowerCase();
}
