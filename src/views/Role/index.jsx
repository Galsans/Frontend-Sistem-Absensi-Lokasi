import CursorPaginate from "../Component/cursorPaginate";
import Button from "../Component/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import { useState } from "react";
// import { generateSecureToken } from "../Component/helpenc";
import { encryptId } from "../Component/helperEnkripsi";

function RoleList({ onDetail, onUpdate }) {
  const token = localStorage.getItem("token");
  const { auth } = useAuth();
  const isAdmin = auth?.user?.role?.name === "admin";
  const navigate = useNavigate();

  const [activeMenuId, setActiveMenuId] = useState(null);

  const handleAdd = () => {
    navigate("/role-create");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Daftar Role</h1>
      <CursorPaginate
        endpoint="/role"
        token={token}
        renderItem={(role) => {
          const handleDetail = () => {
            const encrypted = encodeURIComponent(encryptId(role.id));
            navigate(`/role-detail/${encrypted}`);
            // const token = generateSecureToken(8, "role-detail");
            // navigate(`/role-detail/${token}`);
          };

          const handleUpdate = () => {
            const encrypted = encodeURIComponent(encryptId(role.id));
            navigate(`/role-update/${encrypted}`);
          };

          const toggleMenu = (id) => {
            setActiveMenuId((prev) => (prev === id ? null : id));
          };

          return (
            <div key={role.id} className="relative mb-4">
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 shadow-md rounded-lg p-4 ">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{role.name}</h3>
                  </div>
                  <button onClick={() => toggleMenu(role.id)} className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full hover:bg-blue-200 transition">
                    ...
                  </button>
                  {activeMenuId === role.id && (
                    <div className="absolute top-20 right-6 z-10 w-32 bg-white rounded-md shadow-lg border border-gray-200">
                      <button
                        onClick={() => {
                          setActiveMenuId(null);
                          onDetail ? onDetail(role) : handleDetail();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                      >
                        Detail
                      </button>
                      <button
                        onClick={() => {
                          setActiveMenuId(null);
                          onUpdate ? onUpdate(role) : handleUpdate();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                      >
                        Update
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }}
      />

      {isAdmin && <Button onClick={handleAdd}>Tambah</Button>}
    </div>
  );
}

export default RoleList;
