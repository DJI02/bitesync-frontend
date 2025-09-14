import axios from "axios";

const API_BASE = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");

if (!API_BASE) {
  console.warn(
    "REACT_APP_API_URL is empty. Requests will go to the frontend origin and probably 404."
  );
}

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export default api;
