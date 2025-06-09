import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import CursorPaginate from "../Component/cursorPaginate";
import Button from "../Component/button";
import { encryptId } from "../Component/helperEnkripsi";
import { ClipboardEditIcon, ClipboardListIcon } from "lucide-react";
import axiosClient from "../Component/api"; // ✅

/*───────────────────────────────────────────────────────────
  Haversine – hitung jarak dua koordinat (meter)
───────────────────────────────────────────────────────────*/
const haversine = (lat1, lon1, lat2, lon2) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371e3;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

function AbsensiPersonal({ onDetail }) {
  const [zones, setZones] = useState([]); // ✅ zona dari API
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isInside, setIsInside] = useState(null);
  const [geoErr, setGeoErr] = useState(null);
  const [checkingLocation, setCheckingLocation] = useState(true);
  const [currentCoords, setCurrentCoords] = useState(null);

  const listMenuRef = useRef(null);
  const dropdownRef = useRef(null);
  const fabRef = useRef(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /*─────────────────── FETCH ZONES ───────────────────*/
  useEffect(() => {
    (async () => {
      try {
        const res = await axiosClient.get("/zona"); // ganti endpoint jika berbeda
        const data = res.data.data.data || [];
        const parsed = data.map((z) => ({
          nama: z.nama,
          latitude: parseFloat(z.latitude),
          longitude: parseFloat(z.longitude),
          radius_meter: parseFloat(z.radius_meter),
        }));
        setZones(parsed);
      } catch (err) {
        console.error("Gagal mengambil zona kantor:", err);
        setGeoErr("Gagal memuat data zona kantor.");
        setCheckingLocation(false);
      }
    })();
  }, []);

  /*─────────────────── CEK GEOLOCATION ───────────────────*/
  const checkLocation = useCallback(() => {
    if (zones.length === 0) return; // tunggu sampai zones tersedia

    if (!navigator.geolocation) {
      setGeoErr("Browser tidak mendukung Geolocation");
      setIsInside(false);
      setCheckingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude, accuracy } }) => {
        setCurrentCoords({ latitude, longitude, accuracy });

        const inside = zones.some((z) => {
          const distance = haversine(latitude, longitude, z.latitude, z.longitude);
          return distance <= z.radius_meter + accuracy;
        });

        setIsInside(inside);
        setGeoErr(null);
        setCheckingLocation(false);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setGeoErr(err.message);
        setIsInside(false);
        setCheckingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [zones]);

  /* Mulai pengecekan lokasi setelah zones di-load */
  useEffect(() => {
    if (zones.length > 0) {
      checkLocation();
    }
  }, [zones, checkLocation]);

  /* Close dropdown/menu saat klik di luar */
  useEffect(() => {
    function handleOutside(e) {
      if (listMenuRef.current && !listMenuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
      if (dropdownOpen && dropdownRef.current && !dropdownRef.current.contains(e.target) && fabRef.current && !fabRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [dropdownOpen]);

  /*─────────────────── HANDLER BTN ───────────────────*/
  const handleIzin = () => navigate("/izin");
  const handleAbsen = () => {
    if (isInside) navigate("/absensi/create");
    else alert("Fitur Absen hanya tersedia di dalam area kantor.");
  };

  /*─────────────────── HELPER ───────────────────*/
  const statusColor = (status) => {
    switch (status?.toLowerCase()) {
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

  const fmt = (date) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));

  /*─────────────────── RENDER ───────────────────*/
  return (
    <div className="p-6 max-w-3xl mx-auto relative">
      <h1 className="text-2xl font-bold mb-4">Daftar Absensi</h1>

      {geoErr && <p className="text-sm text-rose-600 mb-2">{geoErr}</p>}
      {checkingLocation && <p className="text-sm text-gray-500 mb-2">Mendeteksi lokasi…</p>}

      {currentCoords && (
        <p className="text-xs text-gray-600 mb-2">
          Koordinat: {currentCoords.latitude.toFixed(6)}, {currentCoords.longitude.toFixed(6)} —{" "}
          {isInside ? <span className="text-green-600 font-semibold">Di dalam zona kantor</span> : <span className="text-red-600 font-semibold">Di luar zona kantor</span>}
        </p>
      )}

      {token ? (
        <CursorPaginate
          endpoint="/absensi-personal"
          token={token}
          dataKey="data.data"
          renderItem={(absen) => {
            const { id, tanggal_awal, tanggal_akhir, status, categoryName, username, keterangan } = absen;
            const handleDetail = () => navigate(`/absensi/detail/${encodeURIComponent(encryptId(id))}`);

            return (
              <div key={id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-4 relative min-h-[120px] flex flex-col justify-between">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">{tanggal_akhir ? `${fmt(tanggal_awal)} – ${fmt(tanggal_akhir)}` : fmt(tanggal_awal)}</h3>
                    <p className="text-sm text-gray-500 truncate">
                      {username} • {categoryName ?? <span className="italic text-gray-400">Tanpa Kategori</span>}
                    </p>
                    {keterangan && <p className="text-xs mt-1 text-gray-400 line-clamp-2">{keterangan}</p>}
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${statusColor(status)}`}>{status}</span>

                  <div className="relative">
                    <button onClick={() => setActiveMenuId(activeMenuId === id ? null : id)} className="text-lg leading-none px-2 py-1 rounded hover:bg-gray-100" aria-label="Menu">
                      ⋯
                    </button>

                    {activeMenuId === id && (
                      <div ref={listMenuRef} className="absolute top-6 right-0 z-30 w-32 bg-white rounded-md shadow-md border border-gray-200">
                        <button
                          onClick={() => {
                            setActiveMenuId(null);
                            onDetail ? onDetail(absen) : handleDetail();
                          }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                        >
                          Detail
                        </button>
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

      {/* FAB + dropdown */}
      <div className="fixed bottom-6 right-6 z-40">
        <div ref={fabRef}>
          <Button onClick={() => setDropdownOpen((prev) => !prev)} />
        </div>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              ref={dropdownRef}
              key="dropdown"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="mt-3 w-44 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
            >
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  handleIzin();
                }}
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              >
                <ClipboardEditIcon className="w-4 h-4 mr-2" /> Izin
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  handleAbsen();
                }}
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              >
                <ClipboardListIcon className="w-4 h-4 mr-2" /> Absen
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AbsensiPersonal;
