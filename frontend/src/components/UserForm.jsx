// frontend/src/components/UserForm.jsx
import { useState, useEffect } from "react";

function UserForm({ onSave, editingUser, cancelEdit }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // tyhjä tarkoittaa "ei muutosta"
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
    // Lähetetään salasana ainoastaan jos annettu
    if (password) payload.password = password;
    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <h3>{editingUser ? "Muokkaa käyttäjää" : "Lisää uusi käyttäjä"}</h3>

      <label>Käyttäjätunnus</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <label>Salasana {editingUser ? "(täytä vain jos haluat vaihtaa)" : ""}</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={editingUser ? "Jätä tyhjäksi, jos ei vaihdu" : ""}
        {...(editingUser ? {} : { required: true })}
      />

      <label>Rooli</label>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="user">Harjoittelija</option>
        <option value="admin">Admin</option>
      </select>

      <div style={{ marginTop: "10px" }}>
        <button type="submit">{editingUser ? "Tallenna" : "Lisää käyttäjä"}</button>
        {editingUser && (
          <button type="button" onClick={cancelEdit} style={{ marginLeft: "10px" }}>
            Peruuta
          </button>
        )}
      </div>
    </form>
  );
}

export default UserForm;
