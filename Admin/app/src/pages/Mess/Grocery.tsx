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
  TablePagination,
  DialogTitle,
  TableRow,
  IconButton,
  InputAdornment,
} from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Autocomplete from '@mui/material/Autocomplete';
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ConsumedProvisionsImage from "../../assets/consumed_provisions.png";
import VegetableImage from "../../assets/vegetable.png";
import EggImage from "../../assets/egg.png";
import MilkImage from "../../assets/milk.png";
import GasImage from "../../assets/gas.png";
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
  no_of_cylinder: number;
  dailyconsumption: JSON;
}

const categoryData = [
  { label: "Provisions", image: ConsumedProvisionsImage, color: "#A07444" },
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
  itemname?: string;
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
  no_of_cylinder?: number;
  entry_date?: Date;
  selectedDate?: Date;
  dailyconsumption?: JSON;
  today_quantity?: number;
}

const Groceries = () => {
  const { hostel } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("Provisions");
  const [groceriesData, setGroceriesData] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [availableItems, setAvailableItems] = useState<PurchasedItem[]>([]);
  const [maxQty, setMaxQty] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [today_quantity, setToday_quantity] = useState(0);

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
      "Provisions": "consumedgrocery",
      "Vegetables": "vegetables",
      "Egg": "egg",
      "Milk": "milk",
      "Gas": "gas",
    };

    const categoryId = {
      "Provisions": 'id',
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
    setSelectedDate(new Date().toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (groceriesData.length > 0) {
      setToday_quantity(Number(groceriesData[0].dailyconsumption[selectedDate]));
    }
  }, [groceriesData, selectedDate]);


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
      case 'Provisions':
        return ['S.No', 'Item Name', 'Billing Year-Month', 'Unit',`Issued units on ${selectedDate}`, 'Total Quantity Issued', 'Total Amount Issued',"Quantity Entered?", 'Action'];
      case 'Vegetables':
        return ['S.No', 'Bill Date', 'Name', 'Quantity', 'Cost Per Kg', 'Total Amount', 'Action'];
      case 'Egg':
        return ['S.No', 'Bill Date', 'Quantity', 'Rate Per Piece', 'Total Amount', 'Action'];
      case 'Milk':
        return ['S.No', 'Bill Date', 'Quantity', 'Rate Per Litre', 'Total Amount', 'Action'];
      case 'Gas':
        return ['S.No', 'Bill Date', 'No Of Cylinders', 'Total Amount', 'Action'];
      default:
        return [];
    }
  };

  const getDialogFields = () => {
    switch (selectedCategory) {
      case 'Provisions':
        return [
          { label: "Billing Month", name: "monthyear" },
          { label: "Item Name", name: "itemname" },
          { label: "Entry Date", name: "selectedDate", type: "date" },
          { label: "Add Issued Units", name: "today_quantity", type: "number" },
        ];

      case 'Vegetables':
        return [
          { label: "Bill Date", name: "DateOfConsumed", type: "date" },
          { label: "Name", name: "itemName" },
          { label: "Quantity", name: "Quantity", type: "number" },
          { label: "Rate Per Kg", name: "CostPerKg", type: "number" },
        ];
      case 'Egg':
        return [
          { label: "Bill Date", name: "DateOfConsumed", type: "date" },
          { label: "Quantity", name: "Quantity", type: "number" },
          { label: "Rate Per Piece", name: "CostPerPiece", type: "number" },
        ];
      case 'Milk':
        return [
          { label: "Bill Date", name: "DateOfConsumed", type: "date" },
          { label: "Quantity", name: "Quantity", type: "number" },
          { label: "Amount Per Litre", name: "CostPerLitre", type: "number" },
        ];
      case 'Gas':
        return [
          { label: "Bill Date", name: "DateOfConsumed", type: "date" },
          { label: "No. Of Cylinders", name: "no_of_cylinder", type: "number" },
          { label: "Total Amount", name: "TotalAmount", type: "number" },
        ];
      default:
        return [];
    }
  };


  const handleDialogOpen = (data: any = null) => {
    setIsEditing(!!data);
    setFormData(data || {});
    setOpenDialog(true);

    // Set editId dynamically based on provisionType
    if (data) {
        switch (selectedCategory) {
            case 'Provisions':
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
    setMaxQty(selectedItem?.total_stock_available || 0);
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


  const handleSubmit = async () => {
    try {
      const { itemname, itemName, DateOfConsumed, today_quantity ,ConsumedQnty = 0, Quantity, CostPerKg, CostPerPiece, CostPerLitre,no_of_cylinder, TotalAmount } = formData;

      let response;

      if (isEditing) {
        // Editing logic
        switch (selectedCategory) {
          case 'Provisions':
            const formattedDate = new Date().toISOString().split("T")[0];

            // Fetch existing consumedgrocery entry
            const { data: existingEntry, error: fetchError } = await supabase
                .from('consumedgrocery')
                .select('dailyconsumption, total_quantity_issued, itemname')
                .eq('id', editId)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') {
                throw fetchError;
            }

            let updatedDailyConsumption = existingEntry?.dailyconsumption
                ? typeof existingEntry.dailyconsumption === 'string'
                    ? JSON.parse(existingEntry.dailyconsumption)
                    : existingEntry.dailyconsumption
                : {};

            updatedDailyConsumption[selectedDate] = String(today_quantity);

            const totalQuantityIssued = Object.values(updatedDailyConsumption)
                .map(qty => Number(qty))
                .reduce((sum, qty) => sum + qty, 0);

            const { data: inventoryData, error: inventoryError } = await supabase
                .from('inventorygrocery')
                .select('opening_stock_remaining, supplier1_rate, quantity_supplier2_remaining, supplier2_rate, quantity_intend1_remaining, rate_intend_1, quantity_intend2_remaining, rate_intend_2, quantity_intend3_remaining, rate_intend_3, opening_stock, quantity_received_supplier2, quantity_received_intend_1, quantity_received_intend_2, quantity_received_intend_3')
                .eq('itemname', existingEntry?.itemname)
                .single();

            if (inventoryError) throw inventoryError;

            let usedQty = totalQuantityIssued;
            let updatedInventory = { ...inventoryData };
            let totalCost = 0;

            // Function to track stock usage and calculate cost
            const trackUsage = (usedKey, stockKey, rateKey) => {
                if (usedQty > 0 && updatedInventory[usedKey] < updatedInventory[stockKey]) {
                    const usableQty = Math.min(usedQty, updatedInventory[stockKey] - updatedInventory[usedKey]);
                    updatedInventory[usedKey] += usableQty;
                    usedQty -= usableQty;
                    totalCost += usableQty * inventoryData[rateKey];
                }
            };

            // Track usage in priority order
            trackUsage('opening_stock_remaining', 'opening_stock', 'supplier1_rate');
            trackUsage('quantity_supplier2_remaining', 'quantity_supplier2_remaining', 'supplier2_rate');
            trackUsage('quantity_intend1_remaining', 'quantity_intend1_remaining', 'rate_intend_1');
            trackUsage('quantity_intend2_remaining', 'quantity_intend2_remaining', 'rate_intend_2');
            trackUsage('quantity_intend3_remaining', 'quantity_intend3_remaining', 'rate_intend_3');

            // Update consumedgrocery with the total quantity issued and cost
            response = await supabase
                .from('consumedgrocery')
                .update({
                    dailyconsumption: updatedDailyConsumption,
                    total_quantity_issued: totalQuantityIssued,
                    total_cost: totalCost
                })
                .eq('id', editId);

            if (response.error) throw response.error;

            // Update inventorygrocery with the tracked usage
            const updateInventoryResponse = await supabase
                .from('inventorygrocery')
                .update({
                    opening_stock_remaining: updatedInventory.opening_stock_remaining,
                    quantity_supplier2_remaining: updatedInventory.quantity_supplier2_remaining,
                    quantity_intend1_remaining: updatedInventory.quantity_intend1_remaining,
                    quantity_intend2_remaining: updatedInventory.quantity_intend2_remaining,
                    quantity_intend3_remaining: updatedInventory.quantity_intend3_remaining
                })
                .eq('itemname', existingEntry?.itemname);

            if (updateInventoryResponse.error) throw updateInventoryResponse.error;

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
                no_of_cylinder,
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
          case 'Provisions':
            // First, fetch the required data
            const { data: purchasedData, error: purchasedError } = await supabase
              .from('purchasedprovisions')
              .select('purchaseid, PurchasedCostPerKg, RemainingQty')
              .eq('itemname', itemname)
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
                  itemname,
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
      <div className="text-tertiary font-medium mb-4">
        <div className="text-sm mb-4">
          <Link to={`/manage-mess/${hostel === 'Boys' ? 'Boys' : 'Girls'}`}>{hostel === 'Boys' ? 'Boys' : 'Girls'} Hostel</Link> &gt; Groceries
        </div>
      </div>

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
      {selectedCategory === "Provisions" && (
          <TextField
            type="date"
            label="Select Date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              width: "180px",
              backgroundColor: "white",
              borderRadius: "10px",
            }}
            InputLabelProps={{ shrink: true }}
          />
        )}
        {selectedCategory !== "Provisions" && (
        <Button
        variant="contained"
        color="primary"
      >
        Filter By
      </Button>
      )}
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
        <Box sx={{ maxHeight: "70vh",maxWidth: "min(100vw, 1160px)", overflowX: "auto" }}>

        <TableContainer
        sx={{
          maxHeight: "55vh",
          overflow: "auto",
          backgroundColor: 'white',
          border: "1px solid #E0E0E0",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",

          overflowX: "auto",
        }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: categoryData.find((cat) => cat.label === selectedCategory)?.color || "#F5F5F5", position: "sticky", top: 0, zIndex: 1, whiteSpace: "nowrap"  }}>
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

              {selectedCategory === 'Provisions' && (
                <>
                  <TableCell align="center">{row.itemname}</TableCell>
                  <TableCell align="center">{row.monthyear}</TableCell>
                  <TableCell align="center">{row.unit}</TableCell>
                  <TableCell align="center">
                    {row?.dailyconsumption
                      ? (typeof row.dailyconsumption === "string"
                          ? JSON.parse(row.dailyconsumption)[selectedDate] ?? "0"
                          : row.dailyconsumption[selectedDate] ?? "0")
                      : "0"}
                  </TableCell>
                  <TableCell align="center">{row.total_quantity_issued}</TableCell>
                  <TableCell align="center">{row.total_cost}</TableCell>
                  <TableCell align="center">
                    {row?.dailyconsumption && row?.dailyconsumption[selectedDate] !== undefined
                      ? (row.dailyconsumption[selectedDate] === 0
                          ? <CancelIcon color="error" />
                          : <CheckCircleIcon color="success" />)
                      : <CancelIcon color="error" />}
                  </TableCell>


                </>
              )}
              {selectedCategory === 'Vegetables' && (
                <>
                  <TableCell align="center">{row.DateOfConsumed}</TableCell>
                  <TableCell align="center">{row.itemName}</TableCell>
                  <TableCell align="center">{row.Quantity}</TableCell>
                  <TableCell align="center">{row.CostPerKg}</TableCell>
                  <TableCell align="center">{row.TotalCost}</TableCell>
                </>
              )}
              {selectedCategory === 'Egg' && (
                <>
                  <TableCell align="center">{row.DateOfConsumed}</TableCell>
                  <TableCell align="center">{row.Quantity}</TableCell>
                  <TableCell align="center">{row.CostPerPiece}</TableCell>
                  <TableCell align="center">{row.TotalCost}</TableCell>
                </>
              )}
              {selectedCategory === 'Milk' && (
                <>
                  <TableCell align="center">{row.DateOfConsumed}</TableCell>
                  <TableCell align="center">{row.Quantity}</TableCell>
                  <TableCell align="center">{row.CostPerLitre}</TableCell>
                  <TableCell align="center">{row.TotalCost}</TableCell>
                </>
              )}
              {selectedCategory === 'Gas' && (
                <>
                  <TableCell align="center">{row.DateOfConsumed}</TableCell>
                  <TableCell align="center">{row.no_of_cylinder}</TableCell>
                  <TableCell align="center">{row.TotalAmount}</TableCell>
                </>
              )}

                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleDialogOpen(row)}>
                      <EditIcon />
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


        </Box>
      </>
      )}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{isEditing ? "Edit Item" : "Add Item"}</DialogTitle>
        <DialogContent>
          {getDialogFields().map((field, index) => (
            field.name === "itemname" && field.label === "Item Name" ? (
              <Autocomplete
                key={index}
                options={availableItems.map(item => item.itemname)}
                value={formData.itemname || ""}
                onChange={(event, newValue) => {
                  handleInputChange({
                    target: {
                      name: "itemname",
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
                value={
                  field.name === "selectedDate"
                    ? selectedDate // Set value to selectedDate
                    : field.type === "date"
                    ? formData[field.name] || new Date().toISOString().split("T")[0]
                    : formData[field.name] || ""
                }
                onChange={handleInputChange}
                margin="dense"
                InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
                disabled={field.name === "selectedDate" || field.name === "monthyear"}
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

    </div>
  );
};

export default Groceries;
