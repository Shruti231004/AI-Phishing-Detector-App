/**
 * Trusted Domain Registry
 * Maps organization keywords to their verified email domains.
 * Used to verify if the sender's domain matches the claimed organization.
 */

export const TRUSTED_DOMAINS = [
  {
    org: 'Vidyavardhini College (VCET)',
    keywords: ['vidyavardhini', 'vcet', 'vvcoe', 'svvce', 'college'],
    domains: ['vcet.edu.in', 'vvcoe.ac.in']
  },
  { org: 'TCS', keywords: ['tcs', 'tata consultancy'], domains: ['tcs.com'] },
  { org: 'Infosys', keywords: ['infosys'], domains: ['infosys.com'] },
  { org: 'Wipro', keywords: ['wipro'], domains: ['wipro.com'] },
  { org: 'National Scholarship Portal', keywords: ['national scholarship', 'nsp'], domains: ['scholarships.gov.in'] },
  { org: 'State Bank of India', keywords: ['sbi', 'state bank'], domains: ['sbi.co.in'] },
  { org: 'HDFC Bank', keywords: ['hdfc'], domains: ['hdfcbank.com'] },
  { org: 'ICICI Bank', keywords: ['icici'], domains: ['icicibank.com'] },
  { org: 'Income Tax Dept', keywords: ['income tax', 'itr'], domains: ['incometax.gov.in'] },
  { org: 'UGC', keywords: ['ugc', 'university grants'], domains: ['ugc.ac.in'] },
  { org: 'AICTE', keywords: ['aicte'], domains: ['aicte-india.org'] },
  { org: 'Mumbai University', keywords: ['mumbai university'], domains: ['mu.ac.in'] },
  { org: 'Google', keywords: ['google'], domains: ['google.com'] },
  { org: 'Microsoft', keywords: ['microsoft'], domains: ['microsoft.com'] },
];

/**
 * Verify sender domain against the trusted registry.
 * @param {string} senderEmail - The sender's email address
 * @param {string} messageBody - The message content
 * @returns {object|null} - Verification result or null if no org keyword matched
 */
export function verifyDomain(senderEmail, messageBody) {
  if (!senderEmail || !messageBody) return null;

  const lowerBody = messageBody.toLowerCase();
  const cleanEmail = senderEmail.trim().toLowerCase();
  const atIndex = cleanEmail.lastIndexOf('@');
  if (atIndex === -1) return null;

  const senderDomain = cleanEmail.slice(atIndex + 1);

  // Find organization mentioned in the message
  for (const entry of TRUSTED_DOMAINS) {
    const keywordFound = entry.keywords.find((kw) => lowerBody.includes(kw));
    if (keywordFound) {
      const domainMatch = entry.domains.some(
        (d) => senderDomain === d || senderDomain.endsWith('.' + d)
      );
      return {
        verified: domainMatch,
        org: entry.org,
        keyword: keywordFound,
        expectedDomains: entry.domains,
        actualDomain: senderDomain,
      };
    }
  }

  return null;
}
