// frontend/src/components/UserForm.jsx
import { useState, useEffect } from "react";

/**
 * UserForm - Käyttäjätunnuksen hallintalomake
 * -------------------------------------------
 * Vastaa määrittelydokumentin lukuja 4.1 ja 5.3.
 *
 * Tätä lomaketta käytetään kahdessa tilanteessa:
 * 1. Uuden käyttäjän luonti (Create)
 * 2. Olemassa olevan käyttäjän muokkaus (Update), esim. salasanan resetointi.
 */
function UserForm({ onSave, editingUser, cancelEdit }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  // Täytetään lomake, jos muokataan olemassa olevaa käyttäjää
  useEffect(() => {
    if (editingUser) {
      setUsername(editingUser.username || "");
      setRole(editingUser.role || "user");
      setPassword(""); // Tietoturva: Salasanaa ei koskaan haeta backendistä näkyviin
    } else {
      setUsername("");
      setPassword("");
      setRole("user");
    }
  }, [editingUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const payload = { username, role };
    
    // Lähetetään salasana vain jos se on syötetty (uusi käyttäjä tai vaihto)
    if (password) {
      payload.password = password;
    }
    
    onSave(payload);
  };

  return (
    <div className="bg-surface border border-gray-700 p-6 rounded-lg shadow-lg mb-8">
      <h3 className="text-xl font-bold text-accent-turquoise mb-6 border-b border-gray-700 pb-2">
        {editingUser ? "Muokkaa käyttäjää" : "Lisää uusi käyttäjä"}
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {/* --- KÄYTTÄJÄTUNNUS --- */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Käyttäjätunnus
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="esim. Kurssi_Kevat_2024"
            className="input w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Käytä geneeristä tunnusta, ei henkilön nimeä (GDPR).
          </p>
        </div>

        {/* --- SALASANA --- */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Salasana {editingUser ? <span className="text-xs font-normal text-gray-500">(täytä vain jos haluat vaihtaa)</span> : ""}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={editingUser ? "Jätä tyhjäksi, jos ei vaihdu" : "Syötä vahva salasana"}
            // Uutta käyttäjää luodessa salasana on pakollinen
            {...(editingUser ? {} : { required: true })}
            className="input w-full"
          />
        </div>

        {/* --- ROOLI --- */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Rooli
          </label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
            className="input w-full bg-gray-900"
          >
            <option value="user">Harjoittelija (Vain tentti/harjoittelu)</option>
            <option value="admin">Admin (Täydet oikeudet)</option>
          </select>
        </div>

        {/* --- PAINIKKEET --- */}
        <div className="flex gap-3 mt-4">
          <button 
            type="submit" 
            className="button flex-1 bg-green-600 hover:bg-green-500"
          >
            {editingUser ? "💾 Tallenna muutokset" : "➕ Lisää käyttäjä"}
          </button>
          
          {editingUser && (
            <button 
              type="button" 
              onClick={cancelEdit} 
              className="button button--danger flex-none px-6"
            >
              Peruuta
            </button>
          )}
        </div>

      </form>
    </div>
  );
}

export default UserForm;