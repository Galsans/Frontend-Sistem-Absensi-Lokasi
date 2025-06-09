import { useParams, useNavigate } from "react-router-dom";
import { decryptId } from "../Component/helperEnkripsi";
import { useEffect, useState } from "react";
import axiosClient from "../Component/api";
import { useAuth } from "../Auth/AuthContext";
import UpdateLayouts from "../Layout/UpdateLayouts";
import Swal from "sweetalert2";

function UpdateCategory() {
  const { auth } = useAuth();
  const isAdmin = auth?.user?.role?.name === "admin";
  const { id } = useParams();
  const navigate = useNavigate();
  const decryptedId = decryptId(decodeURIComponent(id));

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [error, setError] = useState(null);

  const [name, setName] = useState("");
  const [isBukti, setIsBukti] = useState("");

  useEffect(() => {
    if (!decryptedId) {
      setError("ID tidak valid");
      setLoadingDetail(false);
      return;
    }

    axiosClient
      .get(`/category-detail/${decryptedId}`)
      .then((res) => {
        const data = res.data?.data || res.data;
        setName(data.name || "");
        setIsBukti(data.isBukti === "ya" ? "ya" : "tidak");
      })
      .catch((err) => {
        console.error("Gagal memuat kategori:", err);
        setError("Gagal memuat data kategori");
      })
      .finally(() => setLoadingDetail(false));
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
      await axiosClient.post(`/category-update/${decryptedId}`, {
        name,
        isBukti,
        _method: "PUT",
      });
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Category Perizinan berhasil diubah.",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/category");
      });
    } catch (err) {
      console.error("Gagal update kategori:", err);
      const serverError = err.response?.data?.msg || "Gagal menyimpan data";
      setError(serverError);
      // ✅ Show SweetAlert error message
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal menyimpan category. Silakan coba lagi!",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingDetail) {
    return <div className="text-center text-gray-500 mt-10">Memuat data...</div>;
  }

  return (
    <UpdateLayouts title="Update Category" backPath="/category" error={error} isAdmin={isAdmin} handleSubmit={handleSubmit} loadingSubmit={loadingSubmit}>
      <div>
        <label className="block text-gray-700 font-medium mb-1">Nama Kategori</label>
        <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">Perlu Bukti?</label>
        <div className="flex space-x-6 mt-2">
          <label className="flex items-center space-x-2">
            <input type="radio" value="ya" checked={isBukti === "ya"} onChange={(e) => setIsBukti(e.target.value)} className="form-radio text-blue-600" />
            <span>Ya</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="radio" value="tidak" checked={isBukti === "tidak"} onChange={(e) => setIsBukti(e.target.value)} className="form-radio text-blue-600" />
            <span>Tidak</span>
          </label>
        </div>
      </div>
    </UpdateLayouts>
  );
}

export default UpdateCategory;
