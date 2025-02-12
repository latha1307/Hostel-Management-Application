import React from "react";
import { 
  Card, CardContent, Container, TextField, Button, Typography, Link, Box, InputAdornment
} from "@mui/material";
import { Lock, Mail } from "@mui/icons-material";

const AdminLogin = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        background: "url('https://www.protechguy.com/wp-content/uploads/sites/712/2021/01/bigstock-Closed-Padlock-On-Digital-Back-383628656-scaled.jpg') center/cover no-repeat", 
        px: 2,
      }}
    >
      <Container 
        maxWidth="xl"
        sx={{ 
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: { xs: "95%", sm: "80%", md: "60%", lg: "50%", xl: "40%" },
        }}
      >
        <Card 
          sx={{ 
            width: "100%", 
            borderRadius: 6, 
            boxShadow: 10, 
            overflow: "hidden",
            background: "rgba(255, 255, 255, 0.8)", 
            backdropFilter: "blur(10px)",
            p: { xs: 3, md: 5 },
          }}
        >
          <CardContent sx={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
            
            {/* Simple Logo Styling */}
            <Box
              component="img"
              src="https://github.com/latha1307/TPGIT_hostel/blob/main/src/assets/TPGIT_logo_created.png?raw=true"
              alt="TPGIT Logo"
              sx={{ 
                width: 180, 
                height: 120, 
                marginBottom: 3, 
                display: "block",
                borderRadius: 2, // Rounded edges
             
              }}
            />
            
            {/* Admin Login Title */}
            <Typography variant="h4" fontWeight="bold" color="#0072ff" mb={3}>
              Admin Login
            </Typography>

            {/* Email Input */}
            <TextField 
              fullWidth 
              label="Email" 
              variant="outlined" 
              margin="normal" 
              InputProps={{ 
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail color="primary" />
                  </InputAdornment>
                ) 
              }} 
            />

            {/* Password Input */}
            <TextField 
              fullWidth 
              label="Password" 
              type="password" 
              variant="outlined" 
              margin="normal" 
              InputProps={{ 
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ) 
              }} 
            />
            
            {/* Forgot Password Link Aligned Right */}
            <Box width="100%" display="flex" justifyContent="flex-end" mt={1}>
              <Link href="#" variant="body2">
                Forgot Password?
              </Link>
            </Box>
            
            {/* Sign In Button with Blue Theme */}
            <Button 
              fullWidth 
              variant="contained" 
              sx={{ 
                mt: 3, 
                py: 1.2, 
                fontSize: "1rem",
                borderRadius: 12,
                background: "linear-gradient(to right, #0072ff, #00c6ff)", 
                color: "white",
                "&:hover": {
                  background: "linear-gradient(to right, #005bb5, #009fda)"
                }
              }}
            >
              Login
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default AdminLogin;
