import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import { Snackbar } from "@mui/material";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const navigate = useNavigate();

  // Handle user login
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

  // Handle OTP generation and sending
  const handleForgotPassword = async () => {
    if (!email) {
      setSnackbarMessage("Please enter your email first.");
      setSnackbarOpen(true);
      return;
    }

    // Generate a 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min expiry

    // Store OTP in Supabase
    const { error } = await supabase.from("password_reset_otp").upsert([
      { email, otp: otpCode, expires_at: expiresAt },
    ]);

    if (error) {
      setSnackbarMessage("Failed to send OTP. Try again.");
      setSnackbarOpen(true);
      return;
    }

    // Send email with OTP
    const { error: emailError } = await supabase.auth.signInWithOtp({ email });

    if (emailError) {
      setSnackbarMessage("Error sending OTP email. Try again.");
    } else {
      setSnackbarMessage(`OTP sent to ${email}. Check your inbox.`);
      setOtpSent(true);
    }

    setSnackbarOpen(true);
  };


  // Handle OTP verification
  const handleVerifyOtp = async () => {
    const { data, error } = await supabase
      .from("password_reset_otp")
      .select("*")
      .eq("email", email)
      .eq("otp", otp)
      .single();

    if (error || !data) {
      setSnackbarMessage("Invalid OTP. Try again.");
    } else {
      setSnackbarMessage("OTP Verified! Enter a new password.");
      setOtpVerified(true);
    }

    setSnackbarOpen(true);
  };

  // Handle password reset after OTP verification
  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      setSnackbarMessage("Password must be at least 6 characters long.");
      setSnackbarOpen(true);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      email,
      password: newPassword,
    });

    if (error) {
      setSnackbarMessage("Failed to reset password. Try again.");
    } else {
      setSnackbarMessage("Password reset successful. You can now log in.");
      setForgotPassword(false);
      setOtpSent(false);
      setOtpVerified(false);
    }

    setSnackbarOpen(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-[#71045F] mb-6">
          {forgotPassword ? (otpSent ? (otpVerified ? "Reset Password" : "Verify OTP") : "Forgot Password") : "Login"}
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

            <p onClick={() => setForgotPassword(true)} className="mt-4 text-center text-sm text-[#71045F] cursor-pointer hover:underline">
              Forgot Password?
            </p>
          </>
        ) : otpSent ? (
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

              <button
                onClick={handleResetPassword}
                className="w-full mt-6 py-3 bg-[#9e298b] text-white font-semibold rounded-lg hover:bg-[#71045F] focus:outline-none focus:ring-2 focus:ring-[#71045F]"
              >
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

              <button
                onClick={handleVerifyOtp}
                className="w-full mt-6 py-3 bg-[#9e298b] text-white font-semibold rounded-lg hover:bg-[#71045F] focus:outline-none focus:ring-2 focus:ring-[#71045F]"
              >
                Verify OTP
              </button>
            </>
          )
        ) : (
          <button
            onClick={handleForgotPassword}
            className="w-full mt-6 py-3 bg-[#9e298b] text-white font-semibold rounded-lg hover:bg-[#71045F] focus:outline-none focus:ring-2 focus:ring-[#71045F]"
          >
            Send OTP
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
