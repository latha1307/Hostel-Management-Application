import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/TPGIT_logo_created.png";
import { useMediaQuery, Avatar } from "@mui/material";
import {
  Dashboard,
  Person,
  School,
  ListAlt,
  Restaurant,
  Store,
  Apartment,
  Notifications,
  ReportProblem,
  ExitToApp,
  ExpandLess,
  ExpandMore,
  Menu,
  DarkMode,
  LightMode,
} from "@mui/icons-material";

const navItems = [
  { label: "Dashboard", icon: <Dashboard className="text-blue-500" />, path: "/dashboard" },
  { label: "Student Requests", icon: <Person className="text-green-500" />, path: "/student-requests" },
  { label: "Student Details", icon: <School className="text-purple-500" />, path: "/student-details" },
  { label: "Leave Requests", icon: <ListAlt className="text-yellow-500" />, path: "/leave-requests" },
  {
    label: "Manage Mess",
    icon: <Restaurant className="text-red-500" />,
    subItems: [
      { label: "Inventory", icon: <Store className="text-indigo-500" />, path: "/mess/provisions" },
      { label: "Boys Hostel", icon: <Apartment className="text-gray-500" />, path: "/manage-mess/Boys" },
      { label: "Girls Hostel", icon: <Apartment className="text-pink-500" />, path: "/manage-mess/Girls" },
    ],
  },
  { label: "Notice Board", icon: <Notifications className="text-orange-500" />, path: "/notice-board" },
  { label: "Complaints", icon: <ReportProblem className="text-red-600" />, path: "/complaints" },
  { label: "Vacate Requests", icon: <ExitToApp className="text-gray-700" />, path: "/vacate-requests" },
];

const Navbar = () => {
  const location = useLocation();
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  // Detect system dark mode preference
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [darkMode, setDarkMode] = useState(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    return storedDarkMode ? JSON.parse(storedDarkMode) : prefersDarkMode;
  });

  useEffect(() => {
    setCollapsed(JSON.parse(localStorage.getItem("navbarCollapsed") || "false"));
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const toggleNavbar = () => {
    setCollapsed(!collapsed);
    localStorage.setItem("navbarCollapsed", JSON.stringify(!collapsed));
  };

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
    document.body.classList.toggle("dark", newDarkMode);
  };

  const isSelected = (path) => location.pathname === path;

  return (
    <div
      className={`h-screen shadow-lg border-r transition-all duration-300 ease-in-out ${
        collapsed ? "w-20" : "w-72"
      } ${darkMode ? "bg-[#030712] text-white" : "bg-white text-gray-900"}`}
    >
      {/* Top Section */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && <img src={logo} alt="TPGIT Logo" className="h-12" />}
        <button onClick={toggleNavbar} className="hover:text-blue-500">
          <Menu fontSize="large" />
        </button>
      </div>

      <hr className="border-gray-300 dark:border-gray-700" />

      {/* Navigation Items */}
      <div className="flex flex-col mt-2 px-3 mb-1 gap-1 relative">
        {navItems.map((item, index) => (
          <div key={index}>
            <div
              className={`flex items-center px-4 py-2 rounded-lg cursor-pointer transition-all ${
                isSelected(item.path || "")
                  ? "bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 text-white shadow-md"
                  : "hover:bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 hover:text-white"
              }`}
              onClick={() => item.subItems && handleExpand(index)}
            >
              <div className="text-md">{item.icon}</div>
              {!collapsed && (
                <span className="ml-4 text-md font-medium">
                  {item.path ? <Link to={item.path}>{item.label}</Link> : item.label}
                </span>
              )}
              {item.subItems && !collapsed && (
                <div className="ml-auto">{expandedIndex === index ? <ExpandLess /> : <ExpandMore />}</div>
              )}
            </div>

            {/* Sub-items */}
            {item.subItems && expandedIndex === index && !collapsed && (
              <div className="ml-8 mt-1 space-y-1">
                {item.subItems.map((subItem, subIndex) => (
                  <div
                    key={subIndex}
                    className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                      isSelected(subItem.path || "")
                        ? "bg-gradient-to-r from-fuchsia-400 to-fuchsia-500 text-white shadow-md"
                        : "hover:bg-gradient-to-r from-fuchsia-400 to-fuchsia-500 hover:text-white"
                    }`}
                  >
                    <div className="text-md">{subItem.icon}</div>
                    <span className="ml-4">
                      <Link to={subItem.path}>{subItem.label}</Link>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <hr className="border-gray-300 dark:border-gray-700" />

      {/* Bottom Section - User Info & Theme Toggle */}
      <div className={`absolute bottom-1 space-y-2 px-3 ${collapsed ? "flex flex-col items-center" : ""}`}>
        {/* User Info */}
        <Link to="/admin/profile" className="w-full">
          <div
            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all
              hover:bg-gray-300 dark:hover:bg-gray-700 ${collapsed ? "space-x-0" : ""}`}
          >
            <Avatar className="bg-blue-500">A</Avatar>
            {!collapsed && (
              <div>
                <p className="font-medium">Admin</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">admin@example.com</p>
              </div>
            )}
          </div>
        </Link>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className={`w-full flex items-center justify-center rounded-lg transition-all
            hover:bg-gray-100 ${collapsed ? "w-10 h-10 mx-auto hover:bg-gray-900" : ""}`}
        >
          {darkMode ? (
            <LightMode className="text-yellow-500" fontSize="large" />
          ) : (
            <DarkMode className="text-blue-500" fontSize="large" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
