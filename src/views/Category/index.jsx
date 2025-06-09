import CursorPaginate from "../Component/cursorPaginate";
import Button from "../Component/button";
import { useNavigate } from "react-router-dom";
import { encryptId } from "../Component/helperEnkripsi";
import { useState } from "react";

function CategoryList({ onDetail, onUpdate }) {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleAdd = () => {
    navigate("/category-create");
  };

  // Close dropdown when clicking outside
  // Optional enhancement: add useEffect to listen for clicks outside dropdown (not implemented here)

  return (
    <div className="p-6 max-w-3xl mx-auto relative">
      <h1 className="text-2xl font-bold mb-4">Daftar Kategori</h1>

      <CursorPaginate
        endpoint="/category"
        token={token}
        renderItem={(cat) => {
          const handleDetail = () => {
            const encrypted = encodeURIComponent(encryptId(cat.id));
            navigate(`/category-detail/${encrypted}`);
          };

          const handleUpdate = () => {
            const encrypted = encodeURIComponent(encryptId(cat.id));
            navigate(`/category-update/${encrypted}`);
          };

          return (
            <div key={cat.id} className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-4 relative">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{cat.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">Perlu Bukti: {cat.isBukti === "ya" ? "Ya" : "Tidak"}</p>
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
                    Detail
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenuId(null);
                      onUpdate ? onUpdate(cat) : handleUpdate();
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
        Tambah Kategori
      </Button>
    </div>
  );
}

export default CategoryList;
