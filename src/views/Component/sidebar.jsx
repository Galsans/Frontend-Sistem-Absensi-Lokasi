import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FingerprintIcon, Home, Layers, MapIcon, NavigationIcon, TicketIcon, UserIcon, Users, Users2Icon, X } from "lucide-react";
import axiosClient from "./api";

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const [allowedMenus, setAllowedMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  const isActive = (path) => location.pathname === path;

  const allMenus = [
    { name: "Category", label: "Perizinan", route: "/category", icon: <Layers /> },
    { name: "Role", label: "Role", route: "/role", icon: <Users /> },
    { name: "NavigationGroup", label: "Navigation Group", route: "/navigation-group", icon: <NavigationIcon /> },
    { name: "Kupon", label: "Kupon", route: "/kupon", icon: <TicketIcon /> },
    { name: "User", label: "User", route: "/user-list", icon: <Users2Icon /> },
    { name: "KantorZone", label: "Zona Kantor", route: "/zona", icon: <MapIcon /> },
    { name: "Absensi", label: "Absensi", route: "/absensi", icon: <FingerprintIcon /> },
    { name: "AbsensiPersonal", label: "Absensi", route: "/absensi-karyawan", icon: <FingerprintIcon /> },
  ];

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get("/user-navigation", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const allowedNames = res.data.map((menu) => menu.name);
        const filtered = allMenus.filter((menu) => allowedNames.includes(menu.name));
        setAllowedMenus(filtered);
      } catch (err) {
        console.error("Failed to load menu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={onClose}></div>}

      <aside className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg border-r z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-blue-600">G-Absens</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <NavItem to="/dashboard" icon={<Home />} active={isActive("/dashboard")} label="Dashboard" />
          <NavItem to="/profile" icon={<UserIcon />} active={isActive("/profile")} label="Profile" />

          {loading
            ? // Placeholder skeletons (adjust count as needed)
              Array.from({ length: 4 }).map((_, idx) => <div key={idx} className="animate-pulse h-8 bg-gray-200 rounded-md w-full"></div>)
            : allowedMenus.map((menu) => <NavItem key={menu.name} to={menu.route} icon={menu.icon} active={isActive(menu.route)} label={menu.label} />)}
        </nav>
      </aside>
    </>
  );
}

function NavItem({ to, icon, active, label }) {
  return (
    <Link to={to} className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${active ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}>
      <div className="w-5 h-5 mr-2">{icon}</div>
      {label}
    </Link>
  );
}
