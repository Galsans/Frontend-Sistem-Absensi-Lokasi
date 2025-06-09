import { useEffect, useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import axiosClient from "../Component/api"; // ganti path sesuai struktur project-mu

// Haversine – hitung jarak dua koordinat (meter)
const haversine = (lat1, lon1, lat2, lon2) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371e3;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function GeofenceRoute({ children }) {
  const [allowed, setAllowed] = useState(null);
  const [geoErr, setGeoErr] = useState("");
  const [coords, setCoords] = useState(null);
  const [zones, setZones] = useState([]);

  // Ambil data kantor dari API
  const fetchZones = async () => {
    try {
      const response = await axiosClient.get("/zona");
      const { data } = response.data.data;
      const parsedZones = data.map((z) => ({
        nama: z.nama,
        latitude: parseFloat(z.latitude),
        longitude: parseFloat(z.longitude),
        radius_meter: parseFloat(z.radius_meter),
      }));
      setZones(parsedZones);
    } catch (error) {
      console.error("Gagal mengambil zona kantor:", error);
      setGeoErr("Gagal memuat data zona kantor.");
      setAllowed(false);
    }
  };

  const checkLocation = useCallback(() => {
    setAllowed(null);
    setGeoErr("");
    setCoords(null);

    if (!("geolocation" in navigator)) {
      setGeoErr("Browser tidak mendukung Geolocation.");
      setAllowed(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude, accuracy } = coords;
        setCoords({ latitude, longitude, accuracy });

        const isInside = zones.some((z) => {
          const distance = haversine(latitude, longitude, z.latitude, z.longitude);
          return distance <= z.radius_meter + accuracy;
        });

        setAllowed(isInside);
      },
      (err) => {
        setGeoErr(`Gagal mengambil lokasi: ${err.message}`);
        setAllowed(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [zones]);

  useEffect(() => {
    fetchZones();
  }, []);

  useEffect(() => {
    if (zones.length > 0) {
      checkLocation();
    }
  }, [zones, checkLocation]);

  useEffect(() => {
    if (!navigator.permissions) return;
    navigator.permissions.query({ name: "geolocation" }).then((perm) => {
      if (perm.state === "denied") {
        setGeoErr("Izin lokasi ditolak. Aktifkan lokasi di pengaturan browser.");
        setAllowed(false);
      }
    });
  }, []);

  if (allowed === null) {
    return <p style={{ textAlign: "center" }}>Mengecek lokasi…</p>;
  }

  if (!allowed) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <p>Kamu berada di luar area kantor {coords && `(${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)})`}.</p>
        {geoErr && <p style={{ color: "red" }}>{geoErr}</p>}

        <button onClick={checkLocation} style={{ marginTop: 8 }}>
          Coba Lagi
        </button>

        <div style={{ marginTop: 16 }}>
          <button onClick={() => setAllowed(true)} style={{ background: "#ddd", padding: "4px 10px" }}>
            Paksa Lanjut (Override)
          </button>
        </div>

        <Navigate to="/absensi" replace />
      </div>
    );
  }

  return children;
}
