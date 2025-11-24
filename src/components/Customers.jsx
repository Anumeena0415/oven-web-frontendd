// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Customer = () => {
//   const [customers, setcustomers] = useState([]);

//   useEffect(() => {
//     const fetchCustomers = async () => {
//       try {
//         const res = await axios.get("https://ovevents.onrender.com/api/eventplan/showAllEvent");
//         setcustomers(res.data.data);
//         console.log("data ---------",res.data.data);

//       } catch (error) {
//         console.error("Error fetching customers:", error);
//       }
//     };
//     fetchCustomers();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 py-10 px-5">
//       <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
//         All Customer
//       </h1>

//       {customers.length === 0 ? (
//         <p className="text-center text-gray-600">No customers found...</p>
//       ) : (
// <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//   {customers.map((customer) => (
//     <div
//       key={customer._id}
//       className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4"
//     >
//       <h2 className="text-xl font-semibold text-gray-800">{customer.type}</h2>
//        <p className="text-gray-600">Name : {customer.name}</p>
//        <p className="text-gray-600">Email : {customer.email}</p>
//        <p className="text-gray-600">Phone No : {customer.phoneNo}</p>
//       <p className="text-gray-600">Date: {customer.date}</p>
//       <p className="text-gray-600">City: {customer.city}</p>
//       <p className="text-gray-600">Price: ₹{customer.budget}</p>
//       <p className="text-gray-600">Venue: {customer.venuePreference}</p>
//       <p className="text-gray-600">Services: {customer.services}</p>
//       <p className="text-gray-500 text-sm mt-2">Guests :{customer.guests}</p>

//       <div className="flex gap-3">
//         <button className="mt-4 w-[40%] bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition">
//         Done
//       </button>
//       <button className="mt-4 w-[40%] bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition">
//         Reject
//       </button>
//       </div>
//     </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Customer;

import axios from "axios";
import { useState, useEffect } from "react";

const ITEMS_PER_PAGE = 4;

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid date
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return dateString; // Return original if error
  }
};

const Customer = ({ title }) => {
  const [customers, setCustomers] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  // --- Fetch all customers
  const fetchCustomers = async () => {
    const BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://ovevents.onrender.com";
    try {
      const data = await axios.get(
        `${BASE_URL}/api/eventplan/showAllEvent`
      );
      const customersData = data.data.data || [];
      
      // Debug: Check priorities and specialInstructions
      if (customersData.length > 0) {
        console.log("Sample customer data:", {
          name: customersData[0].name,
          priorities: customersData[0].priorities,
          specialInstructions: customersData[0].specialInstructions,
          prioritiesType: typeof customersData[0].priorities,
          prioritiesKeys: customersData[0].priorities ? Object.keys(customersData[0].priorities) : []
        });
      }
      
      setCustomers(customersData);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  // --- Handle status update (Approve / Reject)
  const handleClick = async (customer, status) => {
    try {
      const BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://ovevents.onrender.com";
      const updated = { ...customer, status };
      await axios.put(
        `${BASE_URL}/api/eventplan/update/${customer._id}`,
        updated
      );
      if(status==="Approved"){
      handSendEmail(customer, status);
      }else if(status==="Done"){
        handleRejectSendEmail(customer, status);
      }else{
        handleRejectSendEmail(customer, status); 
      }
      fetchCustomers(); // refresh after update
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };
    const handleRejectSendEmail = async (customer, status) => {
    try {
      const updated = { ...customer, status };
      const BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://ovevents.onrender.com";
      await axios.post(
        `${BASE_URL}/api/eventplan/sendEmailRejected/${customer._id}`,
        updated
      );
      fetchCustomers(); // refresh after update
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };
  const handSendEmail = async (customer, status) => {
    try {
      const updated = { ...customer, status };
      const BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://ovevents.onrender.com";
      await axios.post(
        `${BASE_URL}/api/eventplan/sendApproved/${customer._id}`,
        updated
      );
      fetchCustomers(); // refresh after update
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  // --- Separate customers by status
  // Handle null/undefined status as "pending"
  const pendingCustomers = customers.filter((c) => {
    const status = (c.status || "").toLowerCase().trim();
    const isPending = status === "pending" || status === "";
    return isPending;
  });
  
  const approvedCustomers = customers.filter((c) => (c.status || "").toLowerCase().trim() === "approved");
  const rejectedCustomers = customers.filter((c) => (c.status || "").toLowerCase().trim() === "reject");
  const doneCustomers = customers.filter((c) => (c.status || "").toLowerCase().trim() === "done");

  const displayedPending = showAll
    ? pendingCustomers
    : pendingCustomers.slice(0, ITEMS_PER_PAGE);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">{title}</h2>

      {/* ================= Pending Section ================= */}
      <h3 className="text-xl font-semibold text-blue-700 mb-3">
        Pending ({pendingCustomers.length})
      </h3>
      {displayedPending.length === 0 ? (
        <p className="text-gray-500 mb-4">No pending customers</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedPending.map((customer, index) => {
            return (
            <div
              key={customer._id || `customer-${index}`}
              onClick={() => {
                setSelectedCustomer(customer);
                setShowModal(true);
              }}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 border-2 border-blue-200 cursor-pointer"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {customer.type || customer.name || "Event Request"}
              </h2>
              <p className="text-gray-600">Name: {customer.name}</p>
              <p className="text-gray-600">Email: {customer.email}</p>
              <p className="text-gray-600">Phone No: {customer.phoneNo}</p>
              <p className="text-gray-600">Date: {formatDate(customer.date)}</p>
              <p className="text-gray-600">City: {customer.city}</p>
              <p className="text-gray-600">Price: ₹{customer.budget}</p>
              <p className="text-gray-600">Venue: {customer.venuePreference}</p>
              <p className="text-gray-600">Services: {Array.isArray(customer.services) ? customer.services.join(", ") : customer.services || "N/A"}</p>
              <p className="text-blue-700 font-semibold">
                Status: {customer.status}
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Guests: {customer.guests}
              </p>

              <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleClick(customer, "Approved")}
                  className="mt-4 w-[40%] bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
                >
                  Approved
                </button>
                <button
                  onClick={() => handleClick(customer, "Reject")}
                  className="mt-4 w-[40%] bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition"
                >
                  Reject
                </button>
              </div>
            </div>
            );
          })}
        </div>
      )}

      {/* Show All / Show Less Button for Pending */}
      {pendingCustomers.length > ITEMS_PER_PAGE && (
        <div className="flex justify-center mt-4 mb-6">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-md"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? `Show Less` : `Show More (${pendingCustomers.length} Total)`}
          </button>
        </div>
      )}

      {/* ================= Approved Section ================= */}
      <h3 className="text-xl font-semibold text-green-700 mt-10 mb-3">
        Approved
      </h3>
      {approvedCustomers.length === 0 ? (
        <p className="text-gray-500 mb-4">No approved customers</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {approvedCustomers.map((customer) => (
            <div
              key={customer._id}
              onClick={() => {
                setSelectedCustomer(customer);
                setShowModal(true);
              }}
              className="bg-green-50 border border-green-300 rounded-2xl shadow-md hover:shadow-lg transition p-4 cursor-pointer"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {customer.type}
              </h2>
              <p className="text-gray-600">Name: {customer.name}</p>
              <p className="text-gray-600">Email: {customer.email}</p>
              <p className="text-gray-600">Phone No: {customer.phoneNo}</p>
              <p className="text-gray-600">Date: {formatDate(customer.date)}</p>
              <p className="text-gray-600">City: {customer.city}</p>
              <p className="text-gray-600">Price: ₹{customer.budget}</p>
              <p className="text-gray-600">Venue: {customer.venuePreference}</p>
              <p className="text-gray-600">Services: {Array.isArray(customer.services) ? customer.services.join(", ") : customer.services || "N/A"}</p>
              <p className="text-green-700 font-semibold">Status: Approved</p>
              <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                <button  onClick={() => handleClick(customer, "Done")} className="mt-4 w-[40%] bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition">
                  Done
                </button>
                <button
                  onClick={() => handleClick(customer, "Reject")}
                  className="mt-4 w-[40%] bg-red-600 text-white py-2 rounded-xl hover:bg-red-700 transition"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= Rejected Section ================= */}
      <h3 className="text-xl font-semibold text-red-700 mt-10 mb-3">
        Rejected
      </h3>
      {rejectedCustomers.length === 0 ? (
        <p className="text-gray-500 mb-4">No rejected customers</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {rejectedCustomers.map((customer) => (
            <div
              key={customer._id}
              onClick={() => {
                setSelectedCustomer(customer);
                setShowModal(true);
              }}
              className="bg-red-50 border border-red-300 rounded-2xl shadow-md hover:shadow-lg transition p-4 cursor-pointer"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {customer.type}
              </h2>
              <p className="text-gray-600">Name: {customer.name}</p>
              <p className="text-gray-600">Email: {customer.email}</p>
              <p className="text-gray-600">Phone No: {customer.phoneNo}</p>
              <p className="text-gray-600">Date: {formatDate(customer.date)}</p>
              <p className="text-gray-600">City: {customer.city}</p>
              <p className="text-gray-600">Price: ₹{customer.budget}</p>
              <p className="text-gray-600">Venue: {customer.venuePreference}</p>
              <p className="text-gray-600">Services: {Array.isArray(customer.services) ? customer.services.join(", ") : customer.services || "N/A"}</p>
              <p className="text-red-700 font-semibold">Status: Rejected</p>
              <div onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => handleClick(customer, "Approved")}
                className="mt-4 w-[40%] bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
              >
                Approved
              </button>
              </div>
            </div>
          ))}
        </div>
      )}

       {/* ================= Done Section ================= */}
      <h3 className="text-xl font-semibold text-green-700 mt-10 mb-3">
        Done
      </h3>
      {doneCustomers.length === 0 ? (
        <p className="text-gray-500 mb-4">No done customers</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {doneCustomers.map((customer) => (
            <div
              key={customer._id}
              onClick={() => {
                setSelectedCustomer(customer);
                setShowModal(true);
              }}
              className="bg-red-50 border border-red-300 rounded-2xl shadow-md hover:shadow-lg transition p-4 cursor-pointer"
            >
              <h2 className="text-xl font-semibold text-gray-800">
                {customer.type}
              </h2>
              <p className="text-gray-600">Name: {customer.name}</p>
              <p className="text-gray-600">Email: {customer.email}</p>
              <p className="text-gray-600">Phone No: {customer.phoneNo}</p>
              <p className="text-gray-600">Date: {formatDate(customer.date)}</p>
              <p className="text-gray-600">City: {customer.city}</p>
              <p className="text-gray-600">Price: ₹{customer.budget}</p>
              <p className="text-gray-600">Venue: {customer.venuePreference}</p>
              <p className="text-gray-600">Services: {Array.isArray(customer.services) ? customer.services.join(", ") : customer.services || "N/A"}</p>
              <p className="text-green-700 font-semibold">Status: {customer.status}</p>
              {/* <button
                onClick={() => handleClick(customer, "Approved")}
                className="mt-4 w-[40%] bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition"
              >
                Approved
              </button> */}
            </div>
          ))}
        </div>
      )}

      {/* Modal/Popup for Customer Details */}
      {showModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto transform transition-all" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#E69B83] to-[#c16a4d] text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Event Request Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:text-gray-200 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Step 1: Event Basics */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-lg border-l-4 border-blue-500">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">1</span>
                    Event Basics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-11">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Event Type</p>
                      <p className="text-gray-800 font-semibold">{selectedCustomer.type || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Event Date</p>
                      <p className="text-gray-800 font-semibold">{formatDate(selectedCustomer.date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">City</p>
                      <p className="text-gray-800 font-semibold">{selectedCustomer.city || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Expected Guest Count</p>
                      <p className="text-gray-800 font-semibold">{selectedCustomer.guests || "N/A"} guests</p>
                    </div>
                  </div>
                </div>

                {/* Step 2: Budget & Priorities */}
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-5 rounded-lg border-l-4 border-purple-500">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">2</span>
                    Budget & Priorities
                  </h3>
                  <div className="ml-11 space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Budget</p>
                      <p className="text-gray-800 font-semibold text-lg">₹{selectedCustomer.budget?.toLocaleString("en-IN") || "N/A"}</p>
                    </div>
                    {selectedCustomer.priorities && typeof selectedCustomer.priorities === 'object' && Object.keys(selectedCustomer.priorities).length > 0 ? (
                      <div>
                        <p className="text-sm text-gray-600 mb-3">Priority Areas (1-10 scale)</p>
                        <div className="space-y-3">
                          {Object.entries(selectedCustomer.priorities).map(([key, value]) => (
                            <div key={key}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-gray-700 font-medium">{key}</span>
                                <span className="font-bold text-[#E69B83]">{value}/10</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                  className="bg-gradient-to-r from-[#E69B83] to-[#c16a4d] h-3 rounded-full transition-all"
                                  style={{ width: `${(value / 10) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No priorities set</p>
                    )}
                  </div>
                </div>

                {/* Step 3: Venue Preferences */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-lg border-l-4 border-green-500">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">3</span>
                    Venue Preferences
                  </h3>
                  <div className="ml-11">
                    <p className="text-sm text-gray-600 mb-1">Preferred Venue Type</p>
                    <p className="text-gray-800 font-semibold">{selectedCustomer.venuePreference || "N/A"}</p>
                  </div>
                </div>

                {/* Step 4: Services Required */}
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-5 rounded-lg border-l-4 border-orange-500">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">4</span>
                    Services Required
                  </h3>
                  <div className="ml-11">
                    {Array.isArray(selectedCustomer.services) && selectedCustomer.services.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedCustomer.services.map((service, idx) => (
                          <span key={idx} className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 border border-orange-300">
                            {service}
                          </span>
                        ))}
                      </div>
                    ) : selectedCustomer.services ? (
                      <p className="text-gray-800 font-semibold">{selectedCustomer.services}</p>
                    ) : (
                      <p className="text-gray-500 italic">No services selected</p>
                    )}
                  </div>
                </div>

                {/* Step 5: Customer Details */}
                <div className="bg-gradient-to-r from-teal-50 to-teal-100 p-5 rounded-lg border-l-4 border-teal-500">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">5</span>
                    Customer Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-11">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Name</p>
                      <p className="text-gray-800 font-semibold">{selectedCustomer.name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Email</p>
                      <p className="text-gray-800 font-semibold break-all">{selectedCustomer.email || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                      <p className="text-gray-800 font-semibold">{selectedCustomer.phoneNo || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Step 6: Special Instructions */}
                <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-5 rounded-lg border-l-4 border-pink-500">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">6</span>
                    Special Instructions / Additional Details
                  </h3>
                  <div className="ml-11">
                    {selectedCustomer.specialInstructions && selectedCustomer.specialInstructions.trim() !== "" ? (
                      <div className="bg-white p-4 rounded-lg border border-pink-200">
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedCustomer.specialInstructions}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No special instructions provided</p>
                    )}
                  </div>
                </div>

                {/* Status */}
                <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-gray-400">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Request Status</h3>
                  <span className={`inline-block px-6 py-3 rounded-lg font-semibold text-lg ${
                    selectedCustomer.status === "Approved" 
                      ? "bg-green-100 text-green-700"
                      : selectedCustomer.status === "Reject" || selectedCustomer.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : selectedCustomer.status === "Done"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {selectedCustomer.status || "Pending"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex gap-4 justify-end">
                {selectedCustomer.status === "pending" || !selectedCustomer.status ? (
                  <>
                    <button
                      onClick={() => {
                        handleClick(selectedCustomer, "Approved");
                        setShowModal(false);
                      }}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        handleClick(selectedCustomer, "Reject");
                        setShowModal(false);
                      }}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                    >
                      Reject
                    </button>
                  </>
                ) : selectedCustomer.status === "Approved" ? (
                  <>
                    <button
                      onClick={() => {
                        handleClick(selectedCustomer, "Done");
                        setShowModal(false);
                      }}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                    >
                      Mark as Done
                    </button>
                    <button
                      onClick={() => {
                        handleClick(selectedCustomer, "Reject");
                        setShowModal(false);
                      }}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                    >
                      Reject
                    </button>
                  </>
                ) : null}
        <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
        >
                  Close
        </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Customer;
