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


  const handleForgotPassword = async () => {
    if (!email) {
      setSnackbarMessage("Please enter your email first.");
      setSnackbarOpen(true);
      return;
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // OTP expires in 10 min

    // Store OTP in Supabase
    const { error } = await supabase.from("password_reset_otp").upsert([
      { email, otp: otpCode, expires_at: expiresAt },
    ]);

    if (error) {
      setSnackbarMessage("Failed to store OTP. Try again.");
      setSnackbarOpen(true);
      return;
    }

    // Send OTP via email (You need an email service like SendGrid, Nodemailer, etc.)
    await sendOtpEmail(email, otpCode);  // Implement this function separately

    setSnackbarMessage(`OTP sent to ${email}. Check your inbox.`);
    setOtpSent(true);
    setSnackbarOpen(true);
  };

  const nodemailer = require("nodemailer");

  async function sendOtpEmail(email, otpCode) {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tpgithostels2025@gmail.com",
        pass: "fhea fpdp rxjy yotl",
      },
    });

    let mailOptions = {
      from: "tpgithostels2025@gmail.com",
      to: email,
      subject: "Your OTP for Password Reset",
      text: `Your OTP for password reset is: ${otpCode}. This OTP will expire in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
  }


  // Handle OTP verification
  const handleVerifyOtp = async () => {
    if (!email || !otp) {
      setSnackbarMessage("Please enter your email and OTP.");
      setSnackbarOpen(true);
      return;
    }

    // Fetch OTP from Supabase
    const { data, error } = await supabase
      .from("password_reset_otp")
      .select("otp, expires_at")
      .eq("email", email)
      .single();

    if (error || !data) {
      setSnackbarMessage("Invalid OTP. Try again.");
      setSnackbarOpen(true);
      return;
    }

    // Check if OTP matches and is not expired
    if (data.otp !== otp || new Date() > new Date(data.expires_at)) {
      setSnackbarMessage("OTP expired or incorrect.");
      setSnackbarOpen(true);
      return;
    }

    setSnackbarMessage("OTP verified! You can now reset your password.");
    setOtpVerified(true);
    setSnackbarOpen(true);
  };



  // Handle password reset after OTP verification
  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      setSnackbarMessage("Password must be at least 6 characters long.");
      setSnackbarOpen(true);
      return;
    }

    // Update password in Supabase
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setSnackbarMessage("Failed to reset password. Try again.");
      setSnackbarOpen(true);
      return;
    }

    // Delete OTP after successful password reset
    await supabase.from("password_reset_otp").delete().eq("email", email);

    setSnackbarMessage("Password reset successful. You can now log in.");
    setOtpVerified(false);
    setOtpSent(false);
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
