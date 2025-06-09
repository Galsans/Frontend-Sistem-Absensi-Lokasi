import { useParams, useNavigate } from "react-router-dom";
import { decryptId } from "../Component/helperEnkripsi";
import { useEffect, useState } from "react";
import axiosClient from "../Component/api";
import { useAuth } from "../Auth/AuthContext";
import UpdateLayouts from "../Layout/UpdateLayouts";
import Swal from "sweetalert2";

function KuponUpdate() {
  const { auth } = useAuth();
  const isAdmin = auth?.user?.role?.name === "admin";
  const { id } = useParams();
  const navigate = useNavigate();
  const decryptedId = decryptId(decodeURIComponent(id));

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [error, setError] = useState(null);

  const [user, setUser] = useState([]);
  const [name, setName] = useState("");
  const [jumlah, setJumlah] = useState("");

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const userRes = await axiosClient.get("/user");
        setUser(userRes.data.data.data);
      } catch (err) {
        console.error("Gagal memuat data dropdown", err);
      } finally {
        setLoadingDetail(false);
      }
    };
    fetchDropdownData();
  }, []);

  useEffect(() => {
    if (decryptedId) {
      axiosClient
        .get(`/kupon-detail/${decryptedId}`)
        .then((res) => {
          const group = res.data.data;
          setName(group.user_id);
          setJumlah(group.jumlah);
        })
        .catch((err) => {
          console.error("Gagal mengambil data:", err.response?.data || err.msg);
          setError("Gagal memuat data navigation group.");
        })
        .finally(() => {
          setLoadingDetail(false);
        });
    } else {
      setLoadingDetail(false);
    }
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
      await axiosClient.post(`/kupon-update/${decryptedId}`, {
        user_id: name,
        jumlah,
        _method: "PUT",
      });
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Kupon berhasil diubah.",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/kupon");
      });
    } catch (err) {
      console.error("Gagal update kupon:", err);
      const serverError = err.response?.data?.msg || "Gagal menyimpan data";
      setError(serverError);
      // ✅ Show SweetAlert error message
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal menyimpan kupon. Silakan coba lagi!",
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingDetail) {
    return <div className="text-center text-gray-500 mt-10">Memuat data...</div>;
  }

  return (
    <UpdateLayouts title="Update Kupon" backPath="/kupon" error={error} isAdmin={isAdmin} handleSubmit={handleSubmit} loadingSubmit={loadingSubmit}>
      <div>
        <label className="block text-gray-700 font-medium mb-1">Nama User</label>
        <select value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" required>
          <option value="">-- Pilih Name --</option>
          {user.map((user) => (
            <option key={user.id} value={user.id}>
              {user.email}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">Jumlah</label>
        <input type="number" className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={jumlah} onChange={(e) => setJumlah(e.target.value)} required />
      </div>
    </UpdateLayouts>
  );
}

export default KuponUpdate;
