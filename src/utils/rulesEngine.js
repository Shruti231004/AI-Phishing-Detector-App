/**
 * Heuristic Rules Engine for Student Phishing Detection
 * Contains keyword patterns, email profiler, and URL extraction utilities.
 */

// Free email providers commonly abused by phishing campaigns
export const FREE_PROVIDERS = [
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com',
  'rediffmail.com', 'protonmail.com', 'live.com', 'aol.com', 'mail.com',
];

// Trusted institutional TLDs
export const TRUSTED_TLDS = ['.edu', '.ac.in', '.gov.in', '.gov', '.nic.in', '.edu.in'];

// Authority keywords that scammers impersonate
export const AUTHORITY_WORDS = [
  'scholarship', 'college', 'university', 'bank', 'government',
  'committee', 'official', 'placement', 'dean', 'accounts',
  'admissions', 'director', 'coordinator', 'registrar',
];

// Core detection rules — each maps to a problem statement requirement
export const RULES = [
  {
    id: 'urgency',
    name: 'Urgency / Time Pressure',
    points: 2,
    why: 'Scammers create artificial deadlines so you act before verifying with official sources.',
    patterns: [
      'immediately', 'within 24 hours', 'act now', 'right away', 'hurry',
      'last chance', "before it's too late", 'expire', 'expiring', 'confirm now',
      'respond now', 'urgent', 'urgently', 'hours left', 'valid for 1 hour',
    ],
  },
  {
    id: 'authority',
    name: 'Fake Authority / Impersonation',
    points: 2,
    why: 'Claiming to be from college admin or bank officials builds false trust. Always verify the sender address.',
    patterns: [
      'scholarship committee', 'official notice', 'government of india', 'bank of',
      'official communication', 'college administration', 'university office',
      'cyber cell notice', 'tax department', 'official scholarship portal',
      'placement cell', 'accounts department', 'dean office',
    ],
  },
  {
    id: 'credentials',
    name: 'Requests Sensitive Data (OTP/PIN/CVV)',
    points: 3,
    why: 'No legitimate institution ever asks for passwords, OTPs, PINs, or card CVVs over email or text.',
    patterns: [
      'otp', 'one time password', 'password', 'pin number', 'cvv',
      'card number', 'bank details', 'account number', 'aadhaar',
      'bank account', 'net banking', 'upi pin', 'card details',
    ],
  },
  {
    id: 'payment',
    name: 'Payment / Money Demand',
    points: 3,
    why: 'Genuine scholarships, placements, and college services are free. Fee demands via UPI or links are scams.',
    patterns: [
      'pay ₹', 'pay rs', 'pay now', 'processing fee', 'deposit',
      'fine of', 'penalty', 'transfer money', 'transfer funds',
      'registration fee', '₹', 'service charge', 'security deposit',
    ],
  },
  {
    id: 'links',
    name: 'Suspicious / Unknown Links',
    points: 2,
    why: 'URL shorteners (bit.ly, tinyurl) and strange domain endings (.info, .xyz) hide credential-harvesting sites.',
    patterns: [
      'click here', 'click this link', 'click below', 'bit.ly',
      'tinyurl', 'click the link', 'verify here', 'login here',
    ],
  },
  {
    id: 'rewards',
    name: 'Unrealistic Reward / Too Good to Be True',
    points: 2,
    why: 'Unexpected prizes, free gadgets, or cash rewards are lures to extract your personal information.',
    patterns: [
      'congratulations', 'you have won', "you've won", 'lucky winner',
      'selected for a prize', 'claim your prize', 'free gift', 'free money',
      'win a free', 'cash reward',
    ],
  },
  {
    id: 'generic',
    name: 'Generic / Impersonal Greeting',
    points: 1,
    why: 'Mass-sent scams use broad greetings like "Dear Student" because they don\'t know your actual name.',
    patterns: [
      'dear student', 'dear customer', 'dear user', 'dear beneficiary',
      'valued customer', 'dear applicant',
    ],
  },
  {
    id: 'threats',
    name: 'Threat of Consequence',
    points: 2,
    why: 'Threats of suspension, cancellation, or legal action are designed to create panic and force compliance.',
    patterns: [
      'account will be blocked', 'account suspended', 'will be cancelled',
      'legal action', 'eligibility will be cancelled', 'account blocked',
      'access will be revoked', 'cancelled immediately',
    ],
  },
];

// URL extraction regex
export const URL_REGEX =
  /\b((https?:\/\/[^\s]+)|([a-z0-9-]+\.(com|in|info|net|org|xyz|link|co|io)(\/[^\s]*)?))\b/gi;

/**
 * Analyze sender email address for red flags
 */
export function analyzeEmailAddress(email, lowerBody) {
  const flags = [];
  if (!email) return flags;

  const clean = email.trim().toLowerCase();
  const atIndex = clean.lastIndexOf('@');

  if (atIndex === -1) {
    flags.push({
      name: 'Malformed Sender Address',
      why: 'This email address is structurally invalid — it lacks a domain, suggesting a fake or automated source.',
      matches: [email],
      pts: 2,
    });
    return flags;
  }

  const domain = clean.slice(atIndex + 1);
  const claimsAuthority = AUTHORITY_WORDS.some((w) => lowerBody.includes(w));

  // Check 1: Free provider claiming official authority
  const isFree = FREE_PROVIDERS.some((p) => domain === p || domain.endsWith('.' + p));
  if (isFree && claimsAuthority) {
    flags.push({
      name: 'Official Claim via Free Email',
      why: 'Institutions use their own domains (like @vcet.edu.in), never public Gmail or Yahoo accounts.',
      matches: [domain],
      pts: 3,
    });
  }

  // Check 2: Typosquatting / lookalike domain
  const domainName = domain.split('.')[0];
  const hasDigitSwap = /[0-9]/.test(domainName) && /[a-z]/.test(domainName);
  const hyphenCount = (domain.match(/-/g) || []).length;
  if (hasDigitSwap || hyphenCount >= 2) {
    flags.push({
      name: 'Lookalike / Spoofed Domain',
      why: "Substituting digits for letters (like '0' for 'o') or excessive hyphens are common domain-spoofing tricks.",
      matches: [domain],
      pts: 3,
    });
  }

  // Check 3: Claims authority but lacks institutional TLD
  const hasTrustedTld = TRUSTED_TLDS.some((t) => domain.endsWith(t));
  if (claimsAuthority && !isFree && !hasTrustedTld) {
    flags.push({
      name: 'Non-Institutional Sender Domain',
      why: 'The sender claims official credentials but their domain lacks an educational (.edu.in, .ac.in) or government (.gov.in) ending.',
      matches: [domain],
      pts: 2,
    });
  }

  return flags;
}

/**
 * Run all heuristic rules against message body
 */
export function runRulesEngine(text, email) {
  const lowerBody = text.toLowerCase();
  const hits = [];
  let score = 0;

  // Email address checks
  const emailFlags = analyzeEmailAddress(email, lowerBody);
  emailFlags.forEach((f) => {
    score += f.pts;
    hits.push(f);
  });

  // URL extraction
  const urls = text.match(URL_REGEX) || [];
  if (urls.length > 0) {
    const linkPts = Math.min(2 * urls.length, 4);
    score += linkPts;
    hits.push({
      name: 'Suspicious Links Detected',
      why: 'URLs in unsolicited messages are untrustworthy. Scammers hide destinations behind shorteners or lookalike links.',
      matches: [...new Set(urls)],
      pts: linkPts,
    });
  }

  // Keyword rules
  RULES.forEach((rule) => {
    const matched = [];
    rule.patterns.forEach((p) => {
      if (lowerBody.includes(p)) matched.push(p);
    });
    if (matched.length > 0) {
      const contribution = Math.min(rule.points * matched.length, rule.points * 2);
      score += contribution;
      hits.push({
        name: rule.name,
        why: rule.why,
        matches: [...new Set(matched)],
        pts: contribution,
      });
    }
  });

  return { score, hits, extractedUrls: [...new Set(urls)] };
}
