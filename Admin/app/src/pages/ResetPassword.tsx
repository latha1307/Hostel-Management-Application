import React from "react";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";// Adjust based on your setup
import { TextField, Button, Typography, Box } from "@mui/material";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Extract the access token from the URL
  const accessToken = searchParams.get("token");

  const handlePasswordReset = async () => {
    if (!password) {
      setError("Password cannot be empty.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Password updated successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000); // Redirect after 2 seconds
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", textAlign: "center", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Reset Your Password
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      {success && <Typography color="success.main">{success}</Typography>}
      {!success && (
        <>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handlePasswordReset}>
            Update Password
          </Button>
        </>
      )}
    </Box>
  );
};

export default ResetPassword;
