function QuestionList({ questions, onEdit, onDelete }) {
  return (
    <div>
      <h3>Kysymyslista</h3>
      {questions.length === 0 ? (
        <p>Ei kysymyksiä tietokannassa.</p>
      ) : (
        <ul>
          {questions.map((q) => (
            <li key={q._id} style={{ marginBottom: "10px" }}>
              <strong>{q.questionText}</strong>
              <br />
              Vaihtoehdot: {q.options.join(", ")}
              <br />
              <small>Oikea: {q.correctAnswer} | Vaikeus: {q.difficulty}</small>
              <br />
              <button onClick={() => onEdit(q)}>Muokkaa</button>
              <button onClick={() => onDelete(q._id)}>Poista</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default QuestionList;
