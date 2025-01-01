import React, { useState, useEffect, useCallback } from 'react';
import ArrowBack from "@mui/icons-material/ArrowBack";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TablePagination,
  DialogTitle,
  TableRow,
  IconButton,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { theme } from "../../constants/theme";

interface SalaryItem {
  StaffCategory: string;
  StaffName: string;
  bank: string;
  salaryPerDay: number;
  PresentDays: number;
  SalaryAmount: number;
  DateOfIssued: string;
  SalaryID: number;
}

type FormData = {
  StaffCategory: string;
  StaffName: string;
  bank: string;
  salaryPerDay: number;
  PresentDays: number;
  DateOfIssued: string;
};

const StaffSalary = () => {
  const { hostel } = useParams();
  const category = "Staff Salary";
  const [salaryData, setSalaryData] = useState<SalaryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    StaffCategory: "",
    StaffName: "",
    bank: "",
    salaryPerDay: 0,
    PresentDays: 0,
    DateOfIssued: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  const fetchSalaryData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const hostelType = hostel === 'Boys' ? 'boys' : 'girls';
      const response = await axios.get(
        `http://localhost:8081/api/mess/grocery/consumed/${hostelType}/${category}`
      );
      setSalaryData(response.data);
      console.log(response.data)
    } catch (error: any) {
      console.error("Error fetching groceries data:", error);
      setError("Error fetching groceries data");
    } finally {
      setLoading(false);
    }
  }, [category, hostel]);

  useEffect(() => {
    fetchSalaryData();
  }, [fetchSalaryData, hostel]);

  const getDialogFields = [
    { label: "Staff Name", name: "StaffName" },
    { label: "Staff Category", name: "StaffCategory"},
    { label: "Salary Per Day", name: "salaryPerDay", type: "number" },
    { label: "No. Of Days Present", name: "PresentDays", type: "number" },
    { label: "Bank", name: "bank" },
    { label: "Date of Issued", name: "DateOfIssued", type: "date" },
  ];



  const handleDialogOpen = (data: any = null) => {
    const isEdit = !!data;
    setIsEditing(isEdit);
    setEditId(isEdit ? data.SalaryID : null);
    setFormData(data || {});
    console.log(data || {});
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setFormData({
      StaffCategory: "",
      StaffName: "",
      bank: "",
      salaryPerDay: 0,
      PresentDays: 0,
      DateOfIssued: "",
    });
    setIsEditing(false);
    setEditId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8081/api/mess/grocery/consumed/${hostel}/${category}/${deleteItemId}`);
      fetchSalaryData()
      setOpen(false);
    } catch (error) {
      console.error('Error deleting item:', error.message);
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await axios.put(`http://localhost:8081/api/mess/grocery/consumed/${hostel}/${category}/${editId}`, formData);
        console.log(formData)
      } else {
        await axios.post(`http://localhost:8081/api/mess/grocery/consumed/${hostel}/${category}`, formData);
      }

      fetchSalaryData()
      handleDialogClose();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = salaryData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="max-h-screen bg-pageBg p-1 -mt-10 max-w-screen">
      <div className="flex items-center mb-4">
        <ArrowBack className="text-primary cursor-pointer" />
        <span className="ml-2 text-primary text-xl font-bold"> Staff Salaries </span>
      </div>
      <div className="text-sm mb-4">
          <Link to={`/manage-mess/${hostel === 'Boys' ? 'Boys' : 'Girls'}`}>{hostel === 'Boys' ? 'Boys' : 'Girls'} Hostel</Link> &gt; Staff Salaries
      </div>

      <div className="flex justify-between">
        <Box display="flex" alignItems="center" mb={2} gap={2}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search"
            sx={{
              width: "60%",
              backgroundColor: "white",
              borderRadius: "20px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<FilterListIcon />}
            sx={{ backgroundColor: theme.colors.secondary }}
          >
            Filter By
          </Button>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleDialogOpen()}
          sx={{ marginBottom: 2 }}
        >
          Add Staff
        </Button>
      </div>

      {error && <div className="text-red-600">{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <TableContainer
            sx={{
              height: "400px",
              overflow: "auto",
              backgroundColor: 'white',
              border: "1px solid #E0E0E0",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#260D94", position: "sticky", top: 0, zIndex: 1 }}>
                  {["S.No", "Staff Name", "Staff Category", "Bank", "Present Days", "Salary Amount", "Date of Issued", "Action"].map(
                    (header, index) => (
                      <TableCell key={index} align="center" sx={{ fontWeight: "bold", color: "white" }}>
                        {header}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row, index) => (
                  <TableRow key={row.SalaryID} sx={{ backgroundColor: 'white' }}>
                    <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell align="center">{row.StaffName}</TableCell>
                    <TableCell align="center">{row.StaffCategory}</TableCell>
                    <TableCell align="center">{row.bank}</TableCell>
                    <TableCell align="center">{row.PresentDays}</TableCell>
                    <TableCell align="center">{row.SalaryAmount}</TableCell>
                    <TableCell align="center">{formatDate(row.DateOfIssued)}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleDialogOpen(row)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => { setDeleteItemId(row.SalaryID); setOpen(true); }}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            sx={{backgroundColor: 'white', border: '1px solid #E0E0E0'}}
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={salaryData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{isEditing ? "Edit Item" : "Add Item"}</DialogTitle>
        <DialogContent>
          {getDialogFields.map(({ label, name, type }) => (
            <TextField
              key={name}
              label={label}
              name={name}
              value={type === "date" ? (formData[name] ? formData[name].split('T')[0] : "") : formData[name] || ""}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              type={type}
              InputLabelProps={type === "date" ? { shrink: true } : undefined}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {isEditing ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StaffSalary;