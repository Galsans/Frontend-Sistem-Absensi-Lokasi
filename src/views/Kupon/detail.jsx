import { useParams, useNavigate } from "react-router-dom";
import { decryptId, encryptId } from "../Component/helperEnkripsi";
import { useEffect, useState } from "react";
import axiosClient from "../Component/api";
import DetailLayouts from "../Layout/DetailLayouts";
import formatTanggal from "../Component/formatTanggal";
import DeleteLayouts from "../Layout/DeleteLayouts";

function KuponDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const decryptedId = decryptId(decodeURIComponent(id));
  const [kupon, setKupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!decryptedId) {
      setError("ID tidak valid");
      setLoading(false);
      return;
    }

    axiosClient
      .get(`/kupon-detail/${decryptedId}`)
      .then((res) => {
        setKupon(res.data?.data || res.data);
      })
      .catch((err) => {
        console.error("Gagal memuat data kupon:", err);
        setError("Gagal memuat data kupon");
      })
      .finally(() => setLoading(false));
  }, [decryptedId]);

  const handleUpdate = () => {
    const encrypted = encodeURIComponent(encryptId(decryptedId));
    navigate(`/kupon-update/${encrypted}`);
  };

  const fields = [
    { label: "Nama User", value: kupon?.user.name || "-" },
    { label: "Jumlah Kupon", value: kupon?.jumlah || "-" },
  ];

  return (
    <DetailLayouts
      title="Detail Kupon"
      subTitle="Informasi lengkap mengenai kupon"
      fields={fields}
      backTo="/kupon"
      onUpdate={handleUpdate}
      loading={loading}
      error={error}
      extraBottomContent={<DeleteLayouts id={decryptedId} endpoint="/kupon-delete" redirectTo="/kupon" entityName="Kupon" />}
    />
  );
}

export default KuponDetail;
