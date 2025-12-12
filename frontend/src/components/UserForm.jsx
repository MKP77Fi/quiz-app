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
    <div className="bg-surface border border-gray-700/50 p-6 rounded-2xl shadow-lg mb-8 animate-fade-in">
      
      {/* --- OTSIKKO --- */}
      <h3 className="text-xl font-display uppercase tracking-wider text-accent-turquoise mb-6 border-b border-gray-700/50 pb-2">
        {editingUser ? "Muokkaa käyttäjää" : "Lisää uusi käyttäjä"}
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* --- KÄYTTÄJÄTUNNUS --- */}
        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">
            Käyttäjätunnus
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="esim. Kurssi_Kevat_2024"
            className="input-field"
          />
          <p className="text-xs text-gray-500 mt-2 italic">
            Käytä geneeristä tunnusta, ei henkilön nimeä (GDPR).
          </p>
        </div>

        {/* --- SALASANA JA ROOLI (Rinnakkain) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Salasana */}
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">
              Salasana {editingUser && <span className="text-[10px] font-normal text-gray-500 lowercase">(täytä vain jos vaihdat)</span>}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={editingUser ? "Jätä tyhjäksi, jos ei vaihdu" : "Syötä vahva salasana"}
              // Uutta käyttäjää luodessa salasana on pakollinen
              {...(editingUser ? {} : { required: true })}
              className="input-field"
            />
          </div>

          {/* Rooli */}
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">
              Rooli
            </label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              className="input-field bg-gray-900 cursor-pointer"
            >
              <option value="user">Harjoittelija (Vain tentti/harjoittelu)</option>
              <option value="admin">Admin (Täydet oikeudet)</option>
            </select>
          </div>

        </div>

        {/* --- PAINIKKEET --- */}
        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <button 
            type="submit" 
            className="btn-action flex-1"
          >
            {editingUser ? "💾 Tallenna muutokset" : "➕ Lisää käyttäjä"}
          </button>
          
          {editingUser && (
            <button 
              type="button" 
              onClick={cancelEdit} 
              className="btn-cancel sm:w-auto"
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