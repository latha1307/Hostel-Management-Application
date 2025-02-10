import React, { useEffect, useState, useCallback } from "react";
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
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ConsumedProvisionsImage from "../../assets/consumed_provisions.png";
import VegetableImage from "../../assets/vegetable.png";
import EggImage from "../../assets/egg.png";
import MilkImage from "../../assets/milk.png";
import GasImage from "../../assets/gas.png";
import { theme } from "../../constants/theme";
import  supabase  from "../../supabaseClient";
import { useParams } from 'react-router-dom';

interface GroceryItem {
  itemname: string;
  unit: string;
  monthyear: string;
  total_quantity_issued: number;
  cost_per_quantity: number;
  total_cost: number;
  today_quantity: number;
  itemName: string;
  ConsumedQnty: number;
  ConsumedCost: number;
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
  itemname: string;
  total_stock_available: number;
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
    const categoryMap = {
      "Consumed Provisions": "consumedgrocery",
      "Vegetables": "vegetables",
      "Egg": "egg",
      "Milk": "milk",
      "Gas": "gas",
    };

    const categoryId = {
      "Consumed Provisions": 'id',
      "Vegetables": 'vegetableid',
      "Egg": 'id',
      "Milk": 'id',
      "Gas": 'id',
    };

    const selectedCategory = categoryMap[category];
    const selectedID = categoryId[category];

    if (!selectedCategory) {
      setError('Invalid category selected');
      setLoading(false);
      return;
    }

    try {
      console.log(selectedCategory)
      const { data, error } = await supabase
        .from(selectedCategory)
        .select('*')
        .eq('hostel', hostel)
        .order(selectedID, { ascending: true });

      if (error) throw error;
      setGroceriesData(data);
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
        const { data, error } = await supabase
          .from('inventorygrocery')
          .select('itemname, total_stock_available');

        if (error) {
          throw error;
        }

        setAvailableItems(data);
        console.log('Fetched items:', data);
      } catch (error) {
        console.error('Error fetching items:', error.message);
      }
    };

    fetchPurchasedItems();
  }, []);

  const getTableHeaders = () => {
    switch (selectedCategory) {
      case 'Consumed Provisions':
        return ['S.No', 'Item Name', 'Month Year', 'Unit', 'Total Quantity Issued', 'Total Consumed Cost',"Today's Quantity Entered?", 'Action'];
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
          { label: "Item Name", name: "itemname" },
          { label: "Add Today's Consumed Units", name: "total_quantity_issued", type: "number" },
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
              setDeleteId(data?.id || null);
              break;
          case 'Vegetables':
            setDeleteId(data?.vegetableid || null);
              break;
          case 'Egg':
            setDeleteId(data?.id || null);
              break;
          case 'Milk':
            setDeleteId(data?.id || null);
              break;
          case 'Gas':
            setDeleteId(data?.id || null);
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
                setEditId(data?.id || null);
                break;
            case 'Vegetables':
                setEditId(data?.vegetableid || null);
                break;
            case 'Egg':
                setEditId(data?.id || null);
                break;
            case 'Milk':
                setEditId(data?.id || null);
                break;
            case 'Gas':
                setEditId(data?.id || null);
                break;
            default:
                setEditId(null);
        }
    } else {
        setEditId(null);
    }

    // Set maxQty for the selected item
    const selectedItem = availableItems.find(
        item => item.itemname === (data?.itemName || formData?.itemName)
    );
    setMaxQty(selectedItem?.total_stock_available || 0);  // Set maxQty for the selected item
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

    if (name === "itemname") {
      const selectedItem = availableItems.find((item) => item.itemname === value);
      setMaxQty(selectedItem?.total_stock_available || 0);
    }
  };

  const handleDelete = async () => {
    try {
      let response;

      switch (selectedCategory) {
        case 'Consumed Provisions':
            // Fetch the purchase ID and consumed quantity before deleting
            const { data: existingData, error: fetchError } = await supabase
              .from('consumedprovisions')
              .select('purchaseid, ConsumedQnty')
              .eq('ConsumedID', deleteId)
              .single();

            if (fetchError) throw fetchError;

            const { purchaseid, ConsumedQnty } = existingData;

            // Fetch the current RemainingQty from purchasedprovisions
            const { data: purchasedData, error: fetchPurchasedError } = await supabase
              .from('purchasedprovisions')
              .select('RemainingQty')
              .eq('purchaseid', purchaseid)
              .single();

            if (fetchPurchasedError) throw fetchPurchasedError;

            const updatedQty = purchasedData.RemainingQty + ConsumedQnty;

            // Update the remaining quantity in purchasedprovisions
            const updateResponse = await supabase
              .from('purchasedprovisions')
              .update({ RemainingQty: updatedQty })
              .eq('purchaseid', purchaseid);

            if (updateResponse.error) throw updateResponse.error;

            // Delete the record from consumedprovisions
            const deleteResponse = await supabase
              .from('consumedprovisions')
              .delete()
              .eq('ConsumedID', deleteId);

            if (deleteResponse.error) throw deleteResponse.error;
            break;


        case 'Vegetables':
          response = await supabase
            .from('vegetables')
            .delete()
            .eq('vegetableid', deleteId);
          if (response.error) throw response.error;
          break;

        case 'Egg':
          response = await supabase
            .from('egg')
            .delete()
            .eq('id', deleteId);
          if (response.error) throw response.error;
          break;

        case 'Milk':
          response = await supabase
            .from('milk')
            .delete()
            .eq('id', deleteId);
          if (response.error) throw response.error;
          break;

        case 'Gas':
          response = await supabase
            .from('gas')
            .delete()
            .eq('id', deleteId);
          if (response.error) throw response.error;
          break;

        default:
          throw new Error('Invalid category');
      }

      fetchGroceriesData(selectedCategory); // Refresh data after deletion
      setOpen(false); // Close the dialog
    } catch (error) {
      console.error('Error deleting item:', error.message);
    }
  };

  const handleSubmit = async () => {
    try {
      const { itemName, DateOfConsumed, ConsumedQnty = 0, Quantity, CostPerKg, CostPerPiece, CostPerLitre, TotalAmount } = formData;

      let response;

      if (isEditing) {
        // Editing logic
        switch (selectedCategory) {
          case 'Consumed Provisions':
             // Step 1: Fetch the existing record from `consumedprovisions` to get `purchaseid`, `ConsumedQnty`, and `RemainingQty`
             const { data: existingData, error: fetchError } = await supabase
               .from('consumedprovisions')
               .select('purchaseid, ConsumedQnty, RemainingQty')
               .eq('ConsumedID', editId)
               .single();

             if (fetchError) throw fetchError;

             const { purchaseid, ConsumedQnty: previousQty, RemainingQty: previousRemaining } = existingData;

             // Step 2: Fetch `PurchasedCostPerKg` from `purchasedprovisions` using `purchaseid`
             const { data: purchasedData, error: purchasedError } = await supabase
               .from('purchasedprovisions')
               .select('PurchasedCostPerKg, RemainingQty')
               .eq('purchaseid', purchaseid)
               .single();

             if (purchasedError) throw purchasedError;

             const { PurchasedCostPerKg, RemainingQty: purchasedRemainingQty } = purchasedData;

             // Step 3: Calculate new values
             const changeInQnty = ConsumedQnty - previousQty;
             const updatedRemainingQty = previousRemaining - changeInQnty;
             const ConsumedCost = ConsumedQnty * PurchasedCostPerKg;

             // Step 4: Update `consumedprovisions` table
             response = await supabase
               .from('consumedprovisions')
               .update({
                 ConsumedQnty,
                 ConsumedCost,
                 RemainingQty: updatedRemainingQty,
                 DateOfConsumed,
               })
               .eq('ConsumedID', editId);

             if (response.error) throw response.error;

             // Step 5: Update `purchasedprovisions` table with the correct `RemainingQty`
             const updateResponse = await supabase
               .from('purchasedprovisions')
               .update({ RemainingQty: purchasedRemainingQty - changeInQnty })
               .eq('purchaseid', purchaseid);

             if (updateResponse.error) throw updateResponse.error;

             break;


          case 'Vegetables':
            response = await supabase
              .from('vegetables')
              .update({
                Quantity,
                CostPerKg,
                DateOfConsumed,
              })
              .eq('vegetableid', editId);

            if (response.error) throw response.error;
            break;

          case 'Egg':
            response = await supabase
              .from('egg')
              .update({
                Quantity,
                CostPerPiece,
                DateOfConsumed,
              })
              .eq('id', editId);

            if (response.error) throw response.error;
            break;

          case 'Milk':
            response = await supabase
              .from('milk')
              .update({
                Quantity,
                CostPerLitre,
                DateOfConsumed,
              })
              .eq('id', editId);

            if (response.error) throw response.error;
            break;

          case 'Gas':
            response = await supabase
              .from('gas')
              .update({
                TotalAmount,
                DateOfConsumed,
              })
              .eq('id', editId);

            if (response.error) throw response.error;
            break;

          default:
            throw new Error('Invalid category');
        }
      } else {
        // Insert logic (already implemented in your code)
        switch (selectedCategory) {
          case 'Consumed Provisions':
            // First, fetch the required data
            const { data: purchasedData, error: purchasedError } = await supabase
              .from('purchasedprovisions')
              .select('purchaseid, PurchasedCostPerKg, RemainingQty')
              .eq('itemName', itemName)
              .limit(1);

            if (purchasedError) throw purchasedError;

            if (!purchasedData || purchasedData.length === 0) {
              throw new Error('Item not found in PurchasedProvisions');
            }

            const { purchaseid, PurchasedCostPerKg, RemainingQty } = purchasedData[0];
            const ConsumedCost = PurchasedCostPerKg * ConsumedQnty;
            const updatedRemainingQty = RemainingQty - ConsumedQnty;

            // Insert into ConsumedProvisions
            response = await supabase
              .from('consumedprovisions')
              .insert([
                {
                  hostel,
                  itemName,
                  purchaseid,
                  ConsumedQnty,
                  ConsumedCost,
                  RemainingQty: updatedRemainingQty,
                  DateOfConsumed,
                },
              ]);

            if (response.error) throw response.error;

            // Update PurchasedProvisions table
            const updateResponse = await supabase
              .from('purchasedprovisions')
              .update({ RemainingQty: updatedRemainingQty })
              .eq('purchaseid', purchaseid);

            if (updateResponse.error) throw updateResponse.error;
            break;

          case 'Vegetables':
            response = await supabase
              .from('vegetables')
              .insert([
                {
                  hostel,
                  itemName,
                  Quantity,
                  CostPerKg,
                  DateOfConsumed,
                },
              ]);

            if (response.error) throw response.error;
            break;

          case 'Egg':
            response = await supabase
              .from('egg')
              .insert([
                {
                  hostel,
                  Quantity,
                  CostPerPiece,
                  DateOfConsumed,
                },
              ]);

            if (response.error) throw response.error;
            break;

          case 'Milk':
            response = await supabase
              .from('milk')
              .insert([
                {
                  hostel,
                  Quantity,
                  CostPerLitre,
                  DateOfConsumed,
                },
              ]);

            if (response.error) throw response.error;
            break;

          case 'Gas':
            response = await supabase
              .from('gas')
              .insert([
                {
                  hostel,
                  TotalAmount,
                  DateOfConsumed,
                },
              ]);

            if (response.error) throw response.error;
            break;

          default:
            throw new Error('Invalid category');
        }
      }

      fetchGroceriesData(selectedCategory); // Fetch updated data
      handleDialogClose(); // Close dialog

    } catch (error) {
      console.error('Error submitting data:', error);
    }
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
          maxHeight: '70vh',
          overflow: "auto",
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
                <TableRow key={row.id} sx={{ border: "1px solid #E0E0E0", backgroundColor: "white",flexGrow: 1  }}>
                  <TableCell align="center">{index + 1 + page * rowsPerPage}</TableCell>

              {selectedCategory === 'Consumed Provisions' && (
                <>
                  <TableCell align="center">{row.itemname}</TableCell>
                  <TableCell align="center">{row.monthyear}</TableCell>
                  <TableCell align="center">{row.unit}</TableCell>
                  <TableCell align="center">{row.total_quantity_issued}</TableCell>
                  <TableCell align="center">{row.total_cost}</TableCell>
                  <TableCell align="center">
                    {(row.today_quantity === null || row.today_quantity === 0) ? <CancelIcon color="error" /> : <CheckCircleIcon color="success" />}
                  </TableCell>

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
        rowsPerPageOptions={[10, 25, 50]}
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
        options={availableItems.map(item => item.itemname)}
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
