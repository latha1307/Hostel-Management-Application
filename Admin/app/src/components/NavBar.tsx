import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/TPGIT_logo_created.png";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import ListAltIcon from "@mui/icons-material/ListAlt";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import StoreIcon from "@mui/icons-material/Store";
import ApartmentIcon from "@mui/icons-material/Apartment";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import FeedbackIcon from "@mui/icons-material/Feedback";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { theme } from "../constants/theme";

const navItems = [
  { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { label: "Student Requests", icon: <PersonIcon />, path: "/student-requests" },
  { label: "Student Details", icon: <SchoolIcon />, path: "/student-details" },
  { label: "Leave Requests", icon: <ListAltIcon />, path: "/leave-requests" },
  {
    label: "Manage Mess",
    icon: <RestaurantIcon />,
    subItems: [
      { label: "Inventory", icon: <StoreIcon />, path: "/mess/provisions" },
      { label: "Boys Hostel", icon: <ApartmentIcon />, path: "/manage-mess/Boys" },
      { label: "Girls Hostel", icon: <ApartmentIcon />, path: "/manage-mess/Girls" },
    ],
  },
  { label: "Notice Board", icon: <NotificationsIcon />, path: "/notice-board" },
  { label: "Complaints", icon: <ReportProblemIcon />, path: "/complaints" },
  { label: "Feedback", icon: <FeedbackIcon />, path: "/feedback" },
  { label: "Vacate Requests", icon: <ExitToAppIcon />, path: "/vacate-requests" },
];

const Navbar = () => {
  const location = useLocation(); // Get the current URL path
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Load expandedIndex from localStorage when component mounts
  useEffect(() => {
    const savedIndex = JSON.parse(localStorage.getItem("navbarExpandedIndex") || "null");
    if (savedIndex !== null) {
      setExpandedIndex(savedIndex);
    }
  }, []);

  const handleExpand = (index: number) => {
    const newExpandedIndex = expandedIndex === index ? null : index;
    setExpandedIndex(newExpandedIndex);
    localStorage.setItem("navbarExpandedIndex", JSON.stringify(newExpandedIndex));
  };

  const isSelected = (path: string) => location.pathname === path;

  return (
    <div className="w-72 h-screen bg-white">
      {/* Logo Section */}
      <div className="px-16 py-3">
        <img src={logo} alt="TPGIT Logo" />
      </div>
      <hr className="border border-[#D8E3FF]" />

      {/* Navigation Items */}
      <div className="space-y-1 flex flex-col mt-4 px-6">
        {navItems.map((item, index) => (
          <div key={index}>
            <div
              className={`flex items-center px-8 py-1 cursor-pointer transition-all duration-300 rounded-lg ${
                isSelected(item.path || "")
                  ? "bg-[#0180FF] text-white"
                  : "text-[#646464] hover:bg-[#0180FF] hover:text-white"
              }`}
              style={{ borderRadius: "8px" }}
              onClick={() => item.subItems && handleExpand(index)}
            >
              <div style={{ fontSize: "1.5rem" }}>{item.icon}</div>
              <span
                className="ml-4"
                style={{
                  fontSize: theme.radius.md,
                  fontWeight: theme.fonts.bold,
                }}
              >
                {item.path ? (
                  <Link to={item.path} className="w-full">
                    {item.label}
                  </Link>
                ) : (
                  <span>{item.label}</span>
                )}
              </span>
              {item.subItems && (
                <div className="ml-auto">
                  {expandedIndex === index ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </div>
              )}
            </div>
            {/* Sub-items */}
            {item.subItems && expandedIndex === index && (
              <div className="ml-12 mt-1 space-y-1">
                {item.subItems.map((subItem, subIndex) => (
                  <div
                    key={subIndex}
                    className={`flex items-center px-8 py-1 cursor-pointer transition-all duration-300 rounded-lg ${
                      isSelected(subItem.path || "")
                        ? "bg-[#0180FF] text-white"
                        : "text-[#646464] hover:bg-[#0180FF] hover:text-white"
                    }`}
                    style={{ borderRadius: "8px" }}
                  >
                    <div style={{ fontSize: "1.2rem" }}>{subItem.icon}</div>
                    <span
                      className="ml-4"
                      style={{
                        fontSize: theme.radius.sm,
                        fontWeight: theme.fonts.regular,
                      }}
                    >
                      {subItem.path ? (
                        <Link to={subItem.path}>{subItem.label}</Link>
                      ) : (
                        <span>{subItem.label}</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
