import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box
} from "@mui/material";
import { Edit, ArrowBack, Logout, Delete } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";

interface Admin {
  id: number;
  name: string;
  email: string;
}

interface Props {
  email: string | null;
}

const ProfilePage: React.FC<Props> = ({ email }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (email) fetchAdminDetails(email);
    fetchAllAdmins();
  }, [email]);

  const fetchAdminDetails = async (adminEmail: string) => {
    const { data, error } = await supabase.from("admin").select("*").eq("email", adminEmail).single();
    if (!error) setAdmin(data);
  };

  const fetchAllAdmins = async () => {
    const { data } = await supabase.from("admin").select("*");
    if (data) setAdmins(data);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login");
      window.location.reload()
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const handleDeleteAdmin = async () => {
    if (adminToDelete) {
      await supabase.from("admin").delete().eq("id", adminToDelete.id);
      setAdmins(admins.filter(a => a.id !== adminToDelete.id));
      setDeleteDialogOpen(false);
      setSnackbarMessage("Admin deleted successfully!");
      setSnackbarOpen(true);
    }
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 5, padding:1 }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button variant="contained" startIcon={<ArrowBack />} component={Link} to="/">
          Back
        </Button>
        <Button variant="contained" color="error" startIcon={<Logout />} onClick={handleLogout}> Logout </Button>
      </Box>

      <Card className="dark:bg-gray-700" sx={{ padding: 3, borderRadius: 3, boxShadow: 5, bgcolor: "#f5f5f5" }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold" color="primary" className="dark:text-gray-200">Admin Profile</Typography>
            <IconButton color="primary" onClick={() => setIsEditing(!isEditing)}>
              <Edit />
            </IconButton>
          </Box>

          {admin && (
            <Box>
            <TextField
  fullWidth
  margin="normal"
  label="Name"
  value={admin.name}
  disabled={!isEditing}
  sx={{
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: isEditing ? "#bdbdbd" : "#d1d1d1" }, // Light gray when not editing
      "&.Mui-focused fieldset": { borderColor: "#1976d2" }, // Blue focus color
      ".dark & fieldset": { borderColor: "#e5e7eb" } // Gray-200 in dark mode
    },
    "& .MuiInputBase-input": {
      color: isEditing ? "black" : "#757575", // Gray text in light mode
      ".dark &": { color: "white !important" } // Ensures text is **always** white in dark mode
    },
    "& .MuiInputLabel-root": {
      color: isEditing ? "#757575" : "#a0a0a0", // Light gray when not editing for blur effect
      opacity: isEditing ? 1 : 0.6, // Reduce opacity for blur-like effect
      ".dark &": { color: "#e5e7eb" } // Full opacity in dark mode
    }
  }}
/>


<TextField
  fullWidth
  margin="normal"
  label="Email"
  value={admin.email}
  disabled
  sx={{
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: isEditing ? "#bdbdbd" : "#d1d1d1" }, // Light gray when not editing
      "&.Mui-focused fieldset": { borderColor: "#1976d2" }, // Blue focus color
      ".dark & fieldset": { borderColor: "#e5e7eb" } // Gray-200 in dark mode
    },
    "& .MuiInputBase-input": {
      color: isEditing ? "black" : "#757575", // Gray text in light mode
      ".dark &": { color: "white !important" } // Ensures text is **always** white in dark mode
    },
    "& .MuiInputLabel-root": {
      color: isEditing ? "#757575" : "#a0a0a0", // Light gray when not editing for blur effect
      opacity: isEditing ? 1 : 0.6, // Reduce opacity for blur-like effect
      ".dark &": { color: "#e5e7eb" } // Full opacity in dark mode
    }
  }}
/>



            {isEditing && (
              <Button variant="contained" sx={{ mt: 2 }} onClick={() => setIsEditing(false)}>
                Save Changes
              </Button>
            )}
          </Box>
          
          )}
        </CardContent>
      </Card>

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} mb={2}>
        <Typography variant="h5" color="secondary">Admin List</Typography>
        <Button variant="contained" component={Link} to="/admin/add" color="success"> Add Admin </Button>
      </Box>

      <TableContainer component={Paper} sx={{ marginBottom: 3, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white", width: "20%", textAlign:"center" }}>Name</TableCell>
              <TableCell sx={{ color: "white", width: "40%", textAlign:"center"  }}>Email</TableCell>
              <TableCell sx={{ color: "white", width: "30%", textAlign:"center"  }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins.map((adminItem) => (
              <TableRow key={adminItem.id} hover>
                <TableCell className="dark:bg-gray-800 dark:text-gray-200" sx={{ width: "30%", textAlign:"center" }}>{adminItem.name}</TableCell>
                <TableCell className="dark:bg-gray-800 dark:text-gray-200" sx={{ width: "30%", textAlign:"center" }}>{adminItem.email}</TableCell>
                <TableCell className="dark:bg-gray-800 dark:text-gray-200" sx={{ width: "30%", textAlign:"center" }}>
                  <IconButton color="error" onClick={() => { setAdminToDelete(adminItem); setDeleteDialogOpen(true); }}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
  open={deleteDialogOpen}
  onClose={() => setDeleteDialogOpen(false)}
  sx={{
    "& .MuiPaper-root": {
      backgroundColor: "var(--dialog-bg) !important", 
      color: "var(--dialog-text) !important",
    },
  }}
>
  <DialogTitle>Confirm Deletion</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Are you sure you want to delete <strong>{adminToDelete?.name}</strong>?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
    <Button onClick={handleDeleteAdmin} color="error">Delete</Button>
  </DialogActions>
</Dialog>




      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="success">{snackbarMessage}</Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage;
