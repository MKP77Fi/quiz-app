// frontend/src/components/QuestionList.jsx
import "../index.css";

function QuestionList({ questions, onEdit, onDelete }) {
  return (
    <div className="list-container">
      <h3 className="title" style={{ fontSize: "1.5rem", textAlign: "left" }}>
        Kysymyslista
      </h3>

      {questions.length === 0 ? (
        <p>Ei kysymyksiä tietokannassa.</p>
      ) : (
        <ul>
          {questions.map((q) => (
            <li key={q._id} className="list-item">
              <strong>{q.questionText}</strong>
              <br />
              Vaihtoehdot: {q.options.join(", ")}
              <br />
              <small>Oikea: {q.correctAnswer} | Vaikeus: {q.difficulty}</small>
              <div className="list-actions">
                <button className="button" onClick={() => onEdit(q)}>
                  Muokkaa
                </button>
                <button
                  className="button button--danger"
                  onClick={() => onDelete(q._id)}
                >
                  Poista
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default QuestionList;
