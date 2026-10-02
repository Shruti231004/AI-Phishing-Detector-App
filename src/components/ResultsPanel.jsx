function ResultsPanel({
  visible,
  ruleScore,
  aiProb,
  verdict,
  verdictDesc,
  flags,
  domainResult,
  webSearchResults,
  safeBrowsingLink,
  actionText,
}) {
  if (!visible) return null;

  const verdictClass =
    verdict === 'HIGH RISK' ? 'danger-card' : verdict === 'SUSPICIOUS' ? 'warn-card' : 'safe-card';
  const badgeClass =
    verdict === 'HIGH RISK' ? 'danger-badge' : verdict === 'SUSPICIOUS' ? 'warn-badge' : 'safe-badge';

  const circumference = 2 * Math.PI * 42;
  const rulePercentage = Math.min(ruleScore / 12, 1);
  const ruleColor =
    verdict === 'HIGH RISK' ? 'var(--danger)' : verdict === 'SUSPICIOUS' ? 'var(--warn)' : 'var(--safe)';
  const ruleDashLen = circumference * rulePercentage;

  const aiPercentage = aiProb / 100;
  const aiColor = aiProb > 50 ? 'var(--danger)' : 'var(--safe)';
  const aiDashLen = circumference * aiPercentage;

  const actionClass =
    verdict === 'HIGH RISK' ? 'action-danger' : verdict === 'SUSPICIOUS' ? 'action-warning' : 'action-safe';
  const actionIcon = verdict === 'HIGH RISK' ? '⛔' : verdict === 'SUSPICIOUS' ? '⚠️' : '✓';

  const statusIcon = (status) => {
    if (status === 'not_found') return '🟢';
    if (status === 'flagged') return '🔴';
    if (status === 'no_key') return '🔑';
    return '⚪';
  };

  return (
    <div>
      {/* 1. Verdict Card */}
      <div className={`verdict-header-card ${verdictClass}`}>
        <span className={`verdict-badge ${badgeClass}`}>{verdict}</span>
        <p className="verdict-text-summary">{verdictDesc}</p>
      </div>

      {/* 2. Domain Verification Badge */}
      {domainResult && (
        <div className={`domain-badge ${domainResult.verified ? 'domain-verified' : 'domain-mismatch'}`}>
          {domainResult.verified
            ? `✅ Domain Verified — Sender matches ${domainResult.org} (${domainResult.expectedDomains[0]})`
            : `❌ Domain Mismatch — Claims ${domainResult.org} but sent from ${domainResult.actualDomain} (expected: ${domainResult.expectedDomains.join(', ')})`}
        </div>
      )}

      {/* 3. Dual Gauges */}
      <div className="gauges-row">
        <div className="gauge-block">
          <div className="gauge-svg-wrap">
            <svg viewBox="0 0 100 100">
              <circle className="gauge-bg-circle" cx="50" cy="50" r="42" />
              <circle
                className="gauge-fill-circle"
                cx="50"
                cy="50"
                r="42"
                style={{ strokeDasharray: `${ruleDashLen} ${circumference}`, stroke: ruleColor }}
              />
            </svg>
            <div className="gauge-score-label">
              <span className="gauge-score-val" style={{ color: ruleColor }}>{ruleScore}</span>
              <span className="gauge-score-desc">pts</span>
            </div>
          </div>
          <span className="gauge-block-title">Rules Matrix</span>
        </div>

        <div className="gauge-block">
          <div className="gauge-svg-wrap">
            <svg viewBox="0 0 100 100">
              <circle className="gauge-bg-circle" cx="50" cy="50" r="42" />
              <circle
                className="gauge-fill-circle"
                cx="50"
                cy="50"
                r="42"
                style={{ strokeDasharray: `${aiDashLen} ${circumference}`, stroke: aiColor }}
              />
            </svg>
            <div className="gauge-score-label">
              <span className="gauge-score-val" style={{ color: aiColor }}>{aiProb}%</span>
              <span className="gauge-score-desc">phish</span>
            </div>
          </div>
          <span className="gauge-block-title">AI ML Model</span>
        </div>
      </div>

      {/* 4. Web Search Results */}
      <div className="section-separator">Web Search Verification</div>
      {webSearchResults.length > 0 ? (
        <>
          {webSearchResults.map((result, idx) => (
            <div className="web-result-item" key={idx}>
              <span>{statusIcon(result.status)}</span>
              <span className="web-result-url">{result.url}</span>
              <span className="web-result-status">{result.message}</span>
            </div>
          ))}
          {safeBrowsingLink && (
            <a href={safeBrowsingLink} target="_blank" rel="noopener noreferrer" className="safe-browsing-link">
              Open Google Safe Browsing Report →
            </a>
          )}
        </>
      ) : (
        <div className="no-threats-box">
          {safeBrowsingLink ? (
            <>
              No URLs extracted for web verification.{' '}
              <a href={safeBrowsingLink} target="_blank" rel="noopener noreferrer" className="safe-browsing-link">
                Check sender domain on Google →
              </a>
            </>
          ) : (
            'No URLs extracted for web verification.'
          )}
        </div>
      )}

      {/* 5. Highlighted Red Flags */}
      <div className="section-separator">Highlighted Red Flags</div>
      {flags.length === 0 ? (
        <div className="no-threats-box">No red flags identified.</div>
      ) : (
        flags.map((flag, idx) => (
          <div className={`flag-item-box ${flag.pts >= 3 ? 'danger-flag' : 'warn-flag'}`} key={idx}>
            <div className="flag-item-head">
              <span>{flag.name}</span>
              <span className="flag-item-pts">+{flag.pts} pts</span>
            </div>
            <div className="flag-item-word">Matched: &quot;{flag.matches.join(', ')}&quot;</div>
            <div className="flag-item-desc">{flag.why}</div>
          </div>
        ))
      )}

      {/* 6. Safe Next Action */}
      <div className="section-separator">Recommended Safe Next Action</div>
      <div className={`action-box ${actionClass}`}>
        <span className="action-icon">{actionIcon}</span>
        <div className="action-content">
          <h4>Recommended Safe Next Action:</h4>
          <p>{actionText}</p>
        </div>
      </div>
    </div>
  );
}

export default ResultsPanel;
