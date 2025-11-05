// frontend/src/components/UserManagementView.jsx
import { useState, useEffect } from "react";
import { fetchUsers, addUser, updateUser, deleteUser } from "../utils/api";
import UserForm from "./UserForm";
import UserList from "./UserList";
import { useNavigate } from "react-router-dom";
import "../index.css";

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
      if (err.message && err.message.toLowerCase().includes("401")) navigate("/");
    }
  };

  const handleSave = async (payload) => {
    try {
      if (editingUser) await updateUser(editingUser._id, payload);
      else await addUser(payload);
      await loadUsers();
      setEditingUser(null);
    } catch (err) {
      alert(err.message || "Tallennus epäonnistui");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Haluatko varmasti poistaa käyttäjän?")) return;
    try {
      await deleteUser(id);
      await loadUsers();
    } catch (err) {
      alert("Poisto epäonnistui");
    }
  };

  const logout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-box" style={{ maxWidth: "600px" }}>
        <h1 className="title">Käyttäjähallinta</h1>

        <div className="button-group">
          <button onClick={logout} className="button button--danger">
            Kirjaudu ulos
          </button>
        </div>

        <UserForm
          onSave={handleSave}
          editingUser={editingUser}
          cancelEdit={() => setEditingUser(null)}
        />
        <UserList users={users} onEdit={setEditingUser} onDelete={handleDelete} />
      </div>
    </div>
  );
}

export default UserManagementView;
