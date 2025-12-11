// frontend/src/utils/api.js

/**
 * ------------------------------------------------------------------
 * API-APUKIRJASTO (DEPRECATED / VARALLA)
 * ------------------------------------------------------------------
 * HUOM: Suurin osa sovelluksesta (AdminView, QuizView jne.) käyttää nykyään
 * suoria fetch-kutsuja komponenttien sisällä paremman tilanhallinnan vuoksi.
 *
 * Tätä tiedostoa voi käyttää mallina tai apuna, jos haluaa tehdä
 * ei-komponenttisidonnaisia kutsuja.
 */

const API_URL = import.meta.env.VITE_API_URL;

// Apufunktio headerien luontiin (hakee tokenin)
const getHeaders = () => {
  const token = sessionStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

// Yleinen virheenkäsittelijä
const handleResponse = async (res) => {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error ${res.status}`);
  }
  return await res.json();
};

// ======================================================
// QUESTIONS (Kysymyspankki)
// ======================================================
export const fetchQuestions = async () => {
  const res = await fetch(`${API_URL}/questions`, { headers: getHeaders() });
  return handleResponse(res);
};

export const addQuestion = async (question) => {
  const res = await fetch(`${API_URL}/questions`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(question),
  });
  return handleResponse(res);
};

export const updateQuestion = async (id, question) => {
  const res = await fetch(`${API_URL}/questions/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(question),
  });
  return handleResponse(res);
};

export const deleteQuestion = async (id) => {
  const res = await fetch(`${API_URL}/questions/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return handleResponse(res);
};

// ======================================================
// USERS (Käyttäjät)
// ======================================================
export const fetchUsers = async () => {
  const res = await fetch(`${API_URL}/users`, { headers: getHeaders() });
  return handleResponse(res);
};

export const addUser = async (user) => {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(user),
  });
  return handleResponse(res);
};

export const updateUser = async (id, user) => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(user),
  });
  return handleResponse(res);
};

export const deleteUser = async (id) => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return handleResponse(res);
};

// ======================================================
// SETTINGS (Tenttiasetukset)
// ======================================================
export const fetchSettings = async () => {
  const res = await fetch(`${API_URL}/settings`, { headers: getHeaders() });
  return handleResponse(res);
};

export const updateSettings = async (settings) => {
  const res = await fetch(`${API_URL}/settings`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(settings),
  });
  return handleResponse(res);
};

// ======================================================
// LOGS (Lokit)
// ======================================================
export const fetchLogs = async () => {
  const res = await fetch(`${API_URL}/logs`, { headers: getHeaders() });
  return handleResponse(res);
};

// HUOM: deleteLog poistettu, koska backend ei salli lokien poistoa (Audit trail).