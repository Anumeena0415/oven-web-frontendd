import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, CreditCard, Crown, MessageCircle, Star, Shield, Clock, Award } from "lucide-react";

const CustomerContent = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/event-planning"); // <-- your route path
    };

    const tabs = [
        { id: "overview", label: "Overview" },
        { id: "events", label: "My Events" },
        { id: "payments", label: "Payments" },
        { id: "support", label: "Support" },
    ];

    const events = [
        { id: 1, title: "Oveventz Premium Event", date: "12/15/2024", price: 200000, status: "Completed", payment: "Partially Paid" },
        { id: 2, title: "Oveventz Premium Event", date: "10/20/2024", price: 25000, status: "Confirmed", payment: "Unpaid" },
        { id: 3, title: "Oveventz Premium Event", date: "11/5/2024", price: 150000, status: "Confirmed", payment: "Paid" },
    ];

    const payments = [
        { id: 1, label: "Event Payment - 12/15/2024", invoice: "#482bbc1f", amount: 200000, status: "Partially Paid" },
        { id: 2, label: "Event Payment - 10/20/2024", invoice: "#bd2b49a9", amount: 25000, status: "Unpaid" },
        { id: 3, label: "Event Payment - 11/5/2024", invoice: "#87aaba6c", amount: 150000, status: "Paid" },
        { id: 4, label: "Event Payment - 10/1/2024", invoice: "#cf3661dd", amount: 50000, status: "Partially Refunded" },
    ];

    return (
        <div className="p-2 sm:p-4 md:p-6 bg-gray-50">
            {/* Tabs */}
            <div className="grid grid-cols-2 gap-2 sm:flex sm:w-full sm:border-1 sm:border-gray-300 sm:p-2 sm:rounded-2xl sm:justify-center sm:space-x-2 mb-2 sm:mb-3">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`rounded-lg sm:rounded-full font-medium text-xs sm:text-sm md:text-lg transition text-center ${activeTab === tab.id
                            ? "px-3 sm:px-6 md:px-9 py-2 sm:py-2 md:py-3 bg-orange-400 text-white"
                            : "px-3 sm:px-6 md:px-9 py-2 sm:py-2 md:py-3 text-gray-700 hover:bg-orange-100 bg-white sm:bg-transparent"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Overview */}
            {activeTab === "overview" && (
                <div className="bg-white rounded-lg sm:rounded-xl shadow p-3 sm:p-4 md:p-6 text-center">
                    <Calendar className="mx-auto text-orange-400 mb-2 sm:mb-3 md:mb-4" size={24} />
                    <h2 className="text-sm sm:text-base md:text-lg font-semibold">No upcoming events</h2>
                    <p className="text-gray-500 mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base">
                        Ready to plan your next amazing event?
                    </p>
                    <button
                        onClick={handleClick}
                        className="bg-orange-400 hover:cursor-pointer hover:bg-orange-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm md:text-base">
                        + Plan New Event
                    </button>
                </div>
            )}

            {/* My Events */}
            {activeTab === "events" && (
                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl shadow gap-2 sm:gap-0"
                        >
                            <div className="flex items-center space-x-2 sm:space-x-4">
                                <Crown className="text-orange-400 flex-shrink-0" size={20} />
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-sm sm:text-base truncate">{event.title}</h3>
                                    <p className="text-gray-500 text-xs sm:text-sm">
                                        {event.date} • ₹{event.price.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 sm:space-x-3 flex-wrap">
                                <span
                                    className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${event.status === "Completed"
                                        ? "bg-blue-100 text-blue-600"
                                        : "bg-green-100 text-green-600"
                                        }`}
                                >
                                    {event.status}
                                </span>
                                <span
                                    className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${event.payment === "Paid"
                                        ? "bg-green-100 text-green-600"
                                        : event.payment === "Unpaid"
                                            ? "bg-red-100 text-red-600"
                                            : "bg-gray-100 text-gray-600"
                                        }`}
                                >
                                    {event.payment}
                                </span>
                                <button className="text-orange-500 hover:underline text-xs sm:text-sm">View</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Payments */}
            {activeTab === "payments" && (
                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                    {payments.map((payment) => (
                        <div
                            key={payment.id}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl shadow gap-2 sm:gap-0"
                        >
                            <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-sm sm:text-base truncate">{payment.label}</h3>
                                <p className="text-gray-500 text-xs sm:text-sm">
                                        Oveventz Invoice {payment.invoice}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-wrap">
                                <span className="font-bold text-sm sm:text-base md:text-lg">
                                    ₹{payment.amount.toLocaleString()}
                                </span>
                                <span
                                    className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium ${payment.status === "Paid"
                                        ? "bg-green-100 text-green-600"
                                        : payment.status === "Unpaid"
                                            ? "bg-red-100 text-red-600"
                                            : payment.status === "Partially Paid"
                                                ? "bg-gray-100 text-gray-600"
                                                : "bg-yellow-100 text-yellow-600"
                                        }`}
                                >
                                    {payment.status}
                                </span>
                                <button className="border px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-xs sm:text-sm text-orange-500 border-orange-300 hover:bg-orange-50">
                                    Invoice
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Support */}
            {activeTab === "support" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Contact Support */}
                    <div className="rounded-2xl shadow-sm border bg-white">
                        <div className="p-6 space-y-6">
                            <div>
                                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                    <MessageCircle className="w-5 h-5 text-orange-400" />
                                    Contact Support
                                </h2>
                            </div>


                            <div className="bg-orange-50 p-4 rounded-xl space-y-3">
                                <h3 className="text-lg font-semibold text-gray-800">24/7 Premium Support</h3>
                                <p className="text-sm text-gray-500">
                                    Get instant help from our dedicated event specialists
                                </p>
                                <button className="bg-orange-300 hover:bg-orange-400 text-white w-full py-2 rounded-lg flex items-center justify-center">
                                    <MessageCircle className="w-4 h-4 mr-2" /> Start Chat
                                </button>
                            </div>


                            <div className="space-y-3">
                                <p className="flex items-center gap-2 text-gray-600">
                                    <Shield className="w-5 h-5 text-green-500" /> Quality Guarantee
                                </p>
                                <p className="flex items-center gap-2 text-gray-600">
                                    <Clock className="w-5 h-5 text-orange-400" /> Real-time Updates
                                </p>
                                <p className="flex items-center gap-2 text-gray-600">
                                    <Award className="w-5 h-5 text-teal-500" /> Expert Management
                                </p>
                            </div>
                        </div>
                    </div>


                    {/* Leave a Review */}
                    <div className="rounded-2xl shadow-sm border bg-white">
                        <div className="p-6 flex flex-col items-center justify-center text-center space-y-6">
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                                <Star className="w-5 h-5 text-orange-400" /> Leave a Review
                            </h2>


                            <div className="flex flex-col items-center space-y-2">
                                <div className="bg-orange-50 p-6 rounded-xl">
                                    <Star className="w-8 h-8 text-orange-400" />
                                </div>
                                <h3 className="font-semibold text-gray-800">Share Your Experience</h3>
                                <p className="text-sm text-gray-500 max-w-sm">
                                    Help others discover the Oveventz difference
                                </p>
                            </div>


                            <button className="bg-orange-300 hover:bg-orange-400 text-white py-2 px-4 rounded-lg">
                                Write Review
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerContent;
