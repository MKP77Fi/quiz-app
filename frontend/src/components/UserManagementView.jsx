// frontend/src/components/UserManagementView.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Komponentit
import UserForm from "./UserForm";
import UserList from "./UserList";

/**
 * UserManagementView - Käyttäjähallinnan päänäkymä
 * -----------------------------------------------
 * Vastaa määrittelydokumentin lukua 5.3 (Admin-toiminnot).
 *
 * Toiminnallisuus:
 * 1. Listaa käyttäjät (GET).
 * 2. Luo uusia käyttäjiä (POST).
 * 3. Päivittää käyttäjiä (PUT).
 * 4. Poistaa käyttäjiä (DELETE).
 */
function UserManagementView() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  // Apufunktio: Autentikointiheaderit
  const getAuthHeaders = () => {
    const token = sessionStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` })
    };
  };

  // 1. HAE KÄYTTÄJÄT
  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/users`, {
        headers: getAuthHeaders()
      });

      if (res.status === 401 || res.status === 403) {
        // Jos istunto on vanhentunut, heitetään ulos
        navigate("/");
        return;
      }

      if (!res.ok) throw new Error("Käyttäjien haku epäonnistui");

      const data = await res.json();
      setUsers(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Virhe käyttäjälistan latauksessa.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // 2. TALLENNA (CREATE / UPDATE)
  const handleSave = async (payload) => {
    try {
      let url = `${API_URL}/users`;
      let method = "POST";

      // Jos muokataan, lisätään ID ja vaihdetaan metodi PUTiksi
      if (editingUser) {
        url += `/${editingUser._id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Tallennus epäonnistui");
      }

      // Päivitetään lista ja nollataan tila
      await loadUsers();
      setEditingUser(null);
      setError(""); // Nollataan mahdolliset aiemmat virheet
    } catch (err) {
      setError(`Virhe tallennuksessa: ${err.message}`);
    }
  };

  // 3. POISTA (DELETE)
  const handleDelete = async (id) => {
    if (!window.confirm("Haluatko varmasti poistaa käyttäjän? Toimintoa ei voi perua.")) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders()
      });

      if (!res.ok) throw new Error("Poisto epäonnistui");

      await loadUsers();
    } catch (err) {
      setError("Poisto epäonnistui.");
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col items-center border-b border-gray-700/50 pb-6 mb-2 gap-6">
          
          <h1 className="text-3xl font-display uppercase tracking-wider text-accent-orange text-center">
            Käyttäjähallinta
          </h1>
          
          <button 
            className="btn-cancel w-full sm:w-auto" 
            onClick={() => navigate("/admin")}
          >
            ⬅ Paluu valikkoon
          </button>
        </div>

        {/* --- VIRHEILMOITUS --- */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-lg font-bold animate-pulse text-center">
            ⚠️ {error}
          </div>
        )}

        {/* --- LOMAKE --- */}
        <div>
          <UserForm
            onSave={handleSave}
            editingUser={editingUser}
            cancelEdit={() => setEditingUser(null)}
          />
        </div>

        {/* --- LISTA --- */}
        <div>
          {loading ? (
            <div className="text-center py-10">
              <p className="text-xl font-display text-accent-turquoise animate-pulse">
                Ladataan käyttäjiä...
              </p>
            </div>
          ) : (
            <UserList 
              users={users} 
              onEdit={setEditingUser} 
              onDelete={handleDelete} 
            />
          )}
        </div>

      </div>
    </div>
  );
}

export default UserManagementView;