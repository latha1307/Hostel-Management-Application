  import React, { useState, useEffect } from "react";
  import { HashRouter as Router, Route, Routes, Navigate } from "react-router-dom";
  import Navbar from "./components/NavBar.tsx";
  import "./index.css";
  import Main from "./pages/Mess/main.tsx";
  import Groceries from "./pages/Mess/Grocery.tsx";
  import Provisions from "./pages/Mess/Provisions.tsx";
  import StaffSalary from "./pages/Mess/StaffSalary.tsx";
  import Studentattendence from "./pages/Mess/StudentAttendence.tsx";
  import BillDistribution from "./pages/BillDistribution.jsx";
  import AdminDetails from "./pages/ProfilePage.tsx";
  import AdminManagement from "./pages/AddAdmin.tsx";
  import { Header } from "./components/Header.jsx";
  import supabase from "./supabaseClient.js";
  import Login from "./pages/AdminLogin.tsx";

  function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState(""); // Store user email

    useEffect(() => {
      const checkAuthStatus = async () => {
        const { data: session } = await supabase.auth.getSession();
        if (session.session) {
          setIsLoggedIn(true);
          setEmail(session.session.user.email);
        }
        setLoading(false);
      };

      checkAuthStatus();
    }, []);

    const toggleDarkMode = () => {
      setDarkMode(!darkMode);
    };

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <Router>
        {isLoggedIn ? (
          <div className={`${darkMode ? "dark" : ""} flex h-full bg-[#E2DFD0] font-quickSand`}>
            <Header
              toggleDarkMode={toggleDarkMode}
              darkMode={darkMode}
              toggleSidebar={toggleSidebar}
              email={email}
            />
            <Navbar isSidebarOpen={isSidebarOpen} />

            <div
              className={`flex-1 flex flex-col transition-all dark:bg-gray-800 duration-300
              ${isSidebarOpen ? "ml-64" : "ml-16"}`}
            >
              <div className={`flex-grow mt-24 px-6 ${ isSidebarOpen ? 'max-w-[83vw]' : 'max-w-[96vw]'} overflow-x-hidden`}>
                <Routes>
                  <Route path="/mess/provisions" element={<Provisions />} />
                  <Route path="/manage-mess/:hostel" element={<Main />} />
                  <Route path="/manage-mess/:hostel/groceries" element={<Groceries />} />
                  <Route path="/manage-mess/:hostel/staffsalary" element={<StaffSalary />} />
                  <Route path="/manage-mess/:hostel/attendance" element={<Studentattendence />} />
                  <Route path="/manage-mess/:hostel/bill-distribution" element={<BillDistribution />} />

                  <Route path="/admin/profile" element={<AdminDetails email={email} />} />
                  <Route path="/admin/add" element={<AdminManagement />} />
                  <Route path="/" element={<Provisions />} />
                </Routes>
              </div>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </Router>
    );
  }

  export default App;
