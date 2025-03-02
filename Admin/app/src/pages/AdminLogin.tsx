import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import { Snackbar } from "@mui/material";

const Login: React.FC = () => {
  const [view, setView] = useState("login"); // 'login' | 'forgotPassword' | 'register'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  // Handle login
  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setSnackbarMessage("Login failed. Check your email and password.");
      setSnackbarOpen(true);
    } else {
      navigate("/dashboard");
    }
  };

  // Handle registration
  const handleRegister = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      setSnackbarMessage("Registration failed. Try again.");
    } else {
      setSnackbarMessage("Registration successful! Please check your email.");
      setView("login");
    }
    setSnackbarOpen(true);
  };

// Handle forgot password request (Send OTP via Supabase)
const handleForgotPassword = async () => {
  if (!email) {
    setSnackbarMessage("Please enter your email.");
    setSnackbarOpen(true);
    return;
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    setSnackbarMessage("Failed to send reset link. Try again.");
    setSnackbarOpen(true);
    return;
  }

  setSnackbarMessage("Check your email for the OTP link.");
  setSnackbarOpen(true);
  setOtpSent(true);
};

// Handle password reset (User submits new password with OTP token)
const handleResetPassword = async () => {
  if (newPassword.length < 6) {
    setSnackbarMessage("Password must be at least 6 characters long.");
    setSnackbarOpen(true);
    return;
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    setSnackbarMessage("Failed to reset password. Try again.");
    setSnackbarOpen(true);
    return;
  }

  setSnackbarMessage("Password reset successful! You can now log in.");
  setSnackbarOpen(true);
  setView("login");
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-[#71045F] mb-6">
          {view === "login" && "Login"}
          {view === "forgotPassword" && (otpSent ? (otpVerified ? "Reset Password" : "Verify OTP") : "Forgot Password")}
          {view === "register" && "Register"}
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

        {view === "login" && (
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

            <button onClick={handleLogin} className="w-full mt-6 py-3 bg-[#9e298b] text-white font-semibold rounded-lg hover:bg-[#71045F]">
              {loading ? "Logging in..." : "Login"}
            </button>

            <p onClick={() => setView("forgotPassword")} className="mt-4 text-center text-sm text-[#71045F] cursor-pointer hover:underline">
              Forgot Password?
            </p>
          </>
        )}

        {view === "forgotPassword" && (
          otpSent ? (
            otpVerified ? (
              <>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71045F]"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>

                <button onClick={handleResetPassword} className="w-full mt-6 py-3 bg-[#9e298b] text-white font-semibold rounded-lg hover:bg-[#71045F]">
                  Reset Password
                </button>
              </>
            ) : (
              <>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                  <input
                    type="text"
                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71045F]"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter your OTP"
                  />
                </div>

              </>
            )
          ) : (
            <button onClick={handleForgotPassword} className="w-full mt-6 py-3 bg-[#9e298b] text-white font-semibold rounded-lg hover:bg-[#71045F]">
              Send OTP
            </button>
          )
        )}

        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} message={snackbarMessage} />
      </div>
    </div>
  );
};

export default Login;
