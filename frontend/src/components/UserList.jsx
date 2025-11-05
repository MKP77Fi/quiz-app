// frontend/src/components/UserList.jsx
import "../index.css";

function UserList({ users, onEdit, onDelete }) {
  return (
    <div className="list-container">
      <h3 className="title" style={{ fontSize: "1.5rem", textAlign: "left" }}>
        Käyttäjälista
      </h3>

      {users.length === 0 ? (
        <p>Ei käyttäjiä.</p>
      ) : (
        <ul>
          {users.map((u) => (
            <li key={u._id} className="list-item">
              <strong>{u.username}</strong> — <small>{u.role}</small>
              <div className="list-actions">
                <button className="button" onClick={() => onEdit(u)}>
                  Muokkaa
                </button>
                <button
                  className="button button--danger"
                  onClick={() => onDelete(u._id)}
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

export default UserList;
