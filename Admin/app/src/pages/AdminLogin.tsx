import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import { Snackbar } from "@mui/material";
interface LoginProps {
  setIsLoggedIn: (value: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn}) => {

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
      setIsLoggedIn(true);
      navigate("/");
      window.location.reload()
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    setLoading(false);
    if (error) {
      setSnackbarMessage("Failed to send OTP. Try again.");
    } else {
      setSnackbarMessage("OTP sent to your email. Check your inbox.");
      setOtpSent(true); // Ensure OTP input is shown
    }
    setSnackbarOpen(true);
  };


  const handleVerifyOtp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "recovery",
    });

    setLoading(false);
    if (error) {
      setSnackbarMessage("Invalid or expired OTP.");
    } else {
      setSnackbarMessage("OTP verified! Set a new password.");
      setOtpVerified(true); // Update state to show reset password input
    }
    setSnackbarOpen(true);
  };

  // Step 3: Reset Password
  const handleResetPassword = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    setLoading(false);
    if (error) {
      setSnackbarMessage("Failed to reset password. Try again.");
    } else {
      setSnackbarMessage("Password reset successful! Please log in.");
      navigate("/login");
      window.location.reload();
    }
    setSnackbarOpen(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-[#71045F] mb-6">
          {view === "login" && "Login"}
          {view === "forgotPassword" && (otpSent ? (otpVerified ? "Reset Password" : "Verify OTP") : "Forgot Password")}
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

            <button onClick={handleLogin}  disabled={loading}  className="w-full mt-6 py-3 bg-[#9e298b] text-white font-semibold rounded-lg hover:bg-[#71045F]">
              {loading ? "Logging in..." : "Login"}
            </button>

            <p onClick={() => setView("forgotPassword")} className="mt-4 text-center text-sm text-[#71045F] cursor-pointer hover:underline">
              Forgot Password?
            </p>
          </>
        )}

{view === "forgotPassword" && (
  otpSent ? ( // If OTP is sent, show OTP input
    otpVerified ? ( // If OTP is verified, show new password input
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

        <button onClick={handleVerifyOtp} className="w-full mt-6 py-3 bg-[#9e298b] text-white font-semibold rounded-lg hover:bg-[#71045F]">
          Verify OTP
        </button>
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
