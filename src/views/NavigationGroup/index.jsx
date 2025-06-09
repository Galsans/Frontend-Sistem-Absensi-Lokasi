import { useNavigate } from "react-router-dom";
import Button from "../Component/button";
import CursorPaginate from "../Component/cursorPaginate";
import { encryptId } from "../Component/helperEnkripsi";
import { useState } from "react";

export default function NavigationGroupList({ onDetail, onUpdate }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [activeMenuId, setActiveMenuId] = useState(null);

  const handleAdd = () => {
    navigate("/navigation-group/create");
    // buka modal atau navigasi ke halaman form
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Daftar Navigation Group</h1>

      <CursorPaginate
        endpoint="/navigationGroup"
        token={token}
        renderItem={(navgroup) => {
          const handleDetail = () => {
            const encrypted = encodeURIComponent(encryptId(navgroup.id));
            navigate(`/navigation-group/detail/${encrypted}`);
          };

          const handleUpdate = () => {
            const encrypted = encodeURIComponent(encryptId(navgroup.id));
            navigate(`/navigation-group/update/${encrypted}`);
          };

          const toggleMenu = (id) => {
            setActiveMenuId((prev) => (prev === id ? null : id));
          };

          return (
            <div key={navgroup.id} className="relative bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-5 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{navgroup.roleName}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Navigation Menu: <span className="font-medium text-gray-700">{navgroup.navigationName}</span>
                  </p>
                </div>
                <button onClick={() => toggleMenu(navgroup.id)} className="text-blue-600 text-lg px-3 py-1 rounded-full hover:bg-blue-100 transition">
                  ...
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <Access label="Create Access" value={navgroup.create_access} />
                <Access label="Read Access" value={navgroup.read_access} />
                <Access label="Update Access" value={navgroup.update_access} />
                <Access label="Delete Access" value={navgroup.delete_access} />
              </div>

              {activeMenuId === navgroup.id && (
                <div className="absolute top-4 right-4 z-20 w-32 bg-white rounded-md shadow-lg border border-gray-200">
                  <button
                    onClick={() => {
                      setActiveMenuId(null);
                      onDetail ? onDetail(navgroup) : handleDetail();
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                  >
                    Detail
                  </button>
                  <button
                    onClick={() => {
                      setActiveMenuId(null);
                      onUpdate ? onUpdate(navgroup) : handleUpdate();
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

      <Button onClick={handleAdd}>Tambah</Button>
    </div>
  );
}

function Access({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="font-medium">{label}</span>
      <span className={`mt-1 ${value ? "text-green-600" : "text-red-600"}`}>{value ? "Yes" : "No"}</span>
    </div>
  );
}
