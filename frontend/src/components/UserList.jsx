// frontend/src/components/UserList.jsx

/**
 * UserList - Käyttäjälistaus
 * --------------------------
 * Vastaa määrittelydokumentin lukua 5.3 (Admin-toiminnot / Käyttäjähallinta).
 *
 * Näyttää kaikki järjestelmän käyttäjätunnukset kortteina.
 * Mahdollistaa tunnuksen muokkaamisen (esim. salasanan vaihto) tai poistamisen.
 */
function UserList({ users, onEdit, onDelete }) {
  return (
    <div className="mt-12 w-full max-w-4xl mx-auto">
      
      {/* --- OTSIKKO --- */}
      <h3 className="text-2xl font-display uppercase tracking-wider text-accent-orange mb-6 border-b border-gray-700/50 pb-4">
        Käyttäjälista ({users.length})
      </h3>

      {users.length === 0 ? (
        // --- TYHJÄ LISTA ---
        <div className="panel text-center py-12">
          <p className="text-xl text-gray-400 mb-2">Ei käyttäjiä.</p>
        </div>
      ) : (
        // --- KÄYTTÄJÄKORTIT ---
        <div className="flex flex-col gap-4">
          {users.map((u) => (
            <div 
              key={u._id} 
              className="bg-gray-900/40 border border-gray-700/50 p-5 rounded-xl hover:border-accent-turquoise/50 transition-colors duration-300 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-sm"
            >
              {/* --- KÄYTTÄJÄN TIEDOT --- */}
              <div className="flex items-center gap-5 w-full sm:w-auto">
                
                {/* Rooli-badge (Neon-tyyli) */}
                <span className={`text-xs px-3 py-1.5 rounded font-bold uppercase tracking-wider border min-w-[100px] text-center ${
                  u.role === 'admin' 
                    ? 'bg-purple-900/20 border-purple-500/50 text-purple-400' 
                    : 'bg-green-900/20 border-green-500/50 text-green-400'
                }`}>
                  {u.role === 'admin' ? 'Ylläpitäjä' : 'Harjoittelija'}
                </span>

                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">Tunnus</span>
                  <strong className="text-lg text-white font-bold tracking-wide truncate">
                    {u.username}
                  </strong>
                </div>
              </div>

              {/* --- TOIMINNOT --- */}
              <div className="flex gap-3 w-full sm:w-auto justify-end">
                <button 
                  className="btn-action text-sm py-2 px-4" 
                  onClick={() => onEdit(u)}
                >
                  ✎ Muokkaa
                </button>
                
                <button
                  className="btn-cancel text-sm py-2 px-4"
                  onClick={() => onDelete(u._id)}
                >
                  🗑️ Poista
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserList;