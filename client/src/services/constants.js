export const BASE_URL =
  location.hostname === "localhost"
    ? "/api"
    : import.meta.env.VITE_API_BASE_URL;
