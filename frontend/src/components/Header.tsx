export function Header() {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="header-branding">
          <h1 className="header-title">CivicLens</h1>
          <p className="header-subtitle">NYC 311 Service Request Analytics</p>
        </div>
        <span className="header-badge">NYC Open Data</span>
      </div>
    </header>
  );
}
