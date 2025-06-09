import { useParams, useNavigate } from "react-router-dom";
import { decryptId } from "../Component/helperEnkripsi";
import { useEffect, useState } from "react";
import axiosClient from "../Component/api";
import { ArrowLeft } from "lucide-react";

export default function AbsensiDetail() {
  const { id: encId } = useParams();
  const navigate = useNavigate();
  const decryptedId = decryptId(decodeURIComponent(encId));

  const [absensi, setAbsensi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // GET DETAIL
  useEffect(() => {
    if (!decryptedId) {
      setError("ID tidak valid");
      setLoading(false);
      return;
    }

    axiosClient
      .get(`/absensi-personal/detail/${decryptedId}`)
      .then((res) => setAbsensi(res.data?.data))
      .catch(() => setError("Gagal memuat data absensi"))
      .finally(() => setLoading(false));
  }, [decryptedId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Memuat data…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const imgUrl = absensi?.bukti ? `${import.meta.env.VITE_API_BASE_URL}${absensi.bukti}` : null;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Detail Absensi</h1>

      {/* Card */}
      <div className="bg-white shadow-lg rounded-2xl p-8 relative">
        {/* Gambar Bukti */}
        {imgUrl ? (
          <div className="flex justify-center mb-6">
            <img src={imgUrl} alt="Bukti Absensi" className="w-64 h-auto rounded-lg shadow-md border" />
          </div>
        ) : (
          <p className="text-center text-sm text-gray-500 mb-6">Tidak ada bukti terlampir</p>
        )}

        {/* Detail Teks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-gray-700 text-sm">
          <DetailItem label="Nama Pegawai" value={absensi?.user?.name} />
          <DetailItem label="Kategori" value={absensi?.category?.name} />
          <DetailItem label="Tanggal" value={`${formatDate(absensi?.tanggal_awal)} – ${formatDate(absensi?.tanggal_akhir)}`} />
          <DetailItem label="Status" value={absensi?.status} />
          <DetailItem label="HR Status" value={absensi?.hr_status} />
          <DetailItem label="Keterangan" value={absensi?.keterangan} />
        </div>

        <div className="mt-10 flex justify-end space-x-4">
          <button onClick={() => navigate(-1)} className="flex items-center text-sm text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────── DetailItem sub-component ─────────── */
function DetailItem({ label, value }) {
  return (
    <div>
      <p className="font-medium">{label}</p>
      <p className="text-gray-900">{value ?? "-"}</p>
    </div>
  );
}

/* ─────────────── Helper Format Tanggal ─────────────── */
function formatDate(str) {
  if (!str) return "-";
  return new Date(str).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
