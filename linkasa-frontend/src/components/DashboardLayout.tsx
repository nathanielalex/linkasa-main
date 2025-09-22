import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
// import TopBar from "./Topbar";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

export default function DashboardLayout() {
  const { fetchUser, loading } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="bg-gray-50 min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* <TopBar /> */}
        <main className="flex-grow overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
