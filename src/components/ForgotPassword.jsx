import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: Code, 3: New Password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://ovevents.onrender.com";

  // Validate password
  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8)
      errors.push("Password must be at least 8 characters long.");
    if (!/[A-Z]/.test(password))
      errors.push("Password must contain at least one uppercase letter.");
    if (!/[a-z]/.test(password))
      errors.push("Password must contain at least one lowercase letter.");
    if (!/[0-9]/.test(password))
      errors.push("Password must contain at least one number.");
    if (!/[!@#$%^&*()_+]/.test(password))
      errors.push("Password must contain at least one special character.");
    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  };

  // Step 1: Send code to email
  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/forgot-password`, {
        email: email.trim(),
      });

      if (response.data.success) {
        toast.success("Verification code sent to your email!");
        setStep(2);
      } else {
        toast.error(response.data.message || "Failed to send code");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to send verification code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!code.trim() || code.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/verify-code`, {
        email: email.trim(),
        code: code.trim(),
      });

      if (response.data.success) {
        toast.success("Code verified successfully!");
        setStep(3);
      } else {
        toast.error(response.data.message || "Invalid code");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const { isValid, errors } = validatePassword(newPassword);
    if (!isValid) {
      toast.error(errors[0]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/reset-password`, {
        email: email.trim(),
        code: code.trim(),
        newPassword: newPassword.trim(),
      });

      if (response.data.success) {
        toast.success("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/Login");
        }, 2000);
      } else {
        toast.error(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to reset password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">
          Forgot Password
        </h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          {step === 1 && "Enter your email to receive a verification code"}
          {step === 2 && "Enter the 6-digit code sent to your email"}
          {step === 3 && "Enter your new password"}
        </p>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 1
                  ? "bg-[#E69B83] text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              1
            </div>
            <div
              className={`flex-1 h-1 mx-2 ${
                step >= 2 ? "bg-[#E69B83]" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 2
                  ? "bg-[#E69B83] text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              2
            </div>
            <div
              className={`flex-1 h-1 mx-2 ${
                step >= 3 ? "bg-[#E69B83]" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= 3
                  ? "bg-[#E69B83] text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              3
            </div>
          </div>
        </div>

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E69B83] focus:border-[#E69B83]"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-[#E69B83] text-white rounded-lg font-semibold hover:bg-[#c16a4d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send Verification Code"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/Login")}
              className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Back to Login
            </button>
          </form>
        )}

        {/* Step 2: Code Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="Enter 6-digit code"
                maxLength={6}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E69B83] focus:border-[#E69B83] text-center text-2xl tracking-widest"
              />
              <p className="text-xs text-gray-500 mt-1">
                Code sent to: {email}
              </p>
            </div>
            <button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="w-full py-2 bg-[#E69B83] text-white rounded-lg font-semibold hover:bg-[#c16a4d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E69B83] focus:border-[#E69B83] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 8 chars with upper/lower case, number, and special character.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E69B83] focus:border-[#E69B83] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

