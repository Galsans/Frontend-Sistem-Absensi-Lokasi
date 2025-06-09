import { useParams, useNavigate } from "react-router-dom";
import { decryptId, encryptId } from "../Component/helperEnkripsi";
import { useEffect, useState } from "react";
import axiosClient from "../Component/api";
import DetailLayouts from "../Layout/DetailLayouts";
import formatTanggal from "../Component/formatTanggal";
import DeleteLayouts from "../Layout/DeleteLayouts";

function NavigationGroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const decryptedId = decryptId(decodeURIComponent(id));
  const [navGroup, setNavigationGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!decryptedId) {
      setError("ID tidak valid");
      setLoading(false);
      return;
    }

    axiosClient
      .get(`/navigationGroup-detail/${decryptedId}`)
      .then((res) => {
        setNavigationGroup(res.data?.data || res.data);
      })
      .catch((err) => {
        console.error("Gagal memuat data navigation group:", err);
        setError("Gagal memuat data navigation group");
      })
      .finally(() => setLoading(false));
  }, [decryptedId]);

  const handleUpdate = () => {
    const encrypted = encodeURIComponent(encryptId(decryptedId));
    navigate(`/navigation-group/update/${encrypted}`);
  };

  const fields = [
    { label: "Nama Role", value: navGroup?.role?.name || "-" },
    { label: "Nama Navigation Menu", value: navGroup?.navigation_menu?.name || "-" },
    { label: "Create Access", value: formatBoolean(navGroup?.create_access) || "-" },
    { label: "Read Access", value: formatBoolean(navGroup?.read_access) || "-" },
    { label: "Update Access", value: formatBoolean(navGroup?.update_access) || "-" },
    { label: "Delete Access", value: formatBoolean(navGroup?.delete_access) || "-" },
  ];

  return (
    <DetailLayouts
      title="Detail Navigation Group"
      subTitle="Informasi lengkap mengenai navigation group"
      fields={fields}
      backTo="/navigation-group"
      onUpdate={handleUpdate}
      loading={loading}
      error={error}
      extraBottomContent={<DeleteLayouts id={decryptedId} endpoint="/navigationGroup-delete" redirectTo="/navigation-group" entityName="Navigation Group" />}
    />
  );
}

export default NavigationGroupDetail;

function formatBoolean(value) {
  return value === true || value === 1 ? "Yes" : "No";
}
