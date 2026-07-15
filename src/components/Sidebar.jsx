function Sidebar({ activeCategory, onCategoryChange, aiStats }) {
  const categories = [
    { key: 'scholarship', label: 'Scholarships', icon: '🎓' },
    { key: 'fees', label: 'Tuition Fees', icon: '💳' },
    { key: 'placements', label: 'Placements/Jobs', icon: '💼' },
    { key: 'competitions', label: 'Competitions', icon: '🏆' },
  ];

  return (
    <aside className="sidebar">
      <div className="logo-wrap">
        <div className="logo-mark">SS</div>
        <div className="logo-text">
          <h2>ScamScan</h2>
          <span>Cyber Defense Hub</span>
        </div>
      </div>

      <div>
        <div className="menu-title">Student Use Cases</div>
        <ul className="nav-list">
          {categories.map((cat) => (
            <li key={cat.key}>
              <button
                className={activeCategory === cat.key ? 'nav-btn active' : 'nav-btn'}
                onClick={() => onCategoryChange(cat.key)}
              >
                {cat.icon} {cat.label}
              </button>
            </li>
          ))}
        </ul>
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
