import UpdateLayouts from "../Layout/UpdateLayouts";
import { useParams, useNavigate } from "react-router-dom";
import { decryptId } from "../Component/helperEnkripsi";
import { useEffect, useState } from "react";
import axiosClient from "../Component/api";
import { useAuth } from "../Auth/AuthContext";
import Swal from "sweetalert2";

export default function RoleUpdate() {
  const { auth } = useAuth();
  const isAdmin = auth?.user?.role?.name === "admin";
  const { id } = useParams();
  const navigate = useNavigate();
  const decryptedId = decryptId(decodeURIComponent(id));
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [error, setError] = useState(null);

  const [name, setName] = useState("");

  useEffect(() => {
    if (!decryptedId) {
      setError("ID tidak valid");
      setLoadingDetail(false);
      return;
    }

    axiosClient
      .get(`/role-detail/${decryptedId}`)
      .then((res) => {
        const roleData = res.data?.data || res.data;
        setName(roleData.name || "");
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
      await axiosClient.post(`/role-update/${decryptedId}`, {
        name,
        _method: "PUT",
      });
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Role berhasil diubah.",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/role");
      });
    } catch (err) {
      console.error("Gagal update role:", err);
      setError("Gagal menyimpan data role");
      // ✅ Show SweetAlert error message
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal menyimpan role. Silakan coba lagi!",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingDetail) {
    return <div className="text-center text-gray-500 mt-10">Memuat data...</div>;
  }

  return (
    <UpdateLayouts title="Update Role" backPath="/role" error={error} isAdmin={isAdmin} handleSubmit={handleSubmit} loadingSubmit={loadingSubmit}>
      <div>
        <label className="block text-gray-700 font-medium mb-1">Nama Role</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
      </div>
    </UpdateLayouts>
  );
}
