// frontend/src/components/QuestionList.jsx

/**
 * QuestionList - Kysymyspankin listaus
 * ------------------------------------
 * Vastaa määrittelydokumentin lukua 5.3 (Admin-toiminnot).
 *
 * Näyttää kaikki järjestelmään tallennetut kysymykset kortteina.
 * Tarjoaa toiminnot yksittäisen kysymyksen muokkaamiseen ja poistamiseen.
 */
function QuestionList({ questions, onEdit, onDelete }) {
  return (
    <div className="mt-12 w-full max-w-4xl mx-auto">
      
      {/* --- OTSIKKO --- */}
      <h3 className="text-2xl font-display uppercase tracking-wider text-accent-orange mb-6 border-b border-gray-700/50 pb-4">
        Kysymyspankki ({questions.length})
      </h3>

      {questions.length === 0 ? (
        // --- TYHJÄ LISTA ---
        <div className="panel text-center py-12">
          <p className="text-xl text-gray-400 mb-2">Ei kysymyksiä tietokannassa.</p>
          <p className="text-sm text-gray-600">
            Lisää ensimmäinen kysymys yllä olevalla lomakkeella.
          </p>
        </div>
      ) : (
        // --- KYSYMYSKORTIT ---
        <div className="flex flex-col gap-5">
          {questions.map((q) => (
            <div 
              key={q._id} 
              className="bg-gray-900/40 border border-gray-700/50 p-6 rounded-xl hover:border-accent-turquoise/50 transition-colors duration-300 flex flex-col md:flex-row justify-between gap-6 shadow-sm"
            >
              {/* --- KYSYMYKSEN TIEDOT --- */}
              <div className="flex-grow space-y-3">
                
                {/* Tagit: Vaikeus ja Pisteet */}
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded font-bold uppercase tracking-wider border ${
                    q.difficulty === 'hard' 
                      ? 'bg-red-900/20 border-red-500/50 text-red-400' 
                      : q.difficulty === 'medium' 
                      ? 'bg-yellow-900/20 border-yellow-500/50 text-yellow-400' 
                      : 'bg-green-900/20 border-green-500/50 text-green-400'
                  }`}>
                    {q.difficulty === 'easy' ? 'Helppo' : q.difficulty === 'medium' ? 'Keskitaso' : 'Vaikea'}
                  </span>
                  
                  <span className="text-xs bg-gray-800 border border-gray-600 text-gray-300 px-2 py-1 rounded font-mono">
                    {q.points || 1} p
                  </span>
                </div>

                {/* Kysymysteksti */}
                <h4 className="text-lg font-bold text-white leading-relaxed">
                  {q.questionText}
                </h4>

                {/* Vastaukset */}
                <div className="text-sm space-y-1">
                  <p className="text-gray-400">
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wide block mb-1">Vaihtoehdot:</span> 
                    {q.options.join(", ")}
                  </p>
                  
                  <div className="pt-2">
                     <span className="text-xs font-bold text-gray-600 uppercase tracking-wide mr-2">Oikea vastaus:</span>
                     <span className="text-accent-turquoise font-bold">{q.correctAnswer}</span>
                  </div>
                </div>
              </div>

              {/* --- TOIMINNOT (Napit) --- */}
              <div className="flex flex-row md:flex-col gap-3 min-w-[140px] justify-center">
                <button 
                  className="btn-action text-sm py-2" 
                  onClick={() => onEdit(q)}
                >
                  ✎ Muokkaa
                </button>
                <button
                  className="btn-cancel text-sm py-2"
                  onClick={() => onDelete(q._id)}
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

export default QuestionList;