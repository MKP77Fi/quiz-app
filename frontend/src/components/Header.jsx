function Header({ user, onLogout }) {
  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div>
          <h1 className="header-logo">TSW Ajolupakoe</h1>
        </div>

        {/* Oikea puoli */}
        <nav className="header-nav">
          {user && (
            <span className="header-user">
              {user.username}
            </span>
          )}
          
          {user ? (
            <button onClick={onLogout} className="btn btn-secondary btn-sm">
              Kirjaudu ulos
            </button>
          ) : (
            <a 
              href="https://mp005840.nube.fi/tswgroup/" 
              className="btn btn-secondary btn-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Takaisin etusivulle
            </a>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header