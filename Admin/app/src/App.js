import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/NavBar.tsx";
import { User } from "./user.tsx";
import "./index.css";
import Main from "./pages/BoysHostel/main.tsx";
import Groceries from "./pages/BoysHostel/Grocery.tsx";

function App() {
  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="min-w-[200px] bg-gray-100">
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
              <Route path="/manage-mess/boys-hostel" element={<Main />} />
              <Route path="/manage-mess/boys-hostel/groceries" element={<Groceries/>}/>
              <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}


export default App;
