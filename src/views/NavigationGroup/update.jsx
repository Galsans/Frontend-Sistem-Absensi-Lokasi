import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../Component/api";
import { decryptId } from "../Component/helperEnkripsi";
import { useAuth } from "../Auth/AuthContext";
import UpdateLayouts from "../Layout/UpdateLayouts";

export default function NavigationGroupCreate() {
  const { auth } = useAuth();
  const isAdmin = auth?.user?.role?.name === "admin";
  const { id } = useParams();
  const navigate = useNavigate();
  const decryptedId = decryptId(decodeURIComponent(id));
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [error, setError] = useState(null);

  const [roles, setRoles] = useState([]);
  const [menus, setMenus] = useState([]);
  const [roleId, setRoleId] = useState("");
  const [navigationMenuId, setNavigationMenuId] = useState("");
  const [createAccess, setCreateAccess] = useState(true);
  const [readAccess, setReadAccess] = useState(true);
  const [updateAccess, setUpdateAccess] = useState(true);
  const [deleteAccess, setDeleteAccess] = useState(true);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [roleRes, menuRes] = await Promise.all([axiosClient.get("/role"), axiosClient.get("/navigationMenu")]);
        setRoles(roleRes.data.data.data);
        setMenus(menuRes.data.data.data);
      } catch (err) {
        console.error("Gagal memuat data dropdown", err);
      } finally {
        setLoadingDetail(false);
      }
    };
    fetchDropdownData();
  }, []);

  useEffect(() => {
    if (decryptedId) {
      axiosClient
        .get(`/navigationGroup-detail/${decryptedId}`)
        .then((res) => {
          const group = res.data.data;
          setRoleId(group.role_id);
          setNavigationMenuId(group.navigation_menu_id);
          setCreateAccess(group.create_access === 1);
          setReadAccess(group.read_access === 1);
          setUpdateAccess(group.update_access === 1);
          setDeleteAccess(group.delete_access === 1);
        })
        .catch((err) => {
          console.error("Gagal mengambil data:", err.response?.data || err.message);
          setError("Gagal memuat data navigation group.");
        })
        .finally(() => {
          setLoadingDetail(false);
        });
    } else {
      setLoadingDetail(false);
    }
  }, [decryptedId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setError(null);

    try {
      await axiosClient.post(`/navigationGroup-update/${decryptedId}`, {
        _method: "PUT",
        role_id: roleId,
        navigation_menu_id: navigationMenuId,
        create_access: createAccess ? 1 : 0,
        read_access: readAccess ? 1 : 0,
        update_access: updateAccess ? 1 : 0,
        delete_access: deleteAccess ? 1 : 0,
      });
      navigate("/navigation-group");
    } catch (err) {
      console.error("Gagal simpan:", err);
      if (err.response?.data) {
        const { message, errors, msg } = err.response.data;
        if (errors) {
          const firstKey = Object.keys(errors)[0];
          setError(errors[firstKey][0]);
        } else {
          setError(msg || message || "Terjadi kesalahan saat menyimpan.");
        }
      } else {
        setError("Terjadi kesalahan jaringan.");
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingDetail) {
    return <div className="text-center text-gray-500 mt-10">Memuat data...</div>;
  }

  return (
    <UpdateLayouts title="Update Navigation Group" backPath="/navigation-group" error={error} isAdmin={isAdmin} handleSubmit={handleSubmit} loadingSubmit={loadingSubmit}>
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
    </UpdateLayouts>
  );
}
