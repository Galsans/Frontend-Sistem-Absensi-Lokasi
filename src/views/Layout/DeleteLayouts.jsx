import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useNavigate } from "react-router-dom";
import axiosClient from "../Component/api";

const MySwal = withReactContent(Swal);

export default function DeleteLayouts({ id, endpoint, redirectTo, entityName }) {
  const navigate = useNavigate();

  const handleDelete = () => {
    MySwal.fire({
      title: `Hapus ${entityName}?`,
      text: `Data ${entityName} yang dihapus tidak dapat dikembalikan.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      cancelButtonText: "Batal",
      confirmButtonText: "Ya, hapus!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient
          .delete(`${endpoint}/${id}`)
          .then(() => {
            MySwal.fire({
              title: "Berhasil!",
              text: `${entityName} berhasil dihapus.`,
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              navigate(redirectTo);
            });
          })
          .catch((error) => {
            console.error("Gagal menghapus:", error);
            MySwal.fire("Gagal", "Terjadi kesalahan saat menghapus data.", "error");
          });
      }
    });
  };

  return (
    <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition">
      Hapus {entityName}
    </button>
  );
}
