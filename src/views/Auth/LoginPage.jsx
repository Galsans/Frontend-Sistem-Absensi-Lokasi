import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axiosClient from "../Component/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // untuk tombol loading

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const response = await axiosClient.post("/login", { email, password });

      const { access_token, user } = response.data;

      if (!access_token || !user) {
        setError("Login gagal: Token atau user tidak ditemukan.");
        setLoading(false);
        return;
      }

      login({ user, access_token });
      navigate("/dashboard");
    } catch (err) {
      console.error("Login Error:", err);

      // Tangkap error JSON yang kamu kirim dari API
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error); // <- tampilkan "Invalid credentials"
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mb-3 px-3 py-2 border rounded" required />

        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mb-4 px-3 py-2 border rounded" required />

        {error && <p className="text-red-500 text-sm mb-2 text-center">{error}</p>}

        <button type="submit" disabled={loading} className={`w-full py-2 rounded text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600"}`}>
          {loading ? "Memproses..." : "Login"}
        </button>
      </form>
    </div>
  );
}
