const isLocal =
  location.hostname === "localhost" || location.hostname === "127.0.0.1";

export const API_BASE = isLocal
  ? "http://localhost:3000/api"
  : "https://bookkeep-8vm7.onrender.com/api";
