import { useEffect, useState } from "react";
import { UserIcon, MailIcon, BadgeCheck, Briefcase } from "lucide-react";
import axiosClient from "../Component/api";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosClient.get("/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(res.data.data[0]);
        setProfile(res.data.data[0]);
      } catch (err) {
        console.error("Gagal mengambil data profil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600 animate-pulse text-lg">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Gagal memuat data profil.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-4xl shadow">
            <UserIcon size={40} />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-gray-800">{profile.name}</h2>
        </div>

        <div className="mt-6 space-y-4">
          <InfoItem icon={<MailIcon />} label="Email" value={profile.email} />
          <InfoItem icon={<BadgeCheck />} label="User Code" value={profile.userCode} />
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center bg-gray-50 p-3 rounded-md shadow-sm">
      <div className="w-8 h-8 text-blue-600 flex items-center justify-center mr-3">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-md font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}
