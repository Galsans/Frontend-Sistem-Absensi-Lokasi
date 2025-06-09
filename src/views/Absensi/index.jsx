import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CursorPaginate from "../Component/cursorPaginate";
import Button from "../Component/button";
import { encryptId } from "../Component/helperEnkripsi";

function AbsensiList({ onDetail, onUpdate }) {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Menutup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Warna status user
  const statusColor = (status) => {
    switch (status) {
      case "approved":
      case "disetujui":
        return "bg-emerald-100 text-emerald-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "rejected":
      case "ditolak":
        return "bg-rose-100 text-rose-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Format tanggal
  const fmt = (date) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));

  return (
    <div className="p-6 max-w-3xl mx-auto relative">
      <h1 className="text-2xl font-bold mb-4">Daftar Absensi</h1>

      {token ? (
        <CursorPaginate
          endpoint="/absensi"
          token={token}
          dataKey="data.data"
          renderItem={(absen) => {
            const { id, tanggal_awal, tanggal_akhir, status, categoryName, username, keterangan } = absen;

            const handleDetail = () => navigate(`/absensi-detail/${encodeURIComponent(encryptId(id))}`);

            // const handleUpdate = () => navigate(`/absensi-update/${encodeURIComponent(encryptId(id))}`);

            return (
              <div key={id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-4 relative min-h-[120px] flex flex-col justify-between">
                {/* Header */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">{tanggal_akhir ? `${fmt(tanggal_awal)} – ${fmt(tanggal_akhir)}` : fmt(tanggal_awal)}</h3>
                    <p className="text-sm text-gray-500 truncate">
                      {username} • {categoryName ?? <span className="italic text-gray-400">Tanpa Kategori</span>}
                    </p>
                    {keterangan && <p className="text-xs mt-1 text-gray-400 line-clamp-2">{keterangan}</p>}
                  </div>

                  {/* Status Badge */}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${statusColor(status)}`}>{status}</span>

                  {/* Dropdown Toggle */}
                  <div className="relative">
                    <button onClick={() => setActiveMenuId(activeMenuId === id ? null : id)} className="text-lg leading-none px-2 py-1 rounded hover:bg-gray-100" aria-label="Menu">
                      ⋯
                    </button>

                    {activeMenuId === id && (
                      <div ref={menuRef} className="absolute top-6 right-0 z-30 w-32 bg-white rounded-md shadow-md border border-gray-200">
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            onDetail ? onDetail(absen) : handleDetail();
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                        >
                          Detail
                        </button>
                        {/* <button
                          onClick={() => {
                            setActiveMenuId(null);
                            onUpdate ? onUpdate(absen) : handleUpdate();
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                        >
                          Update
                        </button> */}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          }}
        />
      ) : (
        <p className="text-center text-gray-500">Token tidak ditemukan. Silakan login kembali.</p>
      )}
    </div>
  );
}

export default AbsensiList;
