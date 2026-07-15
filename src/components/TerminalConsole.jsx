import React, { useEffect, useRef } from 'react';

function TerminalConsole({ logs = [], visible = false }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  if (!visible) return null;

  return (
    <div className="terminal-panel">
      <div className="terminal-title-bar">
        <span>Verifier Agent Console</span>
        <span>Online</span>
      </div>
      <div ref={containerRef} style={{ overflowY: 'auto', flex: 1 }}>
        {logs.map((log, index) => (
          <div key={index} className={`terminal-log-line ${log.type}`}>
            {log.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TerminalConsole;
