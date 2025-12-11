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
    <div className="mt-8">
      <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">
        Kysymyslista
      </h3>

      {questions.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-900/50 rounded-lg border border-gray-700">
          <p>Ei kysymyksiä tietokannassa.</p>
          <p className="text-sm mt-2">Lisää ensimmäinen kysymys yllä olevalla lomakkeella.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {questions.map((q) => (
            <div 
              key={q._id} 
              className="bg-surface border border-gray-700 p-4 rounded-lg shadow-sm hover:border-gray-500 transition-colors flex flex-col md:flex-row justify-between gap-4"
            >
              {/* --- KYSYMYKSEN TIEDOT --- */}
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${
                    q.difficulty === 'hard' ? 'bg-red-900 text-red-200' :
                    q.difficulty === 'medium' ? 'bg-yellow-900 text-yellow-200' :
                    'bg-green-900 text-green-200'
                  }`}>
                    {q.difficulty || 'medium'}
                  </span>
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                    {q.points || 1} pistettä
                  </span>
                </div>

                <h4 className="text-lg font-semibold text-white mb-2">
                  {q.questionText}
                </h4>

                <div className="text-sm text-gray-400">
                  <p className="mb-1">
                    <span className="font-medium text-gray-500">Vaihtoehdot: </span> 
                    {q.options.join(", ")}
                  </p>
                  <p className="text-green-400 font-medium">
                    <span className="text-gray-500">Oikea vastaus: </span> 
                    {q.correctAnswer}
                  </p>
                </div>
              </div>

              {/* --- TOIMINNOT --- */}
              <div className="flex flex-row md:flex-col gap-2 min-w-[100px]">
                <button 
                  className="button bg-blue-600 hover:bg-blue-500 text-sm py-1" 
                  onClick={() => onEdit(q)}
                >
                  ✎ Muokkaa
                </button>
                <button
                  className="button button--danger text-sm py-1"
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