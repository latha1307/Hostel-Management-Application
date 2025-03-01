import React, { useState, useEffect } from "react";
import {
  Container, TextField, Button, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Card, CardContent, Box, InputAdornment, IconButton
} from "@mui/material";
import { Person, Email, Phone, Lock, ArrowBack, Delete } from "@mui/icons-material"; // Import Icons
import supabase from "../supabaseClient"; // Ensure correct path to supabaseClient.js

const AdminManagement = () => {
  const [admin, setAdmin] = useState({ name: "", email: "", phone: "", password: "" });
  const [adminList, setAdminList] = useState<{ id: string; name: string; email: string; phone: string }[]>([]);

  // Fetch Admins from Supabase
  useEffect(() => {
    const fetchAdmins = async () => {
      const { data, error } = await supabase.from("admins").select("id, name, email, phone");
      if (error) {
        console.error("Error fetching admins:", error.message);
      } else {
        setAdminList(data);
      }
    };
    fetchAdmins();
  }, []);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (admin.name && admin.email && admin.phone && admin.password) {
      const { data, error } = await supabase
        .from("admins")
        .insert([{ name: admin.name, email: admin.email, phone: admin.phone, password: admin.password }])
        .select();
      if (error) {
        console.error("Error adding admin:", error.message);
      } else {
        setAdminList([...adminList, ...data]); // Add new admin to the list
        setAdmin({ name: "", email: "", phone: "", password: "" }); // Clear form
      }
    }
  };

  // Handle removing an admin
  const handleRemoveAdmin = async (id: string) => {
    const { error } = await supabase.from("admins").delete().eq("id", id);
    if (error) {
      console.error("Error deleting admin:", error.message);
    } else {
      setAdminList(adminList.filter((admin) => admin.id !== id));
    }
  };

  return (
    <Box
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
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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
            <IconButton sx={{ position: "absolute", top: 10, left: 10 }} onClick={() => window.history.back()}>
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

        {/* Admin List Table */}
        {adminList.length > 0 && (
          <TableContainer component={Paper} sx={{ width: { xs: "100%", sm: "85%", md: "60%" }, boxShadow: 4, borderRadius: 3 }}>
            <Table>
              <TableHead sx={{ background: "#7B1FA2" }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Phone</TableCell>
                  <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {adminList.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>{admin.phone}</TableCell>
                    <TableCell>
                      <IconButton color="error" onClick={() => handleRemoveAdmin(admin.id)}>
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
