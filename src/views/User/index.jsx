import CursorPaginate from "../Component/cursorPaginate";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { encryptId } from "../Component/helperEnkripsi";

function UserList({ onDetail }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [activeMenuId, setActiveMenuId] = useState(null);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Daftar User</h1>
      <CursorPaginate
        endpoint="/user"
        token={token}
        renderItem={(user) => {
          const handleDetail = () => {
            const encrypted = encodeURIComponent(encryptId(user.id));
            navigate(`/user-detail/${encrypted}`);
          };

          const toggleMenu = (id) => {
            setActiveMenuId((prev) => (prev === id ? null : id));
          };

          return (
            <div key={user.id} className="relative mb-4">
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
                  </div>
                  <button onClick={() => toggleMenu(user.id)} className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full hover:bg-blue-200 transition">
                    ...
                  </button>
                  {activeMenuId === user.id && (
                    <div className="absolute top-20 right-6 z-10 w-32 bg-white rounded-md shadow-lg border border-gray-200">
                      <button
                        onClick={() => {
                          setActiveMenuId(null);
                          onDetail ? onDetail(user) : handleDetail();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                      >
                        Detail
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}

export default UserList;
