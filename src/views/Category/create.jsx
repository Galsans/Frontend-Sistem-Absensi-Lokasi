import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../Component/api";
import Swal from "sweetalert2";

export default function CategoryCreate() {
  const [name, setName] = useState("");
  const [isBukti, setIsBukti] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Kirim data ke backend
      await axiosClient.post("/category-create", {
        name,
        isBukti,
      });
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Category berhasil ditambahkan.",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/category");
      });
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan data");
      // ✅ Show SweetAlert error message
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal menyimpan category. Silakan coba lagi!",
      });
      // Tidak redirect, biarkan user tetap di form
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tambah Kategori</h2>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Nama Kategori</label>
          <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Perlu Bukti?</label>
          <select value={isBukti} onChange={(e) => setIsBukti(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            <option value="" disabled>
              -- Pilih Perlu Bukti --
            </option>
            <option value="ya">Ya</option>
            <option value="tidak">Tidak</option>
          </select>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}
