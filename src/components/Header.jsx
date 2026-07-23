// Tiêu đề ứng dụng + nút chuyển ngôn ngữ + nút sáng/tối.
export default function Header({ t, lang, onToggleLang, theme, onToggleTheme }) {
  return (
    <header className="header">
      <div className="header-text">
        <h1>{t.appTitle}</h1>
        <p>{t.appSubtitle}</p>
      </div>
      <div className="header-actions">
        <button
          className="icon-btn"
          onClick={onToggleLang}
          title="Việt / English"
          aria-label="Toggle language"
        >
          {lang === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}
        </button>
        <button
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          title={theme === 'light' ? t.themeDark : t.themeLight}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  )
}
