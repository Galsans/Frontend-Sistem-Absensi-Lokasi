import { useParams, useNavigate } from "react-router-dom";
import { decryptId, encryptId } from "../Component/helperEnkripsi";
import { useEffect, useState } from "react";
import axiosClient from "../Component/api";
import DetailLayouts from "../Layout/DetailLayouts";
import formatTanggal from "../Component/formatTanggal";
import DeleteLayouts from "../Layout/DeleteLayouts";

function CategoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const decryptedId = decryptId(decodeURIComponent(id));
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!decryptedId) {
      setError("ID tidak valid");
      setLoading(false);
      return;
    }

    axiosClient
      .get(`/category-detail/${decryptedId}`)
      .then((res) => {
        setCategory(res.data?.data || res.data);
      })
      .catch((err) => {
        console.error("Gagal memuat data category:", err);
        setError("Gagal memuat data category");
      })
      .finally(() => setLoading(false));
  }, [decryptedId]);

  const handleUpdate = () => {
    const encrypted = encodeURIComponent(encryptId(decryptedId));
    navigate(`/category-update/${encrypted}`);
  };

  const fields = [
    { label: "Nama Category", value: category?.name || "-" },
    { label: "Perlu Bukti", value: category?.isBukti || "-" },
  ];

  return (
    <DetailLayouts
      title="Detail Category"
      subTitle="Informasi lengkap mengenai category"
      fields={fields}
      backTo="/category"
      onUpdate={handleUpdate}
      loading={loading}
      error={error}
      extraBottomContent={<DeleteLayouts id={decryptedId} endpoint="/category-delete" redirectTo="/category" entityName="Category" />}
    />
  );
}

export default CategoryDetail;
