// ZonaCreateGuard.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosClient from "../Component/api";

export default function ZonaCreateGuard({ children }) {
  const [allowed, setAllowed] = useState(null); // null=loading

  useEffect(() => {
    (async () => {
      const res = await axiosClient.get("/kantorZone?limit=1");
      const total = res.data?.data?.total ?? res.data?.data?.length;
      setAllowed(total === 0); // hanya boleh jika total = 0
    })();
  }, []);

  if (allowed === null) return <p>Mengecek izin…</p>;
  if (!allowed) return <Navigate to="/zona" replace />;

  return children; // render <ZonaCreate/>
}
