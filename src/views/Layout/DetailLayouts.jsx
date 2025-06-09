import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DetailLayouts({ title = "Detail", subTitle = "Informasi Lengkap", fields = [], backTo = "/", onUpdate = null, loading = false, error = null, extraBottomContent }) {
  const navigate = useNavigate();
  if (loading) {
    return <div className="text-center text-gray-500 mt-10">Memuat data...</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      {/* Tombol Kembali */}
      <button onClick={() => navigate(backTo)} className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Kembali
      </button>

      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6">
        {/* Judul dan Update */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-500">{subTitle}</p>
          </div>
          {onUpdate && (
            <button onClick={onUpdate} className="flex items-center text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">
              <Pencil className="w-4 h-4 mr-1" />
              Update
            </button>
          )}
        </div>

        {/* Error message */}
        {error && <div className="mb-4 text-sm text-red-600 bg-red-100 px-4 py-2 rounded-lg border border-red-300">{error}</div>}

        {/* Field Items */}
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div className="flex justify-between" key={index}>
              <span className="text-gray-700 font-medium">{field.label}</span>
              <span className="text-gray-900">{field.value}</span>
            </div>
          ))}
        </div>
        {extraBottomContent && <div className="pt-6 border-t border-gray-200 mt-6 flex justify-end">{extraBottomContent}</div>}
      </div>
    </div>
  );
}
