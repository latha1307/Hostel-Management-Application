import React, { useState } from "react";
import { 
  Container, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Card, CardContent, Box, InputAdornment, IconButton
} from "@mui/material";
import { Person, Email, Phone, Lock, ArrowBack } from "@mui/icons-material"; // Import Icons

const AdminManagement = () => {
  const [admin, setAdmin] = useState({ name: "", email: "", phone: "", password: "" });
  const [adminList, setAdminList] = useState([]);

  // Handle input change
  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (admin.name && admin.email && admin.phone && admin.password) {
      setAdminList([...adminList, admin]); // Add new admin to list
      setAdmin({ name: "", email: "", phone: "", password: "" }); // Clear form fields
    }
  };

  return (
    <Box 
      sx={{ 
        background: "url('https://www.protechguy.com/wp-content/uploads/sites/712/2021/01/bigstock-Closed-Padlock-On-Digital-Back-383628656-scaled.jpg') center/cover no-repeat", 
        minHeight: "100vh",  
        display: "flex", 
        flexDirection: "column",
        alignItems: "center", 
        justifyContent: "center",  
        py: 3  
      }}
    >
      <Container 
        maxWidth={false}  
        disableGutters
        sx={{ 
          display: "flex", 
          flexDirection: "column",
          alignItems: "center",
          width: "100vw", 
          px: { xs: 2, sm: 3, md: 5, lg: 10 }, 
        }}
      >
        {/* Admin Form Card */}
        <Card 
          sx={{ 
            width: { xs: "100%", sm: "85%", md: "60%", lg: "50%", xl: "40%" },  
            boxShadow: 6, 
            borderRadius: 3, 
            p: 3,
            background: "rgba(255, 255, 255, 0.8)",  
            backdropFilter: "blur(10px)", 
            mb: 3  
          }}
        >
          <CardContent>
            <IconButton sx={{ position: "absolute", top: 10, left: 10 }}>
              <ArrowBack color="primary" />
            </IconButton>
            <Typography variant="h5" fontWeight="bold" textAlign="center" color="primary" mb={2}>
              Add New Admin
            </Typography>

            {/* Admin Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <TextField 
                label="Name" 
                variant="outlined" 
                name="name" 
                value={admin.name} 
                onChange={handleChange} 
                fullWidth 
                required
                InputProps={{ 
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="primary" />
                    </InputAdornment>
                  ) 
                }} 
              />

              <TextField 
                label="Email" 
                type="email" 
                variant="outlined" 
                name="email" 
                value={admin.email} 
                onChange={handleChange} 
                fullWidth 
                required
                InputProps={{ 
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="primary" />
                    </InputAdornment>
                  ) 
                }} 
              />

              <TextField 
                label="Phone Number" 
                type="tel" 
                variant="outlined" 
                name="phone" 
                value={admin.phone} 
                onChange={handleChange} 
                fullWidth 
                required
                InputProps={{ 
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="primary" />
                    </InputAdornment>
                  ) 
                }} 
              />

              <TextField 
                label="Password" 
                type="password" 
                variant="outlined" 
                name="password" 
                value={admin.password} 
                onChange={handleChange} 
                fullWidth 
                required
                InputProps={{ 
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="primary" />
                    </InputAdornment>
                  ) 
                }} 
              />

              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                sx={{ mt: 2, py: 1, fontSize: "1rem", borderRadius: 2 }}
              >
                Add Admin
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AdminManagement;
