import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UpdateLayouts({ title = "Update", backPath = "/", error, isAdmin = false, children, handleSubmit, loadingSubmit = false }) {
  const navigate = useNavigate();

  if (!isAdmin) {
    return <div className="text-center mt-10 text-red-500 font-semibold">Akses ditolak. Halaman ini hanya bisa diakses oleh admin.</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      {/* Tombol Kembali */}
      <button onClick={() => navigate(backPath)} className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Kembali
      </button>

      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Pencil className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>

        {/* Error Message */}
        {error && <div className="mb-4 text-sm text-red-600 bg-red-100 px-4 py-2 rounded-lg border border-red-300">{error}</div>}

        {/* Form Input (Admin Only) */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {children}

          <button type="submit" disabled={loadingSubmit} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
            {loadingSubmit ? "Mengubah..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
}
