import React, {useState, useEffect} from "react";
import { Download, Calendar, Shield, DollarSign, Building2, Users, LogOut } from "lucide-react";
import AdminContent from "../components/AdminContent";
import Footer from "../components/Footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeVendors: 0,
    totalBookings: 0,
    totalUsers: 0,
    vendorStatus: {},
    monthlyRevenue: [],
    recentBookings: [],
    pendingPayouts: 0,
    processedPayouts: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://ovevents.onrender.com";
        const token = localStorage.getItem("authToken");
        
        const response = await axios.get(`${BASE_URL}/api/admin/dashboard/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (authUser && authUser.role === "admin") {
      fetchStats();
    }
  }, [authUser]);

  // Check if user is admin
  useEffect(() => {
    if (!authUser || authUser.role !== "admin") {
      toast.error("Access denied. Admin role required.");
      // Always redirect to login page for unauthorized access
      navigate("/Login");
    }
  }, [authUser, navigate]);

  // Don't render if not admin
  if (!authUser || authUser.role !== "admin") {
    return null;
  }

  const handleClick = () => {
    navigate('/handleHome');
  }
  
  const handleServices = () => {
    navigate('/addService');
  }
  
  const handleBlog = () => {
    navigate('/add-blog');
  }
  
  const handleReviews = () => {
    navigate('/manageReviews');
  }

  // Logout function
  const handleLogout = () => {
    // Remove all auth data from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    
    // Show success message
    toast.success("Logged out successfully");
    
    // Redirect to login page
    navigate("/Login");
  }

  
  return (
    <div>
      <div className="bg-gray-50 min-h-screen p-2 sm:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <span className="bg-rose-100 text-rose-700 px-2 sm:px-4 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium inline-flex items-center gap-1 sm:gap-2">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Admin Control Center</span>
              <span className="sm:hidden">Admin</span>
            </span>
            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-4">Oveventz Admin Dashboard</h1>
            <p className="text-gray-500 mt-0.5 sm:mt-1 text-xs sm:text-base hidden sm:block">
              Comprehensive platform management and analytics
            </p>
          </div>

          <div className="flex flex-row items-center gap-2 sm:gap-3 md:gap-4 mt-2 sm:mt-4 md:mt-0 flex-wrap">
            <button 
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md bg-[#E69B83] hover:bg-[#f48965] text-white text-xs sm:text-sm transition-colors" 
              onClick={handleClick}
            >
              Home
            </button>
            <button 
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md bg-[#E69B83] hover:bg-[#f48965] text-white text-xs sm:text-sm transition-colors" 
              onClick={handleServices}
            >
              Services
            </button>
            <button 
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md bg-[#E69B83] hover:bg-[#f48965] text-white text-xs sm:text-sm transition-colors" 
              onClick={handleBlog}
            >
              Blog
            </button>
            <button 
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md bg-[#E69B83] hover:bg-[#f48965] text-white text-xs sm:text-sm transition-colors" 
              onClick={handleReviews}
            >
              Reviews
            </button>
            <button className="hidden sm:flex items-center gap-1 sm:gap-2 border border-gray-300 px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-gray-700 hover:bg-gray-100 text-xs sm:text-sm transition-colors">
              <Download size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden md:inline">Export Report</span>
            </button>
            <button className="hidden md:flex items-center gap-2 bg-gradient-to-r from-orange-400 to-green-600 px-4 py-2 rounded-lg text-white hover:opacity-90 text-sm transition-opacity">
              AI Insights
            </button>
            <button 
              onClick={handleLogout}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 bg-red-500 hover:bg-red-600 px-3 sm:px-4 py-2 rounded-lg text-white transition-all text-xs sm:text-sm"
              title="Logout"
            >
              <LogOut size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 mt-2 sm:mt-4 md:mt-8">
          {/* Total Revenue */}
          <div className="bg-white rounded-lg sm:rounded-2xl p-2 sm:p-4 md:p-6 shadow-sm flex justify-between items-center">
            <div className="flex-1 min-w-0">
              <p className="text-gray-500 text-xs sm:text-sm truncate">Total Revenue</p>
              <h2 className="text-base sm:text-xl md:text-2xl font-bold truncate">
                {loading ? "..." : `₹${stats.totalRevenue.toLocaleString('en-IN')}`}
              </h2>
            </div>
            <div className="bg-orange-100 text-orange-500 rounded-lg sm:rounded-xl p-1.5 sm:p-2 md:p-3 flex-shrink-0 ml-1">
              <DollarSign size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
          </div>

          {/* Active Vendors */}
          <div className="bg-white rounded-lg sm:rounded-2xl p-2 sm:p-4 md:p-6 shadow-sm flex justify-between items-center">
            <div className="flex-1 min-w-0">
              <p className="text-gray-500 text-xs sm:text-sm truncate">Active Vendors</p>
              <h2 className="text-base sm:text-xl md:text-2xl font-bold">
                {loading ? "..." : stats.activeVendors}
              </h2>
            </div>
            <div className="bg-blue-100 text-blue-500 rounded-lg sm:rounded-xl p-1.5 sm:p-2 md:p-3 flex-shrink-0 ml-1">
              <Building2 size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
          </div>

          {/* Total Bookings */}
          <div className="bg-white rounded-lg sm:rounded-2xl p-2 sm:p-4 md:p-6 shadow-sm flex justify-between items-center">
            <div className="flex-1 min-w-0">
              <p className="text-gray-500 text-xs sm:text-sm truncate">Total Bookings</p>
              <h2 className="text-base sm:text-xl md:text-2xl font-bold">
                {loading ? "..." : stats.totalBookings}
              </h2>
            </div>
            <div className="bg-orange-100 text-orange-500 rounded-lg sm:rounded-xl p-1.5 sm:p-2 md:p-3 flex-shrink-0 ml-1">
              <Calendar size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
          </div>

          {/* Platform Users */}
          <div className="bg-white rounded-lg sm:rounded-2xl p-2 sm:p-4 md:p-6 shadow-sm flex justify-between items-center">
            <div className="flex-1 min-w-0">
              <p className="text-gray-500 text-xs sm:text-sm truncate">Platform Users</p>
              <h2 className="text-base sm:text-xl md:text-2xl font-bold">
                {loading ? "..." : stats.totalUsers}
              </h2>
            </div>
            <div className="bg-green-100 text-green-500 rounded-lg sm:rounded-xl p-1.5 sm:p-2 md:p-3 flex-shrink-0 ml-1">
              <Users size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
          </div>
        </div>
        <AdminContent stats={stats} loading={loading} />
      </div>
      <div className="hidden sm:block">
        <Footer />
      </div>
    </div>
  );
}

