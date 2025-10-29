// frontend/src/components/UserList.jsx
function UserList({ users, onEdit, onDelete }) {
  return (
    <div>
      <h3>Käyttäjälista</h3>
      {users.length === 0 ? (
        <p>Ei käyttäjiä.</p>
      ) : (
        <ul>
          {users.map((u) => (
            <li key={u._id} style={{ marginBottom: "10px" }}>
              <strong>{u.username}</strong> — <small>{u.role}</small>
              <br />
              <button onClick={() => onEdit(u)}>Muokkaa</button>
              <button onClick={() => onDelete(u._id)} style={{ marginLeft: "8px" }}>
                Poista
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserList;
