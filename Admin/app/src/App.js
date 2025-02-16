import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/NavBar.tsx";
import { User } from "./user.tsx";
import "./index.css";
import Main from "./pages/Mess/main.tsx";
import Groceries from "./pages/Mess/Grocery.tsx";
import Provisions from "./pages/Mess/Provisions.tsx";
import StaffSalary from "./pages/Mess/StaffSalary.tsx";

function App() {
  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="min-w-[300px] bg-white">
          <Navbar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col relative">
          {/* User Profile Section */}
          <div className="absolute top-0 right-0 p-4">
            <User />
          </div>


          {/* Routes and Main Content */}
          <div className="flex-grow mt-24 mx-8">
            <Routes>
              <Route path="/mess/provisions" element={<Provisions />}/>
              <Route path="/manage-mess/:hostel" element={<Main />} />
              <Route path="/manage-mess/:hostel/groceries" element={<Groceries/>}/>
              <Route path="/manage-mess/:hostel/staffsalary" element={<StaffSalary />}/>
              <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}


export default App;
