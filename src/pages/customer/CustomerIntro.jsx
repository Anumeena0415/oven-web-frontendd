import React from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, CheckCircle, CreditCard, Star, Crown } from "lucide-react";

const CustomerIntro = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/event-planning"); // <-- your route path
  };
  return (
    <div className="p-2 sm:p-4 md:p-6 bg-gray-50">
      {/* Top badge + title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-orange-700 bg-orange-100 rounded-full">
            <Crown className="text-orange-700" size={12} />Premium Customer
          </span>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900">
            Welcome back, User!
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm hidden sm:block">
            Manage your events and track your bookings with Oveventz
          </p>
        </div>

        <button
          onClick={handleClick}
          className="mt-2 sm:mt-4 md:mt-0 px-3 sm:px-6 py-1.5 sm:py-2 hover:cursor-pointer text-white rounded-md bg-gradient-to-r from-orange-400 to-teal-600 hover:opacity-90 transition text-xs sm:text-sm">
          + Plan New Event
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mt-2 sm:mt-4 md:mt-6">
        {/* Active Events */}
        <div className="flex flex-col items-center justify-center bg-white rounded-lg sm:rounded-2xl shadow p-2 sm:p-3 md:p-4">
          <div className="p-1.5 sm:p-2 md:p-3 rounded-lg sm:rounded-xl bg-orange-100 text-orange-500">
            <CalendarDays size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </div>
          <p className="mt-1 sm:mt-2 text-gray-500 text-xs sm:text-sm">Active Events</p>
          <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900">0</p>
        </div>

        {/* Completed */}
        <div className="flex flex-col items-center justify-center bg-white rounded-lg sm:rounded-2xl shadow p-2 sm:p-3 md:p-4">
          <div className="p-1.5 sm:p-2 md:p-3 rounded-lg sm:rounded-xl bg-teal-100 text-teal-600">
            <CheckCircle size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </div>
          <p className="mt-1 sm:mt-2 text-gray-500 text-xs sm:text-sm">Completed</p>
          <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900">1</p>
        </div>

        {/* Total Spent */}
        <div className="flex flex-col items-center justify-center bg-white rounded-lg sm:rounded-2xl shadow p-2 sm:p-3 md:p-4">
          <div className="p-1.5 sm:p-2 md:p-3 rounded-lg sm:rounded-xl bg-orange-100 text-orange-500">
            <CreditCard size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </div>
          <p className="mt-1 sm:mt-2 text-gray-500 text-xs sm:text-sm">Total Spent</p>
          <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900">₹535,000</p>
        </div>

        {/* Reviews Given */}
        <div className="flex flex-col items-center justify-center bg-white rounded-lg sm:rounded-2xl shadow p-2 sm:p-3 md:p-4">
          <div className="p-1.5 sm:p-2 md:p-3 rounded-lg sm:rounded-xl bg-teal-100 text-teal-600">
            <Star size={16} className="sm:w-5 sm:h-5 md:w-6 md:h-6" />
          </div>
          <p className="mt-1 sm:mt-2 text-gray-500 text-xs sm:text-sm">Reviews Given</p>
          <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900">6</p>
        </div>
      </div>
    </div>
  );
};

export default CustomerIntro;
