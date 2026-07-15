import { useState, useCallback } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import ScannerInput from './components/ScannerInput';
import TerminalConsole from './components/TerminalConsole';
import ResultsPanel from './components/ResultsPanel';

import classifier from './utils/aiClassifier';
import { runRulesEngine } from './utils/rulesEngine';
import { verifyDomain } from './utils/domainRegistry';
import {
  checkMultipleUrls,
  getSafeBrowsingLink,
  extractDomainFromEmail,
} from './utils/webSearchVerifier';

function App() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Result states
  const [ruleScore, setRuleScore] = useState(0);
  const [aiProb, setAiProb] = useState(0);
  const [verdict, setVerdict] = useState('SAFE');
  const [verdictDesc, setVerdictDesc] = useState('');
  const [flags, setFlags] = useState([]);
  const [domainResult, setDomainResult] = useState(null);
  const [webSearchResults, setWebSearchResults] = useState([]);
  const [safeBrowsingLink, setSafeBrowsingLink] = useState(null);
  const [actionText, setActionText] = useState('');

  const aiStats = classifier.getStats();

  // Add a log line with a delay
  const addLog = (text, type, delay) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setTerminalLogs((prev) => [...prev, { text, type }]);
        resolve();
      }, delay);
    });
  };

  // Main scan handler
  const handleScan = useCallback(async () => {
    if (!message.trim()) {
      alert('Please paste a suspicious message or load a template first.');
      return;
    }

    setIsScanning(true);
    setShowResults(false);
    setShowTerminal(true);
    setTerminalLogs([]);

    // Step 1: Animated agent logs
    await addLog('🤖 [Verifier Agent] Initializing phishing dissection module...', 'active', 200);
    await addLog(`🤖 [Verifier Agent] Profiling sender: "${email || 'No email provided'}"`, 'active', 400);

    // Step 2: Domain Registry Check
    await addLog('🔍 [Domain Registry] Cross-referencing sender against trusted domain database...', 'active', 400);
    const domResult = verifyDomain(email, message);
    setDomainResult(domResult);

    if (domResult) {
      if (domResult.verified) {
        await addLog(`✅ [Domain Registry] VERIFIED — Sender matches ${domResult.org} (${domResult.expectedDomains[0]})`, 'success', 300);
      } else {
        await addLog(`❌ [Domain Registry] MISMATCH — Claims ${domResult.org} but sent from ${domResult.actualDomain}`, 'danger', 300);
      }
    } else {
      await addLog('⚪ [Domain Registry] No known organization keyword detected in message body', 'warning', 300);
    }

    // Step 3: AI Classification
    await addLog('🧠 [AI Engine] Running Naive Bayes ML probability model...', 'active', 400);
    const aiResult = classifier.predict(message);
    const aiProbPercent = Math.round(aiResult.probability * 100);
    setAiProb(aiProbPercent);
    await addLog(`🧠 [AI Engine] Classification: ${aiResult.label.toUpperCase()} (${aiProbPercent}% phishing probability)`, aiResult.label === 'phish' ? 'danger' : 'success', 300);

    // Step 4: Rules Engine
    await addLog('📋 [Rules Engine] Scanning for urgency, payment demands, credential requests...', 'active', 400);
    const rulesResult = runRulesEngine(message, email);
    setRuleScore(rulesResult.score);
    setFlags(rulesResult.hits);
    await addLog(`📋 [Rules Engine] ${rulesResult.hits.length} red flag(s) detected, score: ${rulesResult.score}`, rulesResult.score >= 6 ? 'danger' : rulesResult.score >= 3 ? 'warning' : 'success', 300);

    // Step 5: Web Search Verification
    await addLog('🌐 [Web Search] Querying URLhaus abuse database for extracted URLs...', 'active', 400);
    let webResults = [];
    let sbLink = null;
    try {
      webResults = await checkMultipleUrls(rulesResult.extractedUrls);
      setWebSearchResults(webResults);

      for (const wr of webResults) {
        const icon = wr.status === 'flagged' ? '🔴' : wr.status === 'not_found' ? '🟢' : '⚪';
        await addLog(`🌐 [Web Search] ${icon} "${wr.url}" — ${wr.message}`, wr.status === 'flagged' ? 'danger' : 'active', 200);
      }

      if (rulesResult.extractedUrls.length === 0) {
        await addLog('🌐 [Web Search] No URLs found in message body to verify', 'warning', 200);
      }
    } catch {
      await addLog('🌐 [Web Search] Offline — web lookup unavailable', 'warning', 200);
    }

    // Safe Browsing link
    const senderDomain = extractDomainFromEmail(email);
    if (senderDomain) {
      sbLink = getSafeBrowsingLink(senderDomain);
      setSafeBrowsingLink(sbLink);
      await addLog(`🌐 [Web Search] Google Safe Browsing report link generated for "${senderDomain}"`, 'active', 200);
    } else {
      setSafeBrowsingLink(null);
    }

    // Step 6: Synthesize verdict
    await addLog('⚡ [Verifier Agent] Synthesizing composite risk assessment...', 'success', 400);

    const compositeScore = Math.max(rulesResult.score, Math.round(aiProbPercent / 10));
    let finalVerdict = 'SAFE';
    let desc = 'No significant risk indicators or phishing patterns matched this content.';

    // Generate smart actions dynamically based on text analysis
    let action = 'No direct threats found. Maintain standard security hygiene. Verify sender details manually.';
    const lowerBody = message.toLowerCase();

    if (domResult && !domResult.verified) {
      action = `Verify sender authenticity. The sender claims to be ${domResult.org} but the email domain does not match. Contact them at their official domain: ${domResult.expectedDomains.join(', ')}.`;
    } else if (lowerBody.includes('otp') || lowerBody.includes('password') || lowerBody.includes('pin') || lowerBody.includes('cvv')) {
      action = 'Halt. Do NOT share OTP codes, bank PINs, CVV, or login passwords. Official institutions will never ask for credentials via email or phone.';
    } else if (lowerBody.includes('pay') || lowerBody.includes('deposit') || lowerBody.includes('fee') || lowerBody.includes('charge')) {
      action = 'Halt. Do NOT transfer funds or security deposits. Verify any payment or fee demands directly on the official portal or desk.';
    } else if (lowerBody.includes('scholarship')) {
      action = 'Verify this scholarship notice with the official Dean office notice board before submitting any files.';
    } else if (lowerBody.includes('placement') || lowerBody.includes('interview') || lowerBody.includes('job')) {
      action = 'Confirm recruiter credibility by visiting the Placement Room or checking the official campus drive portal.';
    }

    if (compositeScore >= 6 || aiProbPercent > 75 || (domResult && !domResult.verified)) {
      finalVerdict = 'HIGH RISK';
      desc = 'Strong phishing indicators found. This message demands details or payment under artificial pressure.';
    } else if (compositeScore >= 3 || aiProbPercent > 35) {
      finalVerdict = 'SUSPICIOUS';
      desc = 'Some warning flags detected. Be careful before sharing details or clicking links.';
    }

    setVerdict(finalVerdict);
    setVerdictDesc(desc);
    setActionText(action);

    setShowResults(true);
    setIsScanning(false);
  }, [email, message]);

  return (
    <div className="app-container">
      <Sidebar aiStats={aiStats} />

      <main className="app-content">
        <div className="dashboard-header">
          <h1>ScamScan — Phishing Verification Console</h1>
          <p>
            Evaluate emails, messages, and alerts with AI classification, domain verification, and web search.
          </p>
        </div>

        <div className="dashboard-grid">
          {/* Left Column: Input + Terminal */}
          <div>
            <ScannerInput
              email={email}
              setEmail={setEmail}
              message={message}
              setMessage={setMessage}
              onScan={handleScan}
              isScanning={isScanning}
            />
            <TerminalConsole logs={terminalLogs} visible={showTerminal} />
          </div>

          {/* Right Column: Results */}
          <div>
            <ResultsPanel
              visible={showResults}
              ruleScore={ruleScore}
              aiProb={aiProb}
              verdict={verdict}
              verdictDesc={verdictDesc}
              flags={flags}
              domainResult={domainResult}
              webSearchResults={webSearchResults}
              safeBrowsingLink={safeBrowsingLink}
              actionText={actionText}
            />
          </div>
        </div>

        <footer>
          Prototype — AI + Cyber Defense · Naive Bayes ML · Domain Registry · Web Search · Do not enter real credentials.
        </footer>
      </main>
    </div>
  );
}

export default App;
