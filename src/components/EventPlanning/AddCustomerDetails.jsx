import React, { useState, useEffect, useCallback } from "react";

const AddCustomerDetails = ({ formData, setFormData, onValidationChange }) => {
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phoneNo: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phoneNo: false,
  });
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const validateField = (name, value) => {
    let error = "";
    
    if (name === "name") {
      if (!value.trim()) {
        error = "Full Name is required";
      }
    } else if (name === "email") {
      if (!value.trim()) {
        error = "Email Address is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Please enter a valid email address";
      }
    } else if (name === "phoneNo") {
      if (!value.trim()) {
        error = "Phone Number is required";
      } else if (!/^\d+$/.test(value)) {
        error = "Phone number must contain only digits";
      } else if (value.length > 10) {
        error = "Phone number cannot be more than 10 digits";
      }
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For phone number, restrict to 10 digits
    let processedValue = value;
    if (name === "phoneNo") {
      // Remove non-digit characters and limit to 10 digits
      processedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    // Update only the customerDetails part of formData
    setFormData((prevData) => ({
      ...prevData,
      customerDetails: {
        ...prevData.customerDetails,
        [name]: processedValue,
      },
    }));

    // Validate the field only if it's been touched or submit was attempted
    if (touched[name] || submitAttempted) {
      const error = validateField(name, processedValue);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    
    // Validate on blur
    const error = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  // Check if form is valid
  const isFormValid = useCallback(() => {
    const { name, email, phoneNo } = formData.customerDetails;
    return (
      name.trim() !== "" &&
      email.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      phoneNo.trim() !== "" &&
      /^\d+$/.test(phoneNo) &&
      phoneNo.length <= 10
    );
  }, [formData.customerDetails]);

  // Validate all fields when submit is attempted
  const validateAllFields = useCallback(() => {
    setSubmitAttempted(true);
    const nameError = validateField("name", formData.customerDetails.name || "");
    const emailError = validateField("email", formData.customerDetails.email || "");
    const phoneError = validateField("phoneNo", formData.customerDetails.phoneNo || "");
    setErrors({
      name: nameError,
      email: emailError,
      phoneNo: phoneError,
    });
    setTouched({
      name: true,
      email: true,
      phoneNo: true,
    });
  }, [formData.customerDetails]);

  // Expose validateAllFields to parent component
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isFormValid(), validateAllFields);
    }
  }, [formData.customerDetails, isFormValid, onValidationChange, validateAllFields]);

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-md space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        Add Customer Details
      </h2>

      {/* Name Field */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.customerDetails.name || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your full name"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E69B83] ${
            (touched.name || submitAttempted) && errors.name ? "border-red-500" : ""
          }`}
        />
        {(touched.name || submitAttempted) && errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Email Address</label>
        <input
          type="email"
          name="email"
          value={formData.customerDetails.email || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your email"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E69B83] ${
            (touched.email || submitAttempted) && errors.email ? "border-red-500" : ""
          }`}
        />
        {(touched.email || submitAttempted) && errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Phone Number Field */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Phone Number</label>
        <input
          type="tel"
          name="phoneNo"
          value={formData.customerDetails.phoneNo || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your phone number (max 10 digits)"
          maxLength={10}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E69B83] ${
            (touched.phoneNo || submitAttempted) && errors.phoneNo ? "border-red-500" : ""
          }`}
        />
        {(touched.phoneNo || submitAttempted) && errors.phoneNo && (
          <p className="text-red-500 text-sm mt-1">{errors.phoneNo}</p>
        )}
      </div>
    </div>
  );
};

export default AddCustomerDetails;
