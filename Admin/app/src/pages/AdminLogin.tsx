import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";

interface LoginProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    if (data.session) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", email); // Store user session
      setIsLoggedIn(true);
      navigate("/"); // Redirect to dashboard or home
    } else {
      setErrorMessage("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-blue-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-[#71045F] mb-6">
          Admin Login
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71045F]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#71045F]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        {errorMessage && <p className="text-sm text-red-500 mt-2">{errorMessage}</p>}
        <button
          onClick={handleLogin}
          className="w-full mt-6 py-3 bg-[#9e298b] text-white font-semibold rounded-lg hover:bg-[#71045F] focus:outline-none focus:ring-2 focus:ring-[#71045F]"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
