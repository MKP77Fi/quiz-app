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
  const API_URL = import.meta.env.VITE_API_URL;

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
    <div className="panel max-w-4xl mx-auto mt-6">
      <div className="flex flex-col gap-4">
        
        {/* Otsikko ja paluupainike */}
        <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-4">
          <h1 className="text-2xl font-bold text-accent-turquoise">
            Käyttäjähallinta
          </h1>
          <button 
            className="button bg-gray-600 hover:bg-gray-500 text-sm px-4 py-2" 
            onClick={() => navigate("/admin")}
          >
            ⬅ Paluu valikkoon
          </button>
        </div>

        {/* Virheilmoitus */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded font-bold mb-4">
            {error}
          </div>
        )}

        {/* Lomake */}
        <div className="mb-8">
          <UserForm
            onSave={handleSave}
            editingUser={editingUser}
            cancelEdit={() => setEditingUser(null)}
          />
        </div>

        {/* Lista */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-white">
            Käyttäjät ({users.length} kpl)
          </h2>
          
          {loading ? (
            <p className="text-center text-gray-400">Ladataan käyttäjiä...</p>
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