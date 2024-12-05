import React, { useState } from "react";
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
  { label: "Dashboard", icon: <DashboardIcon /> },
  { label: "Student Requests", icon: <PersonIcon /> },
  { label: "Student Details", icon: <SchoolIcon /> },
  { label: "Leave Requests", icon: <ListAltIcon /> },
  {
    label: "Manage Mess",
    icon: <RestaurantIcon />,
    subItems: [
      { label: "Provisions", icon: <StoreIcon /> },
      { label: "Boys Hostel", icon: <ApartmentIcon /> },
      { label: "Girls Hostel", icon: <ApartmentIcon /> },
    ],
  },
  { label: "Notice Board", icon: <NotificationsIcon /> },
  { label: "Complaints", icon: <ReportProblemIcon /> },
  { label: "Feedback", icon: <FeedbackIcon /> },
  { label: "Vacate Requests", icon: <ExitToAppIcon /> },
];

const Navbar = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

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
              className="flex items-center px-8 py-1 text-[#646464] hover:bg-[#0180FF] hover:text-white cursor-pointer transition-all duration-300 rounded-lg"
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
                {item.label}
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
                    className="flex items-center px-8 py-1 text-[#646464] font-semibold hover:bg-[#0180FF] hover:text-white cursor-pointer transition-all duration-300 rounded-lg"
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
                      {subItem.label}
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
