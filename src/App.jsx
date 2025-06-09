import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { AuthProvider } from "./views/Auth/AuthContext";
import PrivateRoute from "./views/Auth/privateRoute";
import Layout from "./views/Component/layout";

// Public pages
import LoginPage from "./views/Auth/LoginPage";
import Unauthorized from "./views/Auth/unauthorized";

// Shared pages (all logged in users)
import Index from "./views/index";
import UserPage from "./views/Userpage";

// Admin or User List & Detail pages
import CategoryList from "./views/Category/index";
import CategoryDetail from "./views/Category/detail";
import NavigationGroupList from "./views/NavigationGroup";
import NavigationGroupDetail from "./views/NavigationGroup/detail";
import RoleList from "./views/Role";
import RoleDetail from "./views/Role/detail";
import KuponList from "./views/Kupon";
import KuponDetail from "./views/Kupon/detail";
import Profile from "./views/Userpage/profile";

// Admin-only Create/Update pages
import CategoryCreate from "./views/Category/create";
import CategoryUpdate from "./views/Category/update";
import NavigationGroupCreate from "./views/NavigationGroup/create";
import NavigationGroupUpdate from "./views/NavigationGroup/update";
import RoleCreate from "./views/Role/create";
import RoleUpdate from "./views/Role/update";
import KuponCreate from "./views/Kupon/create";
import KuponUpdate from "./views/Kupon/update";
import UserList from "./views/User";
import UserDetail from "./views/User/detail";
import AbsensiList from "./views/Absensi";
import AbsensiDetail from "./views/Absensi/detail";
import AbsensiPersonal from "./views/User/absen";
import AbsensiDetailPersonal from "./views/User/detailAbsen";
import AbsensiCreate from "./views/User/createAbsen";
import GeofenceRoute from "./views/Component/geoLokasi";
import Izin from "./views/User/izin";
import FormIzin from "./views/User/formIzin";
import ZonaList from "./views/Zona";
import ZonaDetail from "./views/Zona/detail";
import ZonaUpdate from "./views/Zona/update";
import ZonaCreate from "./views/Zona/create";
import ZonaCreateGuard from "./views/Zona/zonaCreateGuard";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ──────────────────────────────── */}
          {/* 1. ✅ Public Routes (tanpa login) */}
          {/* ──────────────────────────────── */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* ─────────────────────────────────────── */}
          {/* 2. ✅ Private Routes (semua role login) */}
          {/* ─────────────────────────────────────── */}
          <Route element={<PrivateRoute allowedRoles={["admin", "user"]} />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Index />} />
              <Route path="/profile" element={<Profile />} />
              {/* List & Detail Pages (semua role) */}
              <Route path="/category" element={<CategoryList />} />
            </Route>
          </Route>

          <Route element={<PrivateRoute allowedRoles={["user"]} />}>
            <Route element={<Layout />}>
              <Route path="/absensi-karyawan" element={<AbsensiPersonal />} />
              <Route path="/absensi/detail/:id" element={<AbsensiDetailPersonal />} />
              <Route path="/izin/create/:categoryId" element={<FormIzin />} />
              <Route
                path="/absensi/create"
                element={
                  <GeofenceRoute>
                    <AbsensiCreate />
                  </GeofenceRoute>
                }
              />
              <Route path="/izin" element={<Izin />} />
            </Route>
          </Route>

          {/* ───────────────────────────────────────────── */}
          {/* 3. ✅ Admin-only Routes (butuh login + admin) */}
          {/* ───────────────────────────────────────────── */}
          <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
            <Route element={<Layout />}>
              <Route path="/category-detail/:id" element={<CategoryDetail />} />
              <Route path="/category-create" element={<CategoryCreate />} />
              <Route path="/category-update/:id" element={<CategoryUpdate />} />

              <Route path="/navigation-group" element={<NavigationGroupList />} />
              <Route path="/navigation-group/detail/:id" element={<NavigationGroupDetail />} />
              <Route path="/navigation-group/create" element={<NavigationGroupCreate />} />
              <Route path="/navigation-group/update/:id" element={<NavigationGroupUpdate />} />

              <Route path="/role" element={<RoleList />} />
              <Route path="/role-detail/:id" element={<RoleDetail />} />
              <Route path="/role-create" element={<RoleCreate />} />
              <Route path="/role-update/:id" element={<RoleUpdate />} />

              <Route path="/zona" element={<ZonaList />} />
              <Route path="/zona-detail/:id" element={<ZonaDetail />} />
              <Route
                path="/zona-create"
                element={
                  <ZonaCreateGuard>
                    <ZonaCreate />
                  </ZonaCreateGuard>
                }
              />

              <Route path="/zona-update/:id" element={<ZonaUpdate />} />

              <Route path="/kupon" element={<KuponList />} />
              <Route path="/kupon-detail/:id" element={<KuponDetail />} />
              <Route path="/kupon-create" element={<KuponCreate />} />
              <Route path="/kupon-update/:id" element={<KuponUpdate />} />

              <Route path="/user-list" element={<UserList />} />
              <Route path="/user-detail/:id" element={<UserDetail />} />

              <Route path="/absensi" element={<AbsensiList />} />
              <Route path="/absensi-detail/:id" element={<AbsensiDetail />} />
            </Route>
          </Route>

          {/* ───────────────────── */}
          {/* Fallback: Not Found */}
          {/* ───────────────────── */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
