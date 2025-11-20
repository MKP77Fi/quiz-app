// frontend/src/utils/api.js

// API_URL valitaan ympäristömuuttujasta tai fallbackiksi localhost
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const getHeaders = () => {
  const token = sessionStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

// ======================================================
// QUESTIONS
// ======================================================
export const fetchQuestions = async () => {
  const res = await fetch(`${API_URL}/questions`, { headers: getHeaders() });
  if (!res.ok) throw new Error("Kysymysten haku epäonnistui");
  return await res.json();
};

export const addQuestion = async (question) => {
  const res = await fetch(`${API_URL}/questions`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(question),
  });
  if (!res.ok) throw new Error("Kysymyksen lisääminen epäonnistui");
  return await res.json();
};

export const updateQuestion = async (id, question) => {
  const res = await fetch(`${API_URL}/questions/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(question),
  });
  if (!res.ok) throw new Error("Kysymyksen päivittäminen epäonnistui");
  return await res.json();
};

export const deleteQuestion = async (id) => {
  const res = await fetch(`${API_URL}/questions/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Kysymyksen poistaminen epäonnistui");
  return await res.json();
};

// ======================================================
// USERS
// ======================================================
export const fetchUsers = async () => {
  const res = await fetch(`${API_URL}/users`, { headers: getHeaders() });
  if (!res.ok) throw new Error("Käyttäjien haku epäonnistui");
  return await res.json();
};

export const addUser = async (user) => {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(user),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || "Käyttäjän lisääminen epäonnistui");
  }
  return await res.json();
};

export const updateUser = async (id, user) => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(user),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || "Käyttäjän päivitys epäonnistui");
  }
  return await res.json();
};

export const deleteUser = async (id) => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Käyttäjän poistaminen epäonnistui");
  return await res.json();
};

// ======================================================
// SETTINGS (tenttiasetukset)
// ======================================================
export const fetchSettings = async () => {
  const res = await fetch(`${API_URL}/settings`, { headers: getHeaders() });
  if (!res.ok) throw new Error("Asetusten haku epäonnistui");
  return await res.json();
};

export const updateSettings = async (settings) => {
  const res = await fetch(`${API_URL}/settings`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error("Asetusten tallennus epäonnistui");
  return await res.json();
};

// ======================================================
// LOGS (järjestelmälogit)
// ======================================================
export const fetchLogs = async () => {
  const res = await fetch(`${API_URL}/logs`, { headers: getHeaders() });
  if (!res.ok) throw new Error("Lokitietojen haku epäonnistui");
  return await res.json();
};

export const deleteLog = async (id) => {
  const res = await fetch(`${API_URL}/logs/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Lokitietueen poistaminen epäonnistui");
  return await res.json();
};
