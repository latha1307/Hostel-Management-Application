import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import { Edit, Save, Add, Delete, ArrowBack } from "@mui/icons-material";
import { Link } from "react-router-dom";

const AdminDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [admin, setAdmin] = useState({ name: "John Doe", email: "admin@example.com", password: "" });
  const [admins, setAdmins] = useState([
    { name: "Jane Smith", email: "jane@example.com" },
    { name: "Robert Brown", email: "robert@example.com" },
    { name: "Robert Brown", email: "robert@example.com" },
  ]);

  const handleEditClick = () => setIsEditing(!isEditing);

  const handleChange = (e) => setAdmin({ ...admin, [e.target.name]: e.target.value });

  const handleRemoveAdmin = (index) => {
    const updatedAdmins = admins.filter((_, i) => i !== index);
    setAdmins(updatedAdmins);
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 5 }}>
      <Card
        sx={{
          background: "#fff",
          padding: 3,
          borderRadius: 3,
          boxShadow: 5,
        }}
      >
        <CardContent>
          <div className="flex justify-start items-center">
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#00654D'}}>
              Admin Details
            </Typography>
            <IconButton color="primary" onClick={handleEditClick}>
              {isEditing ? <Save /> : <Edit />}
            </IconButton>
          </div>

          <div className="flex gap-6 mt-4">
            {/* Left: Admin Details */}
            <div className="w-1/2">
              <TextField
                fullWidth
                margin="normal"
                label="Name"
                name="name"
                value={admin.name}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                value={admin.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Change Password"
                type="password"
                name="password"
                value={admin.password}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            {/* Vertical Divider */}
            <Divider orientation="vertical" flexItem sx={{ bgcolor: "gray.400", width: "2px" }} />

            {/* Right: Other Admins */}
            <div className="w-1/2">
              <div className="flex justify-between items-center mb-3">
                <Typography variant="h6" fontWeight="bold" color="secondary">
                  Other Admins
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  color="secondary"
                  component={Link}
                  to="/admin/add"
                >
                  Add Admin
                </Button>
              </div>

              <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
                <Table>
                  <TableHead sx={{ background: "#7B1FA2" }}>
                    <TableRow>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Name</TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Email</TableCell>
                      <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {admins.map((admin, index) => (
                      <TableRow key={index}>
                        <TableCell>{admin.name}</TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>
                          <IconButton color="error" onClick={() => handleRemoveAdmin(index)}>
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-start mt-5">
        <Button variant="contained" startIcon={<ArrowBack />}>
          Back
        </Button>
      </div>
    </Container>
  );
};

export default AdminDetails;
