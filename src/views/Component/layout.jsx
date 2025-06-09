import { useState } from "react";
import Sidebar from "./sidebar";
import Topbar from "./topbar";
import { Outlet } from "react-router-dom";

export default function Layout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <Topbar onMenuClick={handleToggleSidebar} />

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 pt-20">
          <Outlet />
        </main>
        {/* <main className="pt-20 md:ml-64 px-4">{children}</main> */}
      </div>
    </div>
  );
}
