import CursorPaginate from "../Component/cursorPaginate";
import { useNavigate } from "react-router-dom";
import { encryptId } from "../Component/helperEnkripsi";
import { useState } from "react";

function Izin({ onDetail }) {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-3xl mx-auto relative">
      <h1 className="text-2xl font-bold mb-4">List Izin</h1>

      <CursorPaginate
        endpoint="/listIzin"
        token={token}
        renderItem={(cat) => {
          const handleDetail = () => {
            const encrypted = encodeURIComponent(encryptId(cat.id));
            navigate(`/izin/create/${encrypted}`);
          };

          return (
            <div key={cat.id} className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-4 relative">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{cat.name}</h3>
                </div>
                <button onClick={() => setActiveMenuId(activeMenuId === cat.id ? null : cat.id)} className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full hover:bg-blue-200 transition">
                  ...
                </button>
              </div>

              {activeMenuId === cat.id && (
                <div className="absolute top-12 right-6 z-20 w-32 bg-white rounded-md shadow-lg border border-gray-200">
                  <button
                    onClick={() => {
                      setActiveMenuId(null);
                      onDetail ? onDetail(cat) : handleDetail();
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                  >
                    Pilih Izin Ini?
                  </button>
                </div>
              )}
            </div>
          );
        }}
      />
    </div>
  );
}

export default Izin;
