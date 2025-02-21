import React from "react";
import bgImage from "./assets/blueimages.png"; // Import the image
import { Card, CardContent, Button, Typography } from "@mui/material";
import { MdPerson, MdOutlineMail, MdCall, MdLock,MdArrowBack, MdPersonAdd, MdEdit } from "react-icons/md";

const App = () => {
  return (
    <div
      className="w-screen h-screen bg-cover bg-center flex justify-center items-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",      // Ensures the image covers the entire area
        backgroundPosition: "center",  // Centers the image
        backgroundRepeat: "no-repeat", // Prevents repeating
        filter: "brightness(1.1) contrast(1.2)", // Enhances brightness & contrast
      }}
    >
      {/* Empty div with only background */}



    
      {/* Profile Details Card */}
      <Card className="w-[90%] max-w-4xl shadow-lg ">
        <CardContent className="pt-3">
          <div className="flex items-center justify-between  pt-7">
            <Typography variant="h5" className="font-bold text-gray-800 flex items-center space-x-2">
              <MdPerson size={24} className="text-gray-800 " />
              <span>Clay Jensen</span>
            </Typography>
            <div className="space-x-4">
              <Button variant="contained" style={{ backgroundColor: "green", color: "white" }} size="small" startIcon={<MdPersonAdd />}>
                Add Admin
              </Button>
              <Button variant="contained" color="primary" size="small"startIcon={<MdEdit />}>
                Edit
              </Button>
            </div>
          </div>

          {/* User Info */}
          <div className="mt-4 space-y-2">
            <Typography variant="body2">
              <span className="font-semibold">Role:</span> Administrator
            </Typography>
            <Typography variant="body2" className="flex items-center space-x-2">
              <MdOutlineMail /> <span>clay.jensen@email.com</span>
            </Typography>
            <Typography variant="body2" className="flex items-center space-x-2">
              <MdCall /> <span>(+61) (45687) (45687)</span>
            </Typography>
            {/* Password Field */}
            <div className="flex items-center space-x-2">
              <MdLock />
              <input
                type="password"
                value="******"
                disabled
                className="bg-transparent border-none focus:outline-none"
              />
            </div>
              {/* Back Button */}
            <Button variant="contained" color="primary" onClick={() => window.history.back()} startIcon={<MdArrowBack />}>
              Back
            </Button>
          </div>
          
        </CardContent>
       
      </Card>
       
    </div>
  );
};

export default App;
