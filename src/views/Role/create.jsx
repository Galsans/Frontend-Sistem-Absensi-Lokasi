import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../Component/api";
import { ArrowLeft, Pencil } from "lucide-react";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2

export default function RoleCreate() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axiosClient.post("/role-create", { name });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Role berhasil ditambahkan.",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/role");
      });
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan data");

      // ✅ Show SweetAlert error message
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal menyimpan role. Silakan coba lagi!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <button onClick={() => navigate("/role")} className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Kembali ke Daftar Role
      </button>

      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Pencil className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Tambah Role</h2>
        </div>

        {error && <div className="mb-4 px-4 py-2 rounded-lg bg-red-100 text-red-700 border border-red-300">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Nama Role</label>
            <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <button type="submit" disabled={loading} className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-300 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}>
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </form>
      </div>
    </div>
  );
}
