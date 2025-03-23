import React, { useState } from "react";
import supabase from "../supabaseClient"; // Import Supabase client
import {
  Container, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Card, CardContent, Box, InputAdornment, IconButton
} from "@mui/material";
import { Person, Email, Lock, Delete, ArrowBack } from "@mui/icons-material";

const AdminManagement = () => {
  const [admin, setAdmin] = useState({ name: "", email: "", password: "" });
  const [adminList, setAdminList] = useState<{ name: string; email: string;}[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create a new user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: admin.email,
        password: admin.password,
      });

      if (authError) throw authError;

      // Insert new admin into Supabase database
      const { data, error } = await supabase.from("admin").insert([
        { name: admin.name, email: admin.email},
      ]);

      if (error) throw error;

      // Update admin list in state
      setAdminList([...adminList, { name: admin.name, email: admin.email}]);
      setAdmin({ name: "", email: "", password: "" });
    } catch (error) {
      console.error("Error adding admin:", error);
      alert("Failed to add admin: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      className="dark:bg-gray-800"
      sx={{
        background: "white",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 3
      }}
    >
      <Container maxWidth={false} disableGutters sx={{ display: "flex", flexDirection: "column", alignItems: "center", px: { xs: 2, sm: 3, md: 5, lg: 10 } }}>
        <Card className="dark:bg-gray-600" sx={{ width: { xs: "100%", sm: "85%", md: "60%" }, boxShadow: 6, borderRadius: 3, p: 3, background: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(10px)", mb: 3 }}>
          <CardContent>
            <IconButton sx={{ position: "absolute", top: 10, left: 10 }} onClick={() => window.history.back()}>
              <ArrowBack className="dark:text-gray-200" color="primary" />
            </IconButton>
            <Typography className="dark:text-gray-200" variant="h5" fontWeight="bold" textAlign="center" color="primary" mb={2}>
              Add New Admin
            </Typography>

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
    ),
  }}
  sx={{
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#ccc" },
      "&:hover fieldset": { borderColor: "#999" },
      "&.Mui-focused fieldset": { borderColor: "#1976d2" },
    },
    "& .MuiInputBase-input": { color: "#000" },
    "& .MuiInputLabel-root": { color: "#666" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#1976d2" },

    "@media (prefers-color-scheme: dark)": {
      "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "#f3f4f6" },
        "&:hover fieldset": { borderColor: "#e5e7eb" },
        "&.Mui-focused fieldset": { borderColor: "white" },
      },
      "& .MuiInputBase-input": { color: "#f3f4f6" },
      "& .MuiInputLabel-root": { color: "#e5e7eb" }, // gray-200
      "& .MuiInputLabel-root.Mui-focused": { color: "#e5e7eb" },
    },
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
    ),
  }}
  sx={{
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#ccc" },
      "&:hover fieldset": { borderColor: "#999" },
      "&.Mui-focused fieldset": { borderColor: "#1976d2" },
    },
    "& .MuiInputBase-input": { color: "#000" },
    "& .MuiInputLabel-root": { color: "#666" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#1976d2" },

    "@media (prefers-color-scheme: dark)": {
      "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "#f3f4f6" },
        "&:hover fieldset": { borderColor: "#e5e7eb" },
        "&.Mui-focused fieldset": { borderColor: "white" },
      },
      "& .MuiInputBase-input": { color: "#f3f4f6" },
      "& .MuiInputLabel-root": { color: "#e5e7eb" }, // gray-200
      "& .MuiInputLabel-root.Mui-focused": { color: "#e5e7eb" },
    },
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
    ),
  }}
  sx={{
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#ccc" },
      "&:hover fieldset": { borderColor: "#999" },
      "&.Mui-focused fieldset": { borderColor: "#1976d2" },
    },
    "& .MuiInputBase-input": { color: "#000" },
    "& .MuiInputLabel-root": { color: "#666" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#1976d2" },

    "@media (prefers-color-scheme: dark)": {
      "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "#f3f4f6" },
        "&:hover fieldset": { borderColor: "#e5e7eb" },
        "&.Mui-focused fieldset": { borderColor: "white" },
      },
      "& .MuiInputBase-input": { color: "#f3f4f6" },
      "& .MuiInputLabel-root": { color: "#e5e7eb" }, // gray-200
      "& .MuiInputLabel-root.Mui-focused": { color: "#e5e7eb" },
    },
  }}
/>



              <Button type="submit" variant="contained" color="primary" sx={{ mt: 2, py: 1, fontSize: "1rem", borderRadius: 2 }} disabled={loading}>
                {loading ? "Adding..." : "Add Admin"}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {adminList.length > 0 && (
          <TableContainer component={Paper} sx={{ width: { xs: "100%", sm: "85%", md: "60%" }, boxShadow: 4, borderRadius: 3 }}>
            <Table>
              <TableHead sx={{ background: "#7B1FA2" }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {adminList.map((admin, index) => (
                  <TableRow key={index}>
                    <TableCell>{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      <IconButton color="error">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Box>
  );
};

export default AdminManagement;
