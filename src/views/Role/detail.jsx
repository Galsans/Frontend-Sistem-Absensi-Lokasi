import { useParams, useNavigate } from "react-router-dom";
import { decryptId, encryptId } from "../Component/helperEnkripsi";
import { useEffect, useState } from "react";
import axiosClient from "../Component/api";
import DetailLayouts from "../Layout/DetailLayouts";
import formatTanggal from "../Component/formatTanggal";
import DeleteLayouts from "../Layout/DeleteLayouts";

function RoleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const decryptedId = decryptId(decodeURIComponent(id));
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!decryptedId) {
      setError("ID tidak valid");
      setLoading(false);
      return;
    }

    axiosClient
      .get(`/role-detail/${decryptedId}`)
      .then((res) => {
        setRole(res.data?.data || res.data);
      })
      .catch((err) => {
        console.error("Gagal memuat data role:", err);
        setError("Gagal memuat data role");
      })
      .finally(() => setLoading(false));
  }, [decryptedId]);

  const handleUpdate = () => {
    const encrypted = encodeURIComponent(encryptId(decryptedId));
    navigate(`/role-update/${encrypted}`);
  };

  const fields = [
    { label: "Nama Role", value: role?.name || "-" },
    { label: "Dibuat Pada", value: formatTanggal(role?.created_at) || "-" },
    { label: "Diperbarui Terakhir", value: formatTanggal(role?.updated_at) || "-" },
  ];

  return (
    <DetailLayouts
      title="Detail Role"
      subTitle="Informasi lengkap mengenai role"
      fields={fields}
      backTo="/role"
      onUpdate={handleUpdate}
      loading={loading}
      error={error}
      extraBottomContent={<DeleteLayouts id={decryptedId} endpoint="/role-delete" redirectTo="/role" entityName="Role" />}
    />
  );
}

export default RoleDetail;
