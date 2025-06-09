import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../Component/api";
import { useAuth } from "../Auth/AuthContext";
import Swal from "sweetalert2";

const formatDatetimeLocal = (date) => {
  const pad = (n) => n.toString().padStart(2, "0");
  return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()) + "T" + pad(date.getHours()) + ":" + pad(date.getMinutes());
};

export default function AbsenCreate() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const user = auth?.user;

  const [tanggalAwal, setTanggalAwal] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const now = new Date();
    setTanggalAwal(formatDatetimeLocal(now));

    // Get current location
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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!tanggalAwal || !keterangan || !latitude || !longitude) {
      setError("Semua field wajib diisi, termasuk lokasi.");
      return;
    }

    try {
      setLoading(true);
      await axiosClient.post("/absensi-create", {
        user_id: user.id,
        tanggal_awal: tanggalAwal,
        keterangan,
        latitude,
        longitude,
      });
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Absen berhasil ditambahkan.",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/absensi-karyawan");
      });
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan data");
      // ✅ Show SweetAlert error message
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal menyimpan absen. Silakan coba lagi!",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="text-center mt-10">Sedang memuat data pengguna...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tambah Absen</h2>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="hidden">
          <label className="block text-gray-700 font-medium mb-1">User</label>
          <input type="text" value={user?.name || "-"} disabled className="w-full border border-gray-300 bg-gray-100 rounded-lg px-4 py-2" />
        </div>

        {/* Tanggal & Waktu */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Tanggal &amp; Waktu</label>
          <input type="datetime-local" value={tanggalAwal} disabled className="w-full border border-gray-300 rounded-lg px-4 py-2" />
        </div>

        {/* Keterangan */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Keterangan</label>
          <textarea value={keterangan} onChange={(e) => setKeterangan(e.target.value)} rows={4} required className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none" />
        </div>

        {/* Lokasi (optional preview) */}
        <div className="text-sm text-gray-500 hidden">
          Lokasi saat ini:{" "}
          {latitude && longitude ? (
            <span className="text-gray-800">
              {latitude}, {longitude}
            </span>
          ) : (
            <span>Menunggu lokasi...</span>
          )}
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}
