import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { AdminContext } from "../context/AdminContext";
import { Loader } from "lucide-react";

import DashboardStats from "../components/DashboardStats";
import ViewsChart from "../components/ViewsChart";
import TopViewedPosts from "../components/TopViewedPosts";
import TopCommentedPosts from "../components/TopCommentedPost";

const Dashboard = () => {
   const { adminToken, backendUrl, axiosAuth } = useContext(AdminContext);
   const [stats, setStats] = useState({});
   const [analytics, setAnalytics] = useState({});
   const [loading, setLoading] = useState(true);

   const headers = {
      headers: { Authorization: `Bearer ${adminToken}` },
   };

   useEffect(() => {
      const fetchData = async () => {
         try {
            const [summaryRes, analyticsRes] = await Promise.all([
               axiosAuth.get(`${backendUrl}/api/admin/dashboard/summary`, headers),
               axiosAuth.get(`${backendUrl}/api/admin/dashboard/analytics?range=7`, headers),
            ]);
            setStats(summaryRes.data.overviewData);
            setAnalytics(analyticsRes.data.analyticsData);
         } catch (err) {
            console.error("Dashboard load error:", err);
            toast.error(err.response?.data?.message || "Failed to load dashboard data");
         } finally {
            setLoading(false);
         }
      };
      fetchData();
   }, [adminToken, backendUrl]);

   if (loading) return <div className="bg-zinc-950 min-h-screen flex justify-center items-center">
      <Loader className="text-blue-400 w-10 h-10 animate-spin" />
   </div>;

   return (
      <div className="p-6 md:p-8 space-y-8 bg-[#121212] min-h-screen">
         {/* Welcome + Quick Stats */ }
         <DashboardStats stats={ stats } />

         {/* Analytics Row */ }
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ViewsChart data={ analytics.viewsOverTime } />
            <TopViewedPosts posts={ analytics.topViewedPosts } />
         </div>

         {/* Comment Insights */ }
         <TopCommentedPosts posts={ analytics.topCommentedPosts } />
      </div>
   );
};

export default Dashboard;
