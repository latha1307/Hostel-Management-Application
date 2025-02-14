import React, { useState } from "react";
import bgImage from "./assets/blueimages.png";
import { Card, CardContent, Button, TextField, Typography } from "@mui/material";
import { MdPerson, MdOutlineMail, MdCall, MdLock, MdArrowBack, MdPersonAdd, MdEdit, MdSave } from "react-icons/md";

const App = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "Clay Jensen",
    role: "Administrator",
    email: "clay.jensen@email.com",
    phone: "(+61) (45687) (45687)",
    password: "******"
  });

  const handleChange = (e) => {

    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div
      className="w-screen h-screen bg-cover bg-center flex justify-center items-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        filter: "brightness(1.1) contrast(1.2)"
      }}
    >
      <Card className="w-[90%] max-w-4xl shadow-lg">
        <CardContent className="pt-3">
          <div className="flex items-center justify-between pt-7">
            <Typography variant="h5" className="font-bold text-gray-800 flex items-center space-x-2">
              <MdPerson size={24} className="text-gray-800" />
              {isEditing ? (
                <TextField name="name" value={user.name} onChange={handleChange} size="small" variant="outlined" />
              ) : (
                <span>{user.name}</span>
              )}
            </Typography>
            <div className="space-x-4">
              <Button variant="contained" style={{ backgroundColor: "green", color: "white" }} size="small" startIcon={<MdPersonAdd />}>Add Admin</Button>
              <Button variant="contained" color="primary" size="small" startIcon={isEditing ? <MdSave /> : <MdEdit />} onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? "Save" : "Edit"}
              </Button>
            </div>
          </div>

          {/* User Info */}
          <div className="mt-4 space-y-2">
            <Typography variant="body2">
              <span className="font-semibold">Role:</span>
              {isEditing ? (
                <TextField name="role" value={user.role} onChange={handleChange} size="small" variant="outlined" />
              ) : (
                ` ${user.role}`
              )}
            </Typography>
            <Typography variant="body2" className="flex items-center space-x-2">
              <MdOutlineMail />
              {isEditing ? (
                <TextField name="email" value={user.email} onChange={handleChange} size="small" variant="outlined" />
              ) : (
                <span>{user.email}</span>
              )}
            </Typography>
            <Typography variant="body2" className="flex items-center space-x-2">
              <MdCall />
              {isEditing ? (
                <TextField name="phone" value={user.phone} onChange={handleChange} size="small" variant="outlined" />
              ) : (
                <span>{user.phone}</span>
              )}
            </Typography>
            {/* Password Field */}
            <div className="flex items-center space-x-2">
              <MdLock />
              {isEditing ? (
                <TextField type="password" name="password" value={user.password} onChange={handleChange} size="small" variant="outlined" />
              ) : (
                <input type="password" value={user.password} disabled className="bg-transparent border-none focus:outline-none" />
              )}
            </div>
            {/* Back Button */}
            <Button variant="contained" color="primary" onClick={() => window.history.back()} startIcon={<MdArrowBack />}>Back</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
