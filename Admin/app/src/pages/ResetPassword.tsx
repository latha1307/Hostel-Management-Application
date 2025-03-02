import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import { Snackbar } from "@mui/material";

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        setSessionExpired(true);
        setSnackbarMessage("Reset link expired. Request a new link.");
        setSnackbarOpen(true);
        return;
      }

      // Store session timestamp in localStorage
      localStorage.setItem("resetTimestamp", Date.now().toString());
    };

    checkSession();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const resetTimestamp = localStorage.getItem("resetTimestamp");

      if (resetTimestamp && Date.now() - parseInt(resetTimestamp) > 10 * 60 * 1000) {
        setSessionExpired(true);
        setSnackbarMessage("Reset session expired. Request a new link.");
        setSnackbarOpen(true);
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handlePasswordReset = async () => {
    if (!newPassword || !confirmPassword) {
      setSnackbarMessage("Please enter and confirm your new password.");
      setSnackbarOpen(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setSnackbarMessage("Passwords do not match.");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setLoading(false);

    if (error) {
      setSnackbarMessage("Failed to reset password. Please try again.");
    } else {
      setSnackbarMessage("Password reset successfully. Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    }

    setSnackbarOpen(true);
  };

  const handleResendResetLink = async () => {
    const email = localStorage.getItem("userEmail"); // Get email from login
    if (!email) {
      setSnackbarMessage("Enter your email on the login page to reset.");
      setSnackbarOpen(true);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://hostel-management-application.vercel.app/#/reset-password",
    });

    if (error) {
      setSnackbarMessage("Failed to send new reset link.");
    } else {
      setSnackbarMessage("New reset link sent. Check your email.");
    }

    setSnackbarOpen(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-[#71045F] mb-6">
          Reset Password
        </h2>

        {sessionExpired ? (
          <div className="text-center">
            <p className="text-red-500">Your reset link has expired.</p>
            <button
              onClick={handleResendResetLink}
              className="w-full mt-4 py-3 bg-[#9e298b] text-white font-semibold rounded-lg hover:bg-[#71045F] focus:outline-none focus:ring-2 focus:ring-[#71045F]"
            >
              Resend Reset Link
            </button>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71045F]"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71045F]"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
            <button
              onClick={handlePasswordReset}
              className="w-full mt-6 py-3 bg-[#9e298b] text-white font-semibold rounded-lg hover:bg-[#71045F] focus:outline-none focus:ring-2 focus:ring-[#71045F]"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

        {/* Snackbar for feedback messages */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        />
      </div>
    </div>
  );
};

export default ResetPassword;
