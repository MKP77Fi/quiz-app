// frontend/src/components/UserManagementView.jsx
import { useState, useEffect } from "react";
import { fetchUsers, addUser, updateUser, deleteUser } from "../utils/api";
import UserForm from "./UserForm";
import UserList from "./UserList";
import { useNavigate } from "react-router-dom";

function UserManagementView() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      console.error("Käyttäjien haku epäonnistui:", err);
      // Jos token ei kelpaa, ohjataan kirjautumiseen
      if (err.message && err.message.toLowerCase().includes("401")) {
        navigate("/");
      }
    }
  };

  const handleSave = async (payload) => {
    try {
      if (editingUser) {
        await updateUser(editingUser._id, payload);
      } else {
        await addUser(payload);
      }
      await loadUsers();
      setEditingUser(null);
    } catch (err) {
      console.error("Käyttäjän tallennus epäonnistui:", err);
      alert(err.message || "Tallennus epäonnistui");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Haluatko varmasti poistaa käyttäjän?")) return;
    try {
      await deleteUser(id);
      await loadUsers();
    } catch (err) {
      console.error("Käyttäjän poisto epäonnistui:", err);
      alert("Poisto epäonnistui");
    }
  };

  const logout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Käyttäjähallinta</h1>
      <button onClick={logout} style={{ marginBottom: "20px" }}>
        Kirjaudu ulos
      </button>

      <UserForm onSave={handleSave} editingUser={editingUser} cancelEdit={() => setEditingUser(null)} />
      <UserList users={users} onEdit={setEditingUser} onDelete={handleDelete} />
    </div>
  );
}

export default UserManagementView;
