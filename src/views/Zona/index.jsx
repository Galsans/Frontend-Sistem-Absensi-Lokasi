import CursorPaginate from "../Component/cursorPaginate";
import Button from "../Component/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import { useEffect, useState } from "react";
import { encryptId } from "../Component/helperEnkripsi";
import axiosClient from "../Component/api";

function ZonaList() {
  const token = localStorage.getItem("token");
  const { auth } = useAuth();
  const isAdmin = auth?.user?.role?.name === "admin";
  const navigate = useNavigate();

  const [items, setItems] = useState([]); // page items
  const [total, setTotal] = useState(null); // jumlah zona di DB
  const [menuId, setMenuId] = useState(null);

  // const [activeMenuId, setActiveMenuId] = useState(null);

  /* ── Ambil TOTAL zona satu kali ── */
  useEffect(() => {
    (async () => {
      try {
        const res = await axiosClient.get("/kantorZone?limit=1"); // limit kecil = cukup ambil meta
        setTotal(res.data?.data?.total ?? res.data?.data?.length); // sesuaikan struktur respons
      } catch (e) {
        console.error(e);
        setTotal(0);
      }
    })();
  }, []);

  /* ── Handler tambah ── */
  const handleAdd = () => {
    if (total === 0) navigate("/zona-create");
    else alert("Zona kantor sudah ada, tidak bisa menambah lagi.");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Zona Kantor</h1>

      {/* List dengan CursorPaginate */}
      <CursorPaginate
        endpoint="/kantorZone"
        token={token}
        dataKey="data.data" // <– kalau struktur { data: { data: [...] } }
        onData={(page, meta) => {
          setItems(page);
          /*  pastikan total di-update juga supaya realtime */
          if (meta?.total !== undefined) setTotal(meta.total);
        }}
        renderItem={(z) => (
          <CardZona
            key={z.id}
            zona={z}
            isActive={menuId === z.id}
            onToggle={() => setMenuId(menuId === z.id ? null : z.id)}
            onDetail={() => navigate(`/zona-detail/${encodeURIComponent(encryptId(z.id))}`)}
            onUpdate={() => navigate(`/zona-update/${encodeURIComponent(encryptId(z.id))}`)}
          />
        )}
      />

      {/* Tombol Tambah – hanya admin & hanya kalau total === 0  */}
      {isAdmin && total !== null && total === 0 && <Button onClick={handleAdd}>Tambah</Button>}
    </div>
  );
}

function CardZona({ zona, isActive, onToggle, onDetail, onUpdate }) {
  return (
    <div className="relative mb-4">
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">{zona.nama}</h3>

          <button onClick={onToggle} className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full hover:bg-blue-200 transition">
            …
          </button>

          {isActive && (
            <div className="absolute top-12 right-6 w-32 bg-white rounded-md shadow-lg border">
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={onDetail}>
                Detail
              </button>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100" onClick={onUpdate}>
                Update
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ZonaList;
