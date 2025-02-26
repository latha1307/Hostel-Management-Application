import React, { useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/NavBar.tsx";
import "./index.css";
import { ThemeProvider } from './constants/ThemeContext.js'
import Main from "./pages/Mess/main.tsx";
import Groceries from "./pages/Mess/Grocery.tsx";
import Provisions from "./pages/Mess/Provisions.tsx";
import StaffSalary from "./pages/Mess/StaffSalary.tsx";
import Studentattendence from "./pages/Mess/StudentAttendence.tsx";
import BillDistribution from "./pages/BillDistribution.jsx";
import AdminDetails from "./pages/ProfilePage.jsx";
import AdminManagement from "./pages/AddAdmin.tsx";
import { Header } from "./components/Header.jsx";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ThemeProvider>
      <Router>
        <div className={` ${darkMode ? 'dark' : ''} flex h-full bg-gray-100 font-quickSand`}>
          <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} toggleSidebar={toggleSidebar} />
          <Navbar isSidebarOpen={isSidebarOpen} />

          <div
            className={`flex-1 flex flex-col transition-all dark:bg-gray-800 duration-300
            ${isSidebarOpen ? "ml-64" : "ml-16"}`}
          >
            <div className={`flex-grow mt-24 mx-auto ${isSidebarOpen ? 'max-w-[83vw]' : 'max-w-[95vw]'}  overflow-x-hidden  px-6`}>
              <Routes>
                <Route path="/mess/provisions" element={<Provisions />} />
                <Route path="/manage-mess/:hostel" element={<Main />} />
                <Route path="/manage-mess/:hostel/groceries" element={<Groceries />} />
                <Route path="/manage-mess/:hostel/staffsalary" element={<StaffSalary />} />
                <Route path="/manage-mess/:hostel/attendance" element={<Studentattendence />} />
                <Route path="/manage-mess/:hostel/bill-distribution" element={<BillDistribution />} />

                <Route path="/admin/profile" element={<AdminDetails />} />
                <Route path="/admin/add" element={<AdminManagement />} />
                <Route path="*" element={<div>Page Not Found</div>} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
