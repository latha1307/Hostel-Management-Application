import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import { Snackbar } from "@mui/material";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setSnackbarMessage("Login failed. Check your email and password.");
    } else {
      navigate("/dashboard");
    }
    setSnackbarOpen(true);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setSnackbarMessage("Please enter your email first.");
      setSnackbarOpen(true);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://hostel-management-application.vercel.app/#/reset-password",
    });

    if (error) {
      setSnackbarMessage("Failed to send reset email. Try again.");
    } else {
      setSnackbarMessage("Check your email for the reset link.");
    }

    setSnackbarOpen(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-[#71045F] mb-6">
          {forgotPassword ? "Forgot Password" : "Login"}
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71045F]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        {!forgotPassword ? (
          <>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71045F]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full mt-6 py-3 bg-[#9e298b] text-white font-semibold rounded-lg hover:bg-[#71045F] focus:outline-none focus:ring-2 focus:ring-[#71045F]"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p
              onClick={() => setForgotPassword(true)}
              className="mt-4 text-center text-sm text-[#71045F] cursor-pointer hover:underline"
            >
              Forgot Password?
            </p>
          </>
        ) : (
          <button
            onClick={handleForgotPassword}
            className="w-full mt-6 py-3 bg-[#9e298b] text-white font-semibold rounded-lg hover:bg-[#71045F] focus:outline-none focus:ring-2 focus:ring-[#71045F]"
          >
            Send Reset Link
          </button>
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

export default Login;
