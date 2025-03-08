import axios from "axios";

// console.log(import.meta.env.VITE_BACKEND_URL, import.meta.env.MODE);
export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api/v1" // for local development
      : import.meta.env.VITE_BACKEND_URL, // for production
  withCredentials: true, // to handle cookies and sessions
});
