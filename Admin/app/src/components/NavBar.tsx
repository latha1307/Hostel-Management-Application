import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  ExpandMore
} from "@mui/icons-material";
import { Tooltip } from "@mui/material"; // Import Tooltip

const navItems = [
  { label: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
  { label: "Student Requests", icon: <Person />, path: "/student-requests" },
  { label: "Student Details", icon: <School />, path: "/student-details" },
  { label: "Leave Requests", icon: <ListAlt />, path: "/leave-requests" },
  {
    label: "Manage Mess",
    icon: <Restaurant />,
    subItems: [
      { label: "Inventory", icon: <Store />, path: "/mess/provisions" },
      { label: "Boys Hostel", icon: <Apartment />, path: "/manage-mess/Boys" },
      { label: "Girls Hostel", icon: <Apartment />, path: "/manage-mess/Girls" },
    ],
  },
  { label: "Notice Board", icon: <Notifications />, path: "/notice-board" },
  { label: "Complaints", icon: <ReportProblem />, path: "/complaints" },
  { label: "Vacate Requests", icon: <ExitToApp />, path: "/vacate-requests" },
];

const Navbar = ({ isSidebarOpen }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen pt-20 bg-white border-r border-gray-200 dark:bg-gray-800 transition-all ${
        isSidebarOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="h-full px-3 pb-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          {navItems.map((item, index) => (
            <div key={index}>
              <Tooltip title={!isSidebarOpen ? item.label : ""} placement="right">
                <div
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => item.subItems && handleExpand(index)}
                >
                  <div className="mr-2">{item.icon}</div>
                  {isSidebarOpen && (
                    <span className="ml-4 text-md">
                      {item.path ? <Link to={item.path}>{item.label}</Link> : item.label}
                    </span>
                  )}
                  {item.subItems && isSidebarOpen && (
                    <div className="ml-auto">
                      {expandedIndex === index ? <ExpandLess /> : <ExpandMore />}
                    </div>
                  )}
                </div>
              </Tooltip>

              {/* Sub-items */}
              {item.subItems && expandedIndex === index && isSidebarOpen && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.subItems.map((subItem, subIndex) => (
                    <Tooltip key={subIndex} title={!isSidebarOpen ? subItem.label : ""} placement="right">
                      <div
                        className="flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-lg transition-all"
                      >
                        <div className="text-md">{subItem.icon}</div>
                        <span className="ml-4">
                          <Link to={subItem.path}>{subItem.label}</Link>
                        </span>
                      </div>
                    </Tooltip>
                  ))}
                </div>
              )}
            </div>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Navbar;
