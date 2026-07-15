import React from 'react';

function Sidebar({ aiStats }) {
  return (
    <aside className="sidebar">
      <div className="logo-wrap">
        <div className="logo-mark">SS</div>
        <div className="logo-text">
          <h2>ScamScan</h2>
          <span>Cyber Defense Hub</span>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <div className="menu-title" style={{ marginBottom: '16px', lineHeight: '1.5' }}>
          Welcome to ScamScan
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          This intelligent assistant performs multi-layered scanning using local machine learning, heuristic rules, trusted registry validation, and malicious domain lookups.
        </p>
      </div>

      <div className="ai-stats-widget">
        <div className="ai-stats-title">
          <span>AI Engine Status</span>
          <span className="blink-dot">●</span>
        </div>
        <div className="stat-line">
          <span>Classifier</span>
          <span className="stat-val">Naive Bayes</span>
        </div>
        <div className="stat-line">
          <span>Training Docs</span>
          <span className="stat-val">{aiStats.totalDocs}</span>
        </div>
        <div className="stat-line">
          <span>Model Vocab</span>
          <span className="stat-val">{aiStats.vocabSize} words</span>
        </div>
        <div className="stat-line">
          <span>Status</span>
          <span className="stat-val" style={{ color: 'var(--safe)' }}>Online</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
