import React, { createContext, useState, useEffect } from "react";
import { useMediaQuery } from "@mui/material";

// Create Context
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Detect system preference
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  // Load theme from localStorage or use system preference
  const [darkMode, setDarkMode] = useState(
    JSON.parse(localStorage.getItem("darkMode")) ?? prefersDarkMode
  );

  // Apply theme globally
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
