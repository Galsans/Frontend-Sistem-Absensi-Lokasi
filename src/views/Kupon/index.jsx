import CursorPaginate from "../Component/cursorPaginate";
import Button from "../Component/button";
import { useNavigate } from "react-router-dom";
import { encryptId } from "../Component/helperEnkripsi";
import { useState } from "react";

function KuponList({ onDetail, onUpdate }) {
  const token = localStorage.getItem("token");
  const [activeMenuId, setActiveMenuId] = useState(null);
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate("/kupon-create");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto relative">
      <h1 className="text-2xl font-bold mb-4">Daftar Kupon</h1>

      <CursorPaginate
        endpoint="/kupon"
        token={token}
        renderItem={(kupon) => {
          const handleDetail = () => {
            const encrypted = encodeURIComponent(encryptId(kupon.id));
            navigate(`/kupon-detail/${encrypted}`);
          };

          const handleUpdate = () => {
            const encrypted = encodeURIComponent(encryptId(kupon.id));
            navigate(`/kupon-update/${encrypted}`);
          };

          return (
            <div key={kupon.id} className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-4 relative">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Nama User: {kupon.userName}</h3>
                  <p className="text-sm text-gray-500 mt-1">Jumlah: {kupon.jumlah}</p>
                </div>
                <button onClick={() => setActiveMenuId(activeMenuId === kupon.id ? null : kupon.id)} className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full hover:bg-blue-200 transition">
                  ...
                </button>
              </div>

              {activeMenuId === kupon.id && (
                <div className="absolute top-12 right-6 z-20 w-32 bg-white rounded-md shadow-lg border border-gray-200">
                  <button
                    onClick={() => {
                      setActiveMenuId(null);
                      onDetail ? onDetail(kupon) : handleDetail();
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                  >
                    Detail
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenuId(null);
                      onUpdate ? onUpdate(kupon) : handleUpdate();
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                  >
                    Update
                  </button>
                </div>
              )}
            </div>
          );
        }}
      />

      <Button onClick={handleAdd} className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
        Tambah Kupon
      </Button>
    </div>
  );
}

export default KuponList;
