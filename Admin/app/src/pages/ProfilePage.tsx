import React, { useEffect, useState } from "react";
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
import supabase from "../supabaseClient";

interface Admin {
  name: string;
  email: string;
}

interface Props {
  email: string | null;
}

const AdminDetails: React.FC<Props> = ({ email }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [admins, setAdmins] = useState<Admin[]>([]);

  useEffect(() => {
    if (email) {
      fetchAdminDetails(email);
    }
    fetchAllAdmins();
  }, [email]);

  // Fetch the logged-in admin details
  const fetchAdminDetails = async (adminEmail: string) => {
    const { data, error } = await supabase
      .from("admin")
      .select("*")
      .eq("email", adminEmail)
      .single();

    if (error) {
      console.error("Error fetching admin details:", error);
    } else {
      setAdmin(data);
    }
  };

  // Fetch all admins (excluding the logged-in admin)
  const fetchAllAdmins = async () => {
    const { data, error } = await supabase.from("Admin").select("*");

    if (error) {
      console.error("Error fetching admins:", error);
    } else {
      setAdmins(data);
    }
  };

  const handleEditClick = () => setIsEditing(!isEditing);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (admin) {
      setAdmin({ ...admin, [e.target.name]: e.target.value });
    }
  };

  const handleRemoveAdmin = async (adminEmail: string) => {
    const { error } = await supabase.from("admin").delete().eq("email", adminEmail);

    if (error) {
      console.error("Error deleting admin:", error);
    } else {
      setAdmins(admins.filter((a) => a.email !== adminEmail));
    }
  };

  if (!email) {
    return <Typography variant="h6">No Admin Logged In</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ marginTop: 5 }}>
      <Card sx={{ background: "#fff", padding: 3, borderRadius: 3, boxShadow: 5 }}>
        <CardContent>
          <div className="flex justify-start items-center">
            <Typography variant="h5" fontWeight="bold" sx={{ color: "#00654D" }}>
              Admin Details
            </Typography>
            <IconButton color="primary" onClick={handleEditClick}>
              {isEditing ? <Save /> : <Edit />}
            </IconButton>
          </div>

          {admin ? (
            <div className="flex gap-6 mt-4">
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
                  disabled
                />
              </div>

              <Divider orientation="vertical" flexItem sx={{ bgcolor: "gray.400", width: "2px" }} />

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
                      {admins.map((adminItem, index) => (
                        <TableRow key={index}>
                          <TableCell>{adminItem.name}</TableCell>
                          <TableCell>{adminItem.email}</TableCell>
                          <TableCell>
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveAdmin(adminItem.email)}
                            >
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
          ) : (
            <Typography variant="h6">Admin details not found.</Typography>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-start mt-5">
        <Button variant="contained" startIcon={<ArrowBack />} component={Link} to="/">
          Back
        </Button>
      </div>
    </Container>
  );
};

export default AdminDetails;
