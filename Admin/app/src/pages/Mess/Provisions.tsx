import React, { useState, useEffect, useCallback } from 'react';
import ArrowBack from "@mui/icons-material/ArrowBack";
import  supabase  from "../../supabaseClient";
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

import { theme } from "../../constants/theme";

interface GroceryItem {
  itemName: string;
  PurchasedTotalCost: number;
  RemainingQty: number;
  DateOfPurchased: string;
  PurchasedQnty: number;
  purchaseid: number;
}

type FormData = {
  itemName: string;
  PurchasedQnty: number;
  PurchasedCostPerKg: number;
  RemainingQty: number;
  DateOfPurchased: string;
};

const Provisions = () => {
  const [groceriesData, setGroceriesData] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    itemName: "",
    PurchasedQnty: 0,
    PurchasedCostPerKg: 0,
    RemainingQty: 0,
    DateOfPurchased: "",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null); // Track the item to be deleted

  // Fetch groceries data from Supabase
  const fetchGroceriesData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("purchasedprovisions")
        .select("*");

      if (error) throw error;

      setGroceriesData(data as GroceryItem[]);
    } catch (error: any) {
      console.error("Error fetching groceries data:", error.message);
      setError("Error fetching groceries data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroceriesData();
  }, [fetchGroceriesData]);

  const getDialogFields = [
    { label: "Item Name", name: "itemName" },
    { label: "Purchased Quantity", name: "PurchasedQnty", type: "number" },
    { label: "Cost Per Kg/Lit", name: "PurchasedCostPerKg", type: "number" },
    { label: "Date of Purchased", name: "DateOfPurchased", type: "date" },
  ];



  const handleDialogOpen = (data: any = null) => {
    setIsEditing(!!data);
    if(isEditing) {
    setEditId(data.purchaseid || {});

    }    setFormData(data || {});
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setFormData({
      itemName: "",
      PurchasedQnty: 0,
      PurchasedCostPerKg: 0,
      RemainingQty: 0,
      DateOfPurchased: "",
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
    if (deleteItemId) {
      try {
        const { error } = await supabase
          .from('purchasedprovisions')
          .delete()
          .eq('purchaseid', deleteItemId);

        if (error) {
          throw error;
        }

        setOpen(false);
        fetchGroceriesData();
        console.log('Item deleted successfully!');
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleSubmit = async () => {
    try {


      if (isEditing) {
        // Fetch the current record to calculate the change in quantity
        const { data: currentData, error: fetchError } = await supabase
          .from('purchasedprovisions')
          .select('PurchasedQnty, RemainingQty')
          .eq('purchaseid', editId)
          .single();
        if (fetchError) {
          throw fetchError;
        }

        const changeInQnty = formData.PurchasedQnty - currentData.PurchasedQnty;

        const { error } = await supabase
          .from('purchasedprovisions')
          .update({
            itemName: formData.itemName,
            PurchasedQnty: formData.PurchasedQnty,
            PurchasedCostPerKg: formData.PurchasedCostPerKg,
            DateOfPurchased: formData.DateOfPurchased,
            RemainingQty: currentData.RemainingQty + changeInQnty,
          })
          .eq('purchaseid', editId);

        if (error) {
          throw error;
        }

        console.log('Item updated successfully!');
      } else {
        // If not editing, insert a new item
        const { error } = await supabase
          .from('purchasedprovisions')
          .insert([
            {
              itemName: formData.itemName,
              PurchasedQnty: formData.PurchasedQnty,
              PurchasedCostPerKg: formData.PurchasedCostPerKg,
              RemainingQty: formData.PurchasedQnty,
              DateOfPurchased: formData.DateOfPurchased,
            }
          ]);

        if (error) {
          throw error;
        }

        console.log('New item added successfully!');
      }

      fetchGroceriesData();

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

  // Handle pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Paginate data
  const paginatedData = groceriesData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="max-h-screen bg-pageBg p-1 -mt-10 max-w-screen">
      <div className="flex items-center mb-4">
        <ArrowBack className="text-primary cursor-pointer" />
        <span className="ml-2 text-primary text-xl font-bold"> Purchased Provisions </span>
      </div>
      <p className="text-tertiary font-medium mb-4">Manage mess / Provisions</p>

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
          Add Item
        </Button>
      </div>

      {error && <div className="text-red-600">{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <TableContainer
            sx={{
              height: "420px",
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
                  {["S.No", "Item Name", "Purchased Quantity", "Purchased Total Cost", "Remaining Quantity", "Date of Purchased", "Action"].map(
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
                  <TableRow key={row.purchaseid} sx={{ backgroundColor: 'white' }}>
                    <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell align="center">{row.itemName}</TableCell>
                    <TableCell align="center">{row.PurchasedQnty}</TableCell>
                    <TableCell align="center">{row.PurchasedTotalCost}</TableCell>
                    <TableCell align="center">{row.RemainingQty}</TableCell>
                    <TableCell align="center">{formatDate(row.DateOfPurchased)}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleDialogOpen(row)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => { setDeleteItemId(row.purchaseid); setOpen(true); }}>
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
            count={groceriesData.length}
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

export default Provisions;
