import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { FaSun, FaMoon } from "react-icons/fa";
import { Avatar, Tooltip } from "@mui/material";
import logo from "../assets/TPGIT_logo_created.png";

export const Header = ({ darkMode, toggleDarkMode, toggleSidebar, email }) => {
  const firstLetter = email ? email.charAt(0).toUpperCase() : "A";

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          {/* Sidebar Toggle & Logo */}
          <div className="flex items-center">
            <button
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:bg-gray-700 dark:ring-gray-600"
              onClick={toggleSidebar}
            >
              <HiOutlineMenuAlt2 className="text-2xl" />
            </button>
            <a href="/" className="flex ms-2 md:me-24 dark:bg-white dark:rounded-[4px]">
              <img src={logo} alt="TPGIT Logo" className="h-10 me-3" />
            </a>
          </div>

          {/* Dark Mode Toggle & Admin Avatar */}
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button className="dark:bg-slate-50 dark:text-slate-700 rounded-full p-2" onClick={toggleDarkMode}>
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            {/* Admin Avatar */}
            <Tooltip title={email || "Admin"} arrow>
              <Link to="/admin/profile">
              <Avatar className="bg-blue-500 text-white cursor-pointer">
                {firstLetter}
              </Avatar>
              </Link>
            </Tooltip>
          </div>
        </div>
      </div>
    </nav>
  );
};
