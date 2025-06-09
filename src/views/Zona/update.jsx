import UpdateLayouts from "../Layout/UpdateLayouts";
import { useParams, useNavigate } from "react-router-dom";
import { decryptId } from "../Component/helperEnkripsi";
import { useEffect, useState } from "react";
import axiosClient from "../Component/api";
import { useAuth } from "../Auth/AuthContext";
import Swal from "sweetalert2";

export default function ZonaUpdate() {
  const { auth } = useAuth();
  const isAdmin = auth?.user?.role?.name === "admin";
  const { id } = useParams();
  const navigate = useNavigate();
  const decryptedId = decryptId(decodeURIComponent(id));
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [error, setError] = useState(null);

  const [nama, setNama] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radius_meter, setRadiusMeter] = useState("");

  useEffect(() => {
    if (!decryptedId) {
      setError("ID tidak valid");
      setLoadingDetail(false);
      return;
    }

    axiosClient
      .get(`/kantorZone-detail/${decryptedId}`)
      .then((res) => {
        const zona = res.data?.data || res.data;
        setNama(zona.nama || "");
        setLatitude(zona.latitude || "");
        setLongitude(zona.longitude || "");
        setRadiusMeter(zona.radius_meter || "");
      })
      .catch((err) => {
        console.error("Error saat memuat data role:", err);
        setError("Gagal memuat data role");
      })
      .finally(() => {
        setLoadingDetail(false);
      });
  }, [decryptedId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!decryptedId) {
      setError("ID tidak valid");
      return;
    }

    setLoadingSubmit(true);
    setError(null);

    try {
      await axiosClient.post(`/kantorZone-update/${decryptedId}`, {
        nama,
        latitude,
        longitude,
        radius_meter,
        _method: "PUT",
      });
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Kantor Zona berhasil diubah.",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/zona");
      });
    } catch (err) {
      console.error("Gagal update kantor zona:", err);
      setError("Gagal menyimpan data kantor zona");
      // ✅ Show SweetAlert error message
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal menyimpan kantor zona. Silakan coba lagi!",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingDetail) {
    return <div className="text-center text-gray-500 mt-10">Memuat data...</div>;
  }

  return (
    <UpdateLayouts title="Update Kantor Zona" backPath="/zona" error={error} isAdmin={isAdmin} handleSubmit={handleSubmit} loadingSubmit={loadingSubmit}>
      <div>
        <label className="block text-gray-700 font-medium mb-1">Nama Zona</label>
        <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-1">Latitude</label>
        <input type="text" value={latitude} onChange={(e) => setLatitude(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-1">Longitude</label>
        <input type="text" value={longitude} onChange={(e) => setLongitude(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
      </div>
      <div>
        <label className="block text-gray-700 font-medium mb-1">Radius Meter</label>
        <input type="number" value={radius_meter} onChange={(e) => setRadiusMeter(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
      </div>
    </UpdateLayouts>
  );
}
