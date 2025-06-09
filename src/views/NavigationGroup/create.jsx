import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../Component/api";

export default function NavigationGroupCreate() {
  const [roles, setRoles] = useState([]);
  const [menus, setMenus] = useState([]);

  const [roleId, setRoleId] = useState("");
  const [navigationMenuId, setNavigationMenuId] = useState("");
  const [createAccess, setCreateAccess] = useState(true);
  const [readAccess, setReadAccess] = useState(true);
  const [updateAccess, setUpdateAccess] = useState(true);
  const [deleteAccess, setDeleteAccess] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [roleRes, menuRes] = await Promise.all([axiosClient.get("/role"), axiosClient.get("/navigationMenu")]);
        setRoles(roleRes.data.data.data);
        setMenus(menuRes.data.data.data);
      } catch (err) {
        console.error("Gagal memuat data dropdown", err);
      }
    };

    fetchDropdownData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axiosClient.post("/navigationGroup-create", {
        role_id: roleId,
        navigation_menu_id: navigationMenuId,
        create_access: createAccess,
        read_access: readAccess,
        update_access: updateAccess,
        delete_access: deleteAccess,
      });
      navigate("/navigation-group");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        // Jika Laravel mengirim pesan di err.response.data.message
        const apiMessage = err.response.data.msg;

        // Jika Laravel mengirim pesan validasi di err.response.data.errors
        const validationErrors = err.response.data.errors;

        // Tampilkan pesan prioritas: validation → message → fallback
        if (validationErrors) {
          const firstErrorKey = Object.keys(validationErrors)[0];
          const firstErrorMessage = validationErrors[firstErrorKey][0];
          setError(firstErrorMessage);
        } else if (apiMessage) {
          setError(apiMessage);
        } else {
          setError("Terjadi kesalahan saat menyimpan data.");
        }
      } else {
        setError("Terjadi kesalahan jaringan.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Tambah Navigation Group</h2>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Role Dropdown */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Role</label>
          <select value={roleId} onChange={(e) => setRoleId(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" required>
            <option value="">-- Pilih Role --</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        {/* Navigation Menu Dropdown */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Navigation Menu</label>
          <select value={navigationMenuId} onChange={(e) => setNavigationMenuId(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" required>
            <option value="">-- Pilih Menu --</option>
            {menus.map((menu) => (
              <option key={menu.id} value={menu.id}>
                {menu.name}
              </option>
            ))}
          </select>
        </div>

        {/* Access Checkboxes */}
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={createAccess} onChange={(e) => setCreateAccess(e.target.checked)} />
            <span>Create</span>
          </label>

          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={readAccess} onChange={(e) => setReadAccess(e.target.checked)} />
            <span>Read</span>
          </label>

          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={updateAccess} onChange={(e) => setUpdateAccess(e.target.checked)} />
            <span>Update</span>
          </label>

          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={deleteAccess} onChange={(e) => setDeleteAccess(e.target.checked)} />
            <span>Delete</span>
          </label>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}
