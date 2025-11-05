// frontend/src/components/UserForm.jsx
import { useState, useEffect } from "react";
import "../index.css";

function UserForm({ onSave, editingUser, cancelEdit }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  useEffect(() => {
    if (editingUser) {
      setUsername(editingUser.username || "");
      setRole(editingUser.role || "user");
      setPassword("");
    } else {
      setUsername("");
      setPassword("");
      setRole("user");
    }
  }, [editingUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { username, role };
    if (password) payload.password = password;
    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="panel" style={{ marginBottom: "20px" }}>
      <h3 className="title" style={{ fontSize: "1.5rem", marginBottom: "20px" }}>
        {editingUser ? "Muokkaa käyttäjää" : "Lisää uusi käyttäjä"}
      </h3>

      <label>Käyttäjätunnus</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="input"
      />

      <label>Salasana {editingUser ? "(täytä vain jos haluat vaihtaa)" : ""}</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={editingUser ? "Jätä tyhjäksi, jos ei vaihdu" : ""}
        {...(editingUser ? {} : { required: true })}
        className="input"
      />

      <label>Rooli</label>
      <select value={role} onChange={(e) => setRole(e.target.value)} className="input">
        <option value="user">Harjoittelija</option>
        <option value="admin">Admin</option>
      </select>

      <div className="button-group">
        <button type="submit" className="button">
          {editingUser ? "Tallenna" : "Lisää käyttäjä"}
        </button>
        {editingUser && (
          <button type="button" onClick={cancelEdit} className="button button--danger">
            Peruuta
          </button>
        )}
      </div>
    </form>
  );
}

export default UserForm;
