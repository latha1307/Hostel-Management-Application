import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient"; // Adjust path if needed
import { TextField, Button, Typography, Box, Paper } from "@mui/material";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handlePasswordReset = async () => {
    if (!email || !password) {
      setError("Email and Password cannot be empty.");
      return;
    }

    const { data, error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      setError("Failed to authenticate. Please check your email.");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess("Password updated successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#DBEAFE", // Light blue background
      }}
    >
      <Paper
        elevation={5}
        sx={{
          padding: 4,
          maxWidth: 400,
          textAlign: "center",
          backgroundColor: "white",
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" sx={{ color: "#71045F", fontWeight: "bold" }} gutterBottom>
          Reset Your Password
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="success.main">{success}</Typography>}
        {!success && (
          <>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                "& label.Mui-focused": { color: "#71045F" },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": { borderColor: "#71045F" },
                },
              }}
            />
            <TextField
              label="New Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                "& label.Mui-focused": { color: "#71045F" },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": { borderColor: "#71045F" },
                },
              }}
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#71045F",
                color: "white",
                marginTop: 2,
                "&:hover": { backgroundColor: "#5A034D" },
              }}
              onClick={handlePasswordReset}
            >
              Update Password
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default ResetPassword;
