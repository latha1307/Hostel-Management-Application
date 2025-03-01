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
} from "@mui/material";
import { Edit, Save, ArrowBack, Logout, LockReset, Delete } from "@mui/icons-material";
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

  const handleResetPassword = async () => {
    if (!email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://yourdomain.com/reset-password",
    });
    setSnackbarMessage(error ? "Failed to send reset email." : "Password reset email sent successfully.");
    setSnackbarOpen(true);
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 5 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <Button variant="contained" startIcon={<ArrowBack />} component={Link} to="/">
          Back
        </Button>
        <Button variant="contained" color="error" startIcon={<Logout />} onClick={() => navigate("/login")}> Logout </Button>
      </div>

      <Card sx={{ padding: 3, borderRadius: 3, boxShadow: 5 }}>
        <CardContent>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h5" fontWeight="bold">Admin Profile</Typography>
            <div>
              <IconButton color="primary" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? <Save /> : <Edit />}
              </IconButton>
              <IconButton color="secondary" onClick={handleResetPassword}>
                <LockReset />
              </IconButton>
            </div>
          </div>

          {admin && (
            <div>
              <TextField fullWidth margin="normal" label="Name" value={admin.name} disabled={!isEditing} />
              <TextField fullWidth margin="normal" label="Email" value={admin.email} disabled />
              {isEditing && <Button variant="contained" sx={{ mt: 2 }} onClick={() => setIsEditing(false)}> Save Changes </Button>}
            </div>
          )}
        </CardContent>
      </Card>

      <Typography variant="h5" sx={{ marginTop: 4, marginBottom: 2 }}>Admin List</Typography>
      <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins.map((adminItem) => (
              <TableRow key={adminItem.id}>
                <TableCell>{adminItem.name}</TableCell>
                <TableCell>{adminItem.email}</TableCell>
                <TableCell>
                  <IconButton color="error" onClick={() => setAdminToDelete(adminItem) || setDeleteDialogOpen(true)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{adminToDelete?.name}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => setDeleteDialogOpen(false) || setAdmins(admins.filter(a => a.id !== adminToDelete?.id))} color="error"> Delete </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="info">{snackbarMessage}</Alert>
      </Snackbar>
    </Container>
  );
};

export default ProfilePage;
