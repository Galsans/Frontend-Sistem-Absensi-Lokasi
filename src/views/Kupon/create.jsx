import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../Component/api";
import Swal from "sweetalert2";

export default function KuponCreate() {
  const [user_id, setUserId] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch data user dari API saat komponen pertama kali dimuat
  useEffect(() => {
    axiosClient
      .get("/user") // pastikan endpoint ini sesuai dengan backend-mu
      .then((res) => {
        setUsers(res.data.data || res.data); // sesuaikan struktur response
      })
      .catch((err) => {
        console.error("Gagal mengambil data user:", err);
        setError("Gagal memuat daftar user");
      })
      .finally(() => setLoadingUsers(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!user_id || !jumlah) {
      setError("Semua field wajib diisi");
      setLoading(false);
      return;
    }

    try {
      await axiosClient.post("/kupon-create", {
        user_id,
        jumlah: parseInt(jumlah),
      });
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Kupon berhasil ditambahkan.",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/kupon");
      });
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan data");
      // ✅ Show SweetAlert error message
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal menyimpan kupon. Silakan coba lagi!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tambah Kupon</h2>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Pilih User</label>
          <select value={user_id} onChange={(e) => setUserId(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required disabled={loadingUsers}>
            <option value="">-- Pilih User --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Jumlah</label>
          <input type="number" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={jumlah} onChange={(e) => setJumlah(e.target.value)} required />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}
