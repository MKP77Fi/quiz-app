// frontend/src/components/UserList.jsx

/**
 * UserList - Käyttäjälistaus
 * --------------------------
 * Vastaa määrittelydokumentin lukua 5.3 (Admin-toiminnot / Käyttäjähallinta).
 *
 * Näyttää kaikki järjestelmän käyttäjätunnukset.
 * Mahdollistaa tunnuksen muokkaamisen (esim. salasanan vaihto) tai poistamisen.
 */
function UserList({ users, onEdit, onDelete }) {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">
        Käyttäjälista
      </h3>

      {users.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-900/50 rounded-lg border border-gray-700">
          <p>Ei käyttäjiä.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {users.map((u) => (
            <div 
              key={u._id} 
              className="bg-surface border border-gray-700 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4"
            >
              {/* --- KÄYTTÄJÄN TIEDOT --- */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* Rooli-badge */}
                <span className={`text-xs px-2 py-1 rounded font-bold uppercase min-w-[80px] text-center ${
                  u.role === 'admin' 
                    ? 'bg-purple-900 text-purple-200' 
                    : 'bg-green-900 text-green-200'
                }`}>
                  {u.role === 'admin' ? 'Ylläpitäjä' : 'Harjoittelija'}
                </span>

                <strong className="text-lg text-white font-medium truncate">
                  {u.username}
                </strong>
              </div>

              {/* --- TOIMINNOT --- */}
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <button 
                  className="button bg-blue-600 hover:bg-blue-500 text-sm py-1 px-3" 
                  onClick={() => onEdit(u)}
                >
                  ✎ Muokkaa
                </button>
                
                <button
                  className="button button--danger text-sm py-1 px-3"
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