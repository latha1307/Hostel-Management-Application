import React, { useEffect, useState, useCallback } from "react";
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
import ArrowBack from "@mui/icons-material/ArrowBack";
import Autocomplete from '@mui/material/Autocomplete';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

import ConsumedProvisionsImage from "../../assets/consumed_provisions.png";
import VegetableImage from "../../assets/vegetable.png";
import EggImage from "../../assets/egg.png";
import MilkImage from "../../assets/milk.png";
import GasImage from "../../assets/gas.png";
import { theme } from "../../constants/theme";
import { useParams } from 'react-router-dom';

interface GroceryItem {
  itemName: string;
  ConsumedQnty: number;
  ConsumedCostTotal: number;
  RemainingQty: number;
  DateOfConsumed: string;
  CostPerPiece: number;
  CostPerKg: number;
  CostPerLitre: number;
  TotalCost: number;
  TotalAmount: number;
  id: number;
  Quantity: number;
}

const categoryData = [
  { label: "Consumed Provisions", image: ConsumedProvisionsImage, color: "#A07444" },
  { label: "Vegetables", image: VegetableImage, color: "#43A047" },
  { label: "Egg", image: EggImage, color: "#F9A825" },
  { label: "Milk", image: MilkImage, color: "#03A9F4" },
  { label: "Gas", image: GasImage, color: "#D32F2F" },
];

interface PurchasedItem {
  ItemName: string;
  RemainingQty: number;
}

interface FormData {
  itemName?: string;
  ConsumedQnty?: number;
  ConsumedCostTotal?: number;
  RemainingQty?: number;
  DateOfConsumed?: string;
  Quantity?: number;
  CostPerKg?: number;
  TotalCost?: number;
  CostPerPiece?: number;
  CostPerLitre?: number;
  TotalAmount?: number;
}

const Groceries = () => {
  const { hostel } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("Consumed Provisions");
  const [groceriesData, setGroceriesData] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [availableItems, setAvailableItems] = useState<PurchasedItem[]>([]);
  const [maxQty, setMaxQty] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  const paginatedData = groceriesData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const fetchGroceriesData = useCallback(async (category) => {
    setLoading(true);
    setError(null);
    const hostelType = hostel === 'Boys' ? 'boys' : 'girls';
    try {
      const response = await axios.get(`http://localhost:8081/api/mess/grocery/consumed/${hostelType}/${category}`);
      setGroceriesData(response.data);
    } catch (error) {
      console.error("Error fetching groceries data:", error);
      setError("Error fetching groceries data");
    } finally {
      setLoading(false);
    }
  }, [hostel]);

  useEffect(() => {
    fetchGroceriesData(selectedCategory);
  }, [selectedCategory, hostel, fetchGroceriesData]);



  useEffect(() => {
    const fetchPurchasedItems = async () => {
      try {
        const response = await axios.get('http://localhost:8081/api/mess/grocery/purchased/item-name');
        setAvailableItems(response.data);
        console.log(response.data)
        console.log('Fetched items:', response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchPurchasedItems();
  }, []);

  const getTableHeaders = () => {
    switch (selectedCategory) {
      case 'Consumed Provisions':
        return ['S.No', 'Item Name', 'Consumed Quantity', 'Consumed Cost', 'Remaining Quantity', 'Date of Consumed', 'Action'];
      case 'Vegetables':
        return ['S.No', 'Name', 'Quantity', 'Cost Per Kg', 'Total Cost', 'Date of Consumed', 'Action'];
      case 'Egg':
        return ['S.No', 'Quantity', 'Cost Per Piece', 'Total Cost', 'Date of Consumed', 'Action'];
      case 'Milk':
        return ['S.No', 'Quantity', 'Cost Per Litre', 'Total Cost', 'Date of Consumed', 'Action'];
      case 'Gas':
        return ['S.No', 'Total Amount', 'Date of Consumed', 'Action'];
      default:
        return [];
    }
  };

  const getDialogFields = () => {
    switch (selectedCategory) {
      case 'Consumed Provisions':
        return [
          { label: "Item Name", name: "itemName" },
          { label: "Consumed Quantity", name: "ConsumedQnty", type: "number" },
          { label: "Date of Consumed", name: "DateOfConsumed", type: "date" },
        ];
      case 'Vegetables':
        return [
          { label: "Name", name: "itemName" },
          { label: "Quantity", name: "Quantity", type: "number" },
          { label: "Cost Per Kg", name: "CostPerKg", type: "number" },
          { label: "Date of Consumed", name: "DateOfConsumed", type: "date" },
        ];
      case 'Egg':
        return [
          { label: "Quantity", name: "Quantity", type: "number" },
          { label: "Cost Per Piece", name: "CostPerPiece", type: "number" },
          { label: "Date of Consumed", name: "DateOfConsumed", type: "date" },
        ];
      case 'Milk':
        return [
          { label: "Quantity", name: "Quantity", type: "number" },
          { label: "Cost Per Litre", name: "CostPerLitre", type: "number" },
          { label: "Date of Consumed", name: "DateOfConsumed", type: "date" },
        ];
      case 'Gas':
        return [
          { label: "Total Amount", name: "TotalAmount", type: "number" },
          { label: "Date of Consumed", name: "DateOfConsumed", type: "date" },
        ];
      default:
        return [];
    }
  };

  const handleClickOpen = (data: any = null) => {
    setOpen(true);
    if (data) {
      switch (selectedCategory) {
          case 'Consumed Provisions':
              setDeleteId(data?.ConsumedID || null);
              break;
          case 'Vegetables':
            setDeleteId(data?.VegetableID || null);
              break;
          case 'Egg':
            setDeleteId(data?.ID || null);
              break;
          case 'Milk':
            setDeleteId(data?.ID || null);
              break;
          case 'Gas':
            setDeleteId(data?.ID || null);
              break;
          default:
            setDeleteId(null);
      }
  } else {
    setDeleteId(null);
  }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDialogOpen = (data: any = null) => {
    setIsEditing(!!data);
    setFormData(data || {});
    setOpenDialog(true);

    // Set editId dynamically based on provisionType
    if (data) {
        switch (selectedCategory) {
            case 'Consumed Provisions':
                setEditId(data?.ConsumedID || null);
                break;
            case 'Vegetables':
                setEditId(data?.VegetableID || null);
                break;
            case 'Egg':
                setEditId(data?.ID || null);
                break;
            case 'Milk':
                setEditId(data?.ID || null);
                break;
            case 'Gas':
                setEditId(data?.ID || null);
                break;
            default:
                setEditId(null);
        }
    } else {
        setEditId(null);
    }

    // Set maxQty for the selected item
    const selectedItem = availableItems.find(
        item => item.ItemName === (data?.itemName || formData?.itemName)
    );
    setMaxQty(selectedItem?.RemainingQty || 0);  // Set maxQty for the selected item
};




  const handleDialogClose = () => {
    setOpenDialog(false);
    setFormData({});
    setIsEditing(false);
    setEditId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const formattedValue = name === "CostPerLitre" ? parseFloat(value) : value;


    if (name === "CostPerLitre" && !isNaN(formattedValue)) {
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    } else if (name !== "CostPerLitre") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "itemName") {
      const selectedItem = availableItems.find((item) => item.ItemName === value);
      setMaxQty(selectedItem?.RemainingQty || 0);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8081/api/mess/grocery/consumed/${hostel}/${selectedCategory}/${deleteId}`);
      fetchGroceriesData(selectedCategory)
      setOpen(false); // Close the dialog
    } catch (error) {
      console.error('Error deleting item:', error.message);
    }
  };
  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await axios.put(`http://localhost:8081/api/mess/grocery/consumed/${hostel}/${selectedCategory}/${editId}`, formData);
      } else {
        await axios.post(`http://localhost:8081/api/mess/grocery/consumed/${hostel}/${selectedCategory}`, formData);
      }
      fetchGroceriesData(selectedCategory)
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

  return (
    <div className="max-h-screen max-w-screen bg-pageBg p-1 -mt-16">
      {/* Header */}
      <div className="flex items-center mb-2">
        <Link to={`/manage-mess/${hostel === 'Boys' ? 'Boys' : 'Girls'}`}><ArrowBack className="text-primary cursor-pointer" /></Link>
        <span className="ml-2 text-primary text-xl font-bold">Groceries</span>
      </div>
      <p className="text-tertiary font-medium mb-4">
        <div className="text-sm mb-4">
          <Link to={`/manage-mess/${hostel === 'Boys' ? 'Boys' : 'Girls'}`}>{hostel === 'Boys' ? 'Boys' : 'Girls'} Hostel</Link> &gt; Groceries
        </div>
      </p>

      {/* Category Buttons */}
      <div className="flex flex-nowrap justify-between gap-4 mb-2">
        {categoryData.map((category, index) => (
          <div
            key={index}
            onClick={() => setSelectedCategory(category.label)} // Update selected category
            className="flex items-center justify-between bg-blue-500 text-white px-4 py-3 rounded-sm cursor-pointer hover:scale-105 transition-transform"
            style={{ backgroundColor: category.color, width: "20%", height: "60px" }}
          >
            <span className="font-bold text-sm">{category.label}</span>
            <img src={category.image} alt={category.label} className="w-10 h-10 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Table Title */}
      <div className="flex items-center justify-center mb-1">
        <span className="ml-2 text-primary text-xl font-bold">{selectedCategory}</span>
      </div>

      {/* Search and Filter Section */}
      <div className="flex justify-between">
      <Box display="flex" alignItems="center" mb={1} gap={2}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search"
          sx={{
            width: "60%",
            backgroundColor: "white",
            borderRadius: "20px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px", // Ensure border radius is applied to the input
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

      {/* Loading state */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>

        <TableContainer
        sx={{
          height: "346px", // Set fixed height
          overflow: "auto", // Enable scrolling
          border: "1px solid #E0E0E0",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          backgroundColor: 'white'
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: categoryData.find((cat) => cat.label === selectedCategory)?.color || "#F5F5F5", position: "sticky", top: 0, zIndex: 1 }}>
              {getTableHeaders().map((header, index) => (
              <TableCell key={index} align="center" sx={{ fontWeight: "bold", color: 'white' }}>
                {header}
              </TableCell>
            ))}
              </TableRow>
            </TableHead>
            <TableBody >
              {paginatedData.map((row, index) => (
                <TableRow key={row.id} sx={{ border: "1px solid #E0E0E0", backgroundColor: "white" }}>
                  <TableCell align="center">{index + 1 + page * rowsPerPage}</TableCell>

              {selectedCategory === 'Consumed Provisions' && (
                <>
                  <TableCell align="center">{row.itemName}</TableCell>
                  <TableCell align="center">{row.ConsumedQnty}</TableCell>
                  <TableCell align="center">{row.ConsumedCostTotal}</TableCell>
                  <TableCell align="center">{row.RemainingQty || '-'}</TableCell>
                </>
              )}
              {selectedCategory === 'Vegetables' && (
                <>
                  <TableCell align="center">{row.itemName}</TableCell>
                  <TableCell align="center">{row.Quantity}</TableCell>
                  <TableCell align="center">{row.CostPerKg}</TableCell>
                  <TableCell align="center">{row.TotalCost}</TableCell>
                </>
              )}
              {selectedCategory === 'Egg' && (
                <>
                  <TableCell align="center">{row.Quantity}</TableCell>
                  <TableCell align="center">{row.CostPerPiece}</TableCell>
                  <TableCell align="center">{row.TotalCost}</TableCell>
                </>
              )}
              {selectedCategory === 'Milk' && (
                <>
                  <TableCell align="center">{row.Quantity}</TableCell>
                  <TableCell align="center">{row.CostPerLitre}</TableCell>
                  <TableCell align="center">{row.TotalCost}</TableCell>
                </>
              )}
              {selectedCategory === 'Gas' && (
                <TableCell align="center">{row.TotalAmount}</TableCell>
              )}
                  <TableCell align="center">{formatDate(row.DateOfConsumed)}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleDialogOpen(row)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleClickOpen(row)}>
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
        rowsPerPageOptions={[5, 10, 15]}
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
  {getDialogFields().map((field, index) => (
    field.name === "itemName" && field.label === "Item Name" ? (
      <Autocomplete
        key={index}
        options={availableItems.map(item => item.ItemName)}
        value={formData.itemName || ""}
        onChange={(event, newValue) => {
          handleInputChange({
            target: {
              name: "itemName",
              value: newValue || ""
            }
          });
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Item Name"
            fullWidth
            margin="dense"
          />
        )}
        disabled={isEditing}
      />
    ) : field.name === "ConsumedQnty" ? (
      <TextField
        key={index}
        fullWidth
        label={field.label}
        name={field.name}
        type="number"
        value={formData[field.name] || ""}
        onChange={(e) => {
          const value = parseInt(e.target.value, 10);
              if (value > maxQty) {
                alert("Consumed quantity cannot exceed remaining quantity.");
              }


          handleInputChange(e);
        }}
        margin="dense"
          inputProps={{
            max: maxQty,
          }}
          helperText={`Max: ${maxQty} kg or Lit`}
      />
    ) : (
      <TextField
        key={index}
        fullWidth
        label={field.label}
        name={field.name}
        type={field.type || "text"}
        value={field.type === "date" ? (formData[field.name] ? formData[field.name].split('T')[0] : "") : formData[field.name] || ""}
        onChange={handleInputChange}
        margin="dense"
        InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
      />
    )
  ))}
</DialogContent>

        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {isEditing ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Confirmation Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this item? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
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

export default Groceries;
