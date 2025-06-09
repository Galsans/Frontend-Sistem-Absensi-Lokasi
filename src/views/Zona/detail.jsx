import { useParams, useNavigate } from "react-router-dom";
import { decryptId, encryptId } from "../Component/helperEnkripsi";
import { useEffect, useState } from "react";
import axiosClient from "../Component/api";
import DetailLayouts from "../Layout/DetailLayouts";
import formatTanggal from "../Component/formatTanggal";
import DeleteLayouts from "../Layout/DeleteLayouts";

function ZonaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const decryptedId = decryptId(decodeURIComponent(id));
  const [zona, setZona] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!decryptedId) {
      setError("ID tidak valid");
      setLoading(false);
      return;
    }

    axiosClient
      .get(`/kantorZone-detail/${decryptedId}`)
      .then((res) => {
        setZona(res.data?.data || res.data);
      })
      .catch((err) => {
        console.error("Gagal memuat data zona:", err);
        setError("Gagal memuat data zona");
      })
      .finally(() => setLoading(false));
  }, [decryptedId]);

  const handleUpdate = () => {
    const encrypted = encodeURIComponent(encryptId(decryptedId));
    navigate(`/zona-update/${encrypted}`);
  };

  const fields = [
    { label: "Nama Zona", value: zona?.name || "-" },
    { label: "Latitude", value: zona?.latitude || "-" },
    { label: "Longitude", value: zona?.longitude || "-" },
    { label: "Radius Meter", value: zona?.radius_meter || "-" },
    { label: "Dibuat Pada", value: formatTanggal(zona?.created_at) || "-" },
    { label: "Diperbarui Terakhir", value: formatTanggal(zona?.updated_at) || "-" },
  ];

  return (
    <DetailLayouts
      title="Detail Zona"
      subTitle="Informasi lengkap mengenai zona"
      fields={fields}
      backTo="/zona"
      onUpdate={handleUpdate}
      loading={loading}
      error={error}
      extraBottomContent={<DeleteLayouts id={decryptedId} endpoint="/kantorZone-delete" redirectTo="/zona" entityName="Zona" />}
    />
  );
}

export default ZonaDetail;
