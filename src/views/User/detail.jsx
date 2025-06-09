import { useParams } from "react-router-dom";
import { decryptId } from "../Component/helperEnkripsi";
import { useEffect, useState } from "react";
import axiosClient from "../Component/api";
import DetailLayouts from "../Layout/DetailLayouts";

function UserDetail() {
  const { id } = useParams();
  const decryptedId = decryptId(decodeURIComponent(id));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!decryptedId) {
      setError("ID tidak valid");
      setLoading(false);
      return;
    }

    axiosClient
      .get(`/user-detail/${decryptedId}`)
      .then((res) => {
        setUser(res.data?.data || res.data);
      })
      .catch((err) => {
        console.error("Gagal memuat data user:", err);
        setError("Gagal memuat data user");
      })
      .finally(() => setLoading(false));
  }, [decryptedId]);

  const fields = [
    { label: "Username", value: user?.name || "-" },
    { label: "Email", value: user?.email || "-" },
    { label: "User Code", value: user?.userCode || "-" },
  ];

  return <DetailLayouts title="Detail User" subTitle="Informasi lengkap mengenai user" fields={fields} backTo="/user-list" loading={loading} error={error} />;
}

export default UserDetail;
