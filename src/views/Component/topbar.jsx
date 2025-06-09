import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axiosClient from "./api";

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Yakin ingin logout?",
      text: "Kamu akan keluar dari sesi saat ini.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosClient.post(
            "/logout",
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          localStorage.removeItem("token");

          Swal.fire("Berhasil!", "Kamu telah logout.", "success").then(() => {
            navigate("/login");
          });
        } catch (error) {
          Swal.fire("Gagal!", "Terjadi kesalahan saat logout.", "error");
          console.error("Logout error:", error);
        }
      }
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white shadow-md flex items-center px-4 justify-between">
      <div className="flex items-center gap-2">
        <button onClick={onMenuClick}>
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">G-Absens</h1>
      </div>
      <button onClick={handleLogout} className="text-sm text-red-500 font-semibold hover:underline">
        Logout
      </button>
    </header>
  );
}
