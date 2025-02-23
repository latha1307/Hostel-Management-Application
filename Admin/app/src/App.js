import React from "react";
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
import AdminDetails from "./pages/ProfilePage.jsx"
import AdminManagement from "./pages/AddAdmin.tsx"

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex h-full">
          <div >
            <Navbar />
          </div>

          <div className="flex-1 flex flex-col relative">
            <div className="flex-grow mt-12  mx-auto max-w-[calc(100vw-100px)] w-full overflow-x-hidden px-6">
              <Routes>
                <Route path="/mess/provisions" element={<Provisions />} />
                <Route path="/manage-mess/:hostel" element={<Main />} />
                <Route path="/manage-mess/:hostel/groceries" element={<Groceries />} />
                <Route path="/manage-mess/:hostel/staffsalary" element={<StaffSalary />} />
                <Route path="/manage-mess/:hostel/attendance" element={<Studentattendence />}/>
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
