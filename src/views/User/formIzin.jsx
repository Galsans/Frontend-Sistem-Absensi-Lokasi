import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../Component/api";
import { useAuth } from "../Auth/AuthContext";
import { decryptId } from "../Component/helperEnkripsi";
import Swal from "sweetalert2";

export default function FormIzin() {
  const { categoryId } = useParams(); // encrypted id from URL
  const { auth } = useAuth();
  const user = auth?.user;

  const [category_id, setCategoryId] = useState(""); // final category ID to send
  const [tanggal_awal, setTanggalAwal] = useState("");
  const [tanggal_akhir, setTanggalAkhir] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [bukti, setBukti] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (categoryId) {
      try {
        const decrypted = decryptId(decodeURIComponent(categoryId));
        setCategoryId(decrypted);
      } catch (e) {
        console.error("Gagal mendekripsi categoryId:", e);
        setError("Kategori izin tidak valid.");
      }
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (err) => {
          console.error("Gagal mendapatkan lokasi:", err);
          setError("Gagal mendapatkan lokasi. Pastikan izin lokasi diaktifkan.");
        }
      );
    } else {
      setError("Geolocation tidak didukung oleh browser ini.");
    }
  }, [categoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("user_id", user.id);
      formData.append("category_id", category_id);
      formData.append("tanggal_awal", tanggal_awal);
      formData.append("tanggal_akhir", tanggal_akhir);
      formData.append("keterangan", keterangan);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);
      if (bukti) {
        formData.append("bukti", bukti);
      }

      await axiosClient.post(`/izin-create/${category_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Izin berhasil ditambahkan.",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/absensi-karyawan");
      });
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan data izin");
      // ✅ Show SweetAlert error message
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal menyimpan izin. Silakan coba lagi!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Form Izin</h2>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Kategori Izin hanya ditampilkan sebagai label */}
        <div className="hidden">
          <label className="block text-gray-700 font-medium mb-1">Kategori Izin</label>
          <input type="text" value={category_id} disabled className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100" />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Tanggal Awal</label>
          <input type="date" value={tanggal_awal} onChange={(e) => setTanggalAwal(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" required />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Tanggal Akhir</label>
          <input type="date" value={tanggal_akhir} onChange={(e) => setTanggalAkhir(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" required />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Keterangan</label>
          <textarea value={keterangan} onChange={(e) => setKeterangan(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" required />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Upload Bukti (Opsional)</label>
          <input type="file" accept="image/png,image/jpg,image/jpeg" onChange={(e) => setBukti(e.target.files[0])} className="w-full" />
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}
