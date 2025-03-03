import React, { useEffect, useState, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
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
  Collapse,
  Typography
} from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Autocomplete from '@mui/material/Autocomplete';
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import SaveIcon from "@mui/icons-material/Save";
import ConsumedProvisionsImage from "../../assets/consumed_provisions.png";
import VegetableImage from "../../assets/vegetable.png";
import EggImage from "../../assets/egg.png";
import MilkImage from "../../assets/milk.png";
import GasImage from "../../assets/gas.png";
import  supabase  from "../../supabaseClient";
import { useParams } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import RefreshIcon from '@mui/icons-material/Refresh';
import dayjs from "dayjs";
import { Snackbar, Alert } from "@mui/material";



type FormattedData =
  | { date: string; value: number }
  | { date: string; value: number; costPerKg: number; totalCost: number };


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
  dailyconsumption: Record<string, string>;
  vegetableid: number;
}

const categoryData = [
  { label: "Provisions", image: ConsumedProvisionsImage, color: "#8B5A2B", darkColor: "#6B4226" },
  { label: "Vegetables", image: VegetableImage, color: "#388E3C", darkColor: "#2E7D32" },
  { label: "Egg", image: EggImage, color: "#F57F17", darkColor: "#E65100" },
  { label: "Milk", image: MilkImage, color: "#0288D1", darkColor: "#01579B" },
  { label: "Gas", image: GasImage, color: "#C62828", darkColor: "#B71C1C" },
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
  const [editId, setEditId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [availableItems, setAvailableItems] = useState<PurchasedItem[]>([]);
  const [maxQty, setMaxQty] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [collapseOpenProvision, setcollapseOpenProvision] = useState<Record<number, boolean>>({});
  const [collapseOpenVegetable, setcollapseOpenVegetable] = useState<Record<number, boolean>>({});
  const [editMode, setEditMode] = useState<Record<number, boolean>>({});
  const [selectedRow, setSelectedRow] = useState(null);
  const [dailyConsumptionData, setDailyConsumptionData] = useState({});
  const [dailyConsumptionVegData, setDailyConsumptionVegData] = useState<Record<string, { quantity: number, costPerKg: number, totalCost: number }>>({});
  const [formattedData, setFormattedData] = useState<FormattedData[]>([]);
    const [monthYear, setMonthYear] = useState<string | null>(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState("");
const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

const theme = useTheme();
const isDarkMode = theme.palette.mode === "dark";


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
};



const fetchGroceriesData = useCallback(async (category) => {
  setLoading(true);
  setError(null);

  const categoryMap = {
      "provisions": "consumedgrocery",
      "vegetables": "vegetables",
      "egg": "egg",
      "milk": "milk",
      "gas": "gas",
  };

  const categoryIdMap = {
      "provisions": "id",
      "vegetables": "vegetableid",
      "egg": "id",
      "milk": "id",
      "gas": "id",
  };

  const categoryKey = category.trim().toLowerCase(); // Normalize category input
  const selectedCategory = categoryMap[categoryKey];
  const selectedID = categoryIdMap[categoryKey];

  if (!selectedCategory) {
      setError("Invalid category selected");
      setLoading(false);
      return;
  }

  try {
      console.log("Fetching data from:", selectedCategory);
      const { data, error } = await supabase
          .from(selectedCategory)
          .select("*")
          .eq("hostel", hostel)
          .order(selectedID, { ascending: true });

      if (error || !data) {
          throw new Error(error?.message || "No data found");
      }

      setGroceriesData(data);
  } catch (error) {
      console.error("Error fetching groceries data:", error);
      setError(error.message || "Error fetching groceries data");
  } finally {
      setLoading(false);
  }
}, [hostel, setGroceriesData, setLoading, setError]);


  useEffect(() => {
    fetchGroceriesData(selectedCategory);
  }, [selectedCategory, hostel, fetchGroceriesData]);



  useEffect(() => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  }, []);

useEffect(() => {
  setMonthYear(dayjs().format("YYYY-MM"));
}, []);


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
        return ['View/Edit Item', 'S.No', 'Item Name', 'Billing Year-Month', 'Unit',`Issued units on ${selectedDate}`, 'Total Quantity Issued', 'Total Amount Issued'];
      case 'Vegetables':
        return ['View/Edit Item','S.No', 'Item Name', 'Billing Year-Month', 'Total Issued Units','Total Amount'];
      case 'Egg':
        return ['Action','S.No', 'Bill Date', 'Quantity', 'Rate Per Piece', 'Total Amount'];
      case 'Milk':
        return ['Action','S.No', 'Bill Date', 'Quantity', 'Rate Per Litre', 'Total Amount'];
      case 'Gas':
        return ['Action','S.No', 'Bill Date', 'No Of Cylinders', 'Total Amount'];
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
        ];

      case 'Vegetables':
        return [
          { label: "Bill Month", name: "monthyear", type: "date" },
          { label: "Name", name: "itemName" },
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

  const handleConsumptionChange = (date: string, value: string) => {
    setDailyConsumptionData((prevData) => ({
      ...prevData,
      [date]: value.trim() === "" ? null : parseFloat(value),
    }));
  };


  const handleVegetableChange = (date: string, field: string, value: string) => {
    setDailyConsumptionVegData((prevData) => {
      const updatedData = { ...prevData };

      // Ensure the date entry exists
      if (!updatedData[date]) {
        updatedData[date] = { quantity: 0, costPerKg: 0, totalCost: 0 };
      }

      const numericValue = value.trim() === "" ? 0 : parseFloat(value);

      updatedData[date] = {
        ...updatedData[date],
        [field]: numericValue,
      };

      updatedData[date].totalCost = updatedData[date].quantity * updatedData[date].costPerKg;

      return { ...updatedData };
    });
  };

  const formattedDate = selectedDate.slice(0, 7);

  const filteredData = groceriesData.filter(item => {
    if (item.monthyear) {
      return item.monthyear === formattedDate;
    } else if (item.DateOfConsumed) {
      return item.DateOfConsumed.slice(0, 7) === formattedDate;
    }
    return false;
  });

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );



  const handleSaveChanges = async (updatedValues: Record<
    string,
    number | { quantity: number; costPerKg: number; totalCost: number }
  >) => {
    try {
      if (!editId) {
        console.error("❌ Edit ID is missing!");
        setSnackbarMessage("❌ Error: Edit ID is missing!");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      console.log("Processing Edit ID:", editId);

      switch (selectedCategory) {
        case "Provisions": {
          const { data: existingEntry, error: fetchError } = await supabase
            .from("consumedgrocery")
            .select("dailyconsumption, total_quantity_issued, total_cost, itemname")
            .eq("id", editId)
            .single();
            console.log("Existing Entry:", existingEntry);

          if (fetchError && fetchError.code !== "PGRST116") throw fetchError;


          let updatedDailyConsumption: Record<string, string> = {};
          if (existingEntry?.dailyconsumption) {
            try {
              updatedDailyConsumption =
                typeof existingEntry.dailyconsumption === "string"
                  ? JSON.parse(existingEntry.dailyconsumption)
                  : existingEntry.dailyconsumption;
            } catch (error) {
              console.error("❌ Error parsing dailyconsumption:", error);
              updatedDailyConsumption = {};
            }
          }

          for (const [date, quantity] of Object.entries(updatedValues)) {
            updatedDailyConsumption[date] = String(quantity);
          }

          const totalQuantityIssued = Object.values(updatedDailyConsumption).reduce(
            (sum, qty) => sum + Number(qty),
            0
          );

          console.log("Total Quantity Issued:", totalQuantityIssued);

          const { data: inventoryData, error: inventoryError } = await supabase
            .from("inventorygrocery")
            .select(
              "opening_stock, supplier1_rate, quantity_received_supplier2, supplier2_rate, quantity_received_intend_1, rate_intend_1, quantity_received_intend_2, rate_intend_2, quantity_received_intend_3, rate_intend_3"
            )
            .eq("itemname", existingEntry?.itemname)
            .eq("monthyear", formattedDate)
            .single();

          if (inventoryError) throw inventoryError;

          let remainingQty = totalQuantityIssued;
          let totalCost = 0;

          const stockSources = [
            { qty: inventoryData.opening_stock, rate: inventoryData.supplier1_rate },
            { qty: inventoryData.quantity_received_supplier2, rate: inventoryData.supplier2_rate },
            { qty: inventoryData.quantity_received_intend_1, rate: inventoryData.rate_intend_1 },
            { qty: inventoryData.quantity_received_intend_2, rate: inventoryData.rate_intend_2 },
            { qty: inventoryData.quantity_received_intend_3, rate: inventoryData.rate_intend_3 },
          ];

          for (const source of stockSources) {
            if (remainingQty > 0 && source.qty > 0) {
              let usedQty = Math.min(remainingQty, source.qty);
              totalCost += usedQty * source.rate;
              remainingQty -= usedQty;
            }
          }

          const { error: updateGroceryError } = await supabase
            .from("consumedgrocery")
            .update({
              dailyconsumption: updatedDailyConsumption,
              total_quantity_issued: totalQuantityIssued,
              total_cost: totalCost,
            })
            .eq("id", editId);

          if (updateGroceryError) throw updateGroceryError;

          setSnackbarMessage("✅ Changes saved successfully!");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
          fetchGroceriesData(selectedCategory);

          break;
        }

        case "Vegetables": {
          console.log("Editing vegetable entry:", editId);
          console.log("Updated values:", updatedValues);

          const { data: existingVegEntry, error: fetchError } = await supabase
            .from("vegetables")
            .select("dailyconsumption, TotalCost, itemName")
            .eq("vegetableid", editId)
            .single();

          if (fetchError) {
            console.error("❌ Error fetching vegetable data:", fetchError);
            throw fetchError;
          }

          console.log("Existing entry:", existingVegEntry);

          let updatedVegDailyConsumption: Record<
            string,
            { quantity: number; costPerKg: number; totalCost: number }
          > = {};

          if (existingVegEntry?.dailyconsumption) {
            try {
              updatedVegDailyConsumption =
                typeof existingVegEntry.dailyconsumption === "string"
                  ? JSON.parse(existingVegEntry.dailyconsumption)
                  : existingVegEntry.dailyconsumption;
            } catch (error) {
              console.error("❌ Error parsing dailyconsumption:", error);
              updatedVegDailyConsumption = {};
            }
          }

          for (const [date, value] of Object.entries(updatedValues)) {
            if (typeof value === "number") {
              console.warn(`⚠️ Unexpected number format for Vegetables on ${date}`);
              continue;
            }

            const qty = Number(value.quantity) || 0;
            const costPerKg = Number(value.costPerKg) || 0;

            updatedVegDailyConsumption[date] = {
              quantity: qty,
              costPerKg: costPerKg,
              totalCost: qty * costPerKg,
            };
          }

          console.log("Updated daily consumption:", updatedVegDailyConsumption);

          const totalCostIssuedVeg = Object.values(updatedVegDailyConsumption).reduce(
            (sum, entry) => sum + entry.totalCost,
            0
          );

          const totalQuantityIssuedVeg = Object.values(updatedVegDailyConsumption).reduce(
            (sum, entry) => sum + entry.quantity,
            0
          );

          console.log("Total Cost Issued:", totalCostIssuedVeg);
          console.log("Total Quantity Issued:", totalQuantityIssuedVeg);

          const { error: updateVegError } = await supabase
            .from("vegetables")
            .update({
              dailyconsumption: updatedVegDailyConsumption,
              total_quantity_issued: totalQuantityIssuedVeg,
              TotalCost: totalCostIssuedVeg,
            })
            .eq("vegetableid", editId);

          if (updateVegError) {
            console.error("❌ Error updating vegetable data:", updateVegError);
            throw updateVegError;
          }

          setSnackbarMessage("✅ Changes saved successfully!");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
          fetchGroceriesData(selectedCategory);
          break;
        }
      }
    } catch (error) {
      console.error("❌ Error saving changes:", error);
      setSnackbarMessage("❌ Error saving changes!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };





  const handleSubmit = async () => {
    try {
      const { itemname, itemName, DateOfConsumed , Quantity, CostPerKg, CostPerPiece, CostPerLitre,no_of_cylinder, TotalAmount } = formData;

      let response;

      if (isEditing) {
        // Editing logic
        switch (selectedCategory) {

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
        switch (selectedCategory) {
          case 'Provisions':
            const { data: inventoryData, error: inventoryError } = await supabase
              .from('inventorygrocery')
              .select('unit')
              .eq('itemname', itemname)
              .eq('monthyear', monthYear)
              .limit(1);

            if (inventoryError) throw inventoryError;

            if (!inventoryData || inventoryData.length === 0) {
              throw new Error('Item not found in PurchasedProvisions');
            }

            // Extract unit from first record
            const unit = inventoryData[0]?.unit;

            response = await supabase
              .from('consumedprovisions')
              .insert([
                {
                  hostel,
                  itemname,
                  monthyear: monthYear,
                  unit, // Use extracted unit
                },
              ]);

            if (response.error) throw response.error;

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
                  no_of_cylinder,
                },
              ]);

            if (response.error) throw response.error;
            break;

          default:
            throw new Error('Invalid category');
        }
      }

      fetchGroceriesData(selectedCategory);
      handleDialogClose();
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const handleView = (row) => {
    if (!row) return;
    setSelectedRow(row);
    switch (selectedCategory) {
      case 'Provisions':
        setDailyConsumptionData(row.dailyconsumption || {});
        break;
      case 'Vegetables':
        setDailyConsumptionVegData(row.dailyconsumption || {});
        break;
    }
  };

  const generateMonthDates = (selectedDate) => {
    const daysInMonth = dayjs(selectedDate).daysInMonth();
    return Array.from({ length: daysInMonth }, (_, i) =>
      dayjs(selectedDate).startOf("month").add(i, "day").format("YYYY-MM-DD")
    );
  };
  useEffect(() => {
    if (!selectedRow) return;

    const monthDates = generateMonthDates(selectedDate);

    const newFormattedData = monthDates.map((date) => {
      if (selectedCategory === 'Vegetables') {
        return {
          date,
          value: dailyConsumptionVegData[date]?.quantity || 0,
          costPerKg: dailyConsumptionVegData[date]?.costPerKg || 0,
          totalCost: dailyConsumptionVegData[date]?.totalCost || 0,
        };
      } else {
        return {
          date,
          value: dailyConsumptionData[date] ? parseFloat(dailyConsumptionData[date]) : 0,
        };
      }
    });

    setFormattedData(newFormattedData);
  }, [dailyConsumptionData, dailyConsumptionVegData, selectedDate, selectedCategory]);


  return (
    <div className="max-h-screen max-w-screen bg-gray-100 dark:bg-gray-800 p-1 -mt-16">
      {/* Header */}
      <div className="flex items-center mt-14 mb-2">
        <Link to={`/manage-mess/${hostel === 'Boys' ? 'Boys' : 'Girls'}`}><ArrowBack className="text-gray-900 dark:text-gray-100 cursor-pointer" /></Link>
        <span className="ml-2 text-gray-900 dark:text-gray-100 text-xl font-bold">Groceries</span>
      </div>
      <div className="text-gray-400 font-medium mb-4">
        <div className="text-sm mb-4">
          <Link to={`/manage-mess/${hostel === 'Boys' ? 'Boys' : 'Girls'}`}>{hostel === 'Boys' ? 'Boys' : 'Girls'} Hostel</Link> &gt; Groceries
        </div>
      </div>

      {/* Category Buttons */}
      <div className="flex flex-nowrap justify-between gap-4 mb-2">
        {categoryData.map((category, index) => (
          <div
            key={index}
            onClick={() => setSelectedCategory(category.label)}
            className="flex items-center justify-between bg-blue-500 text-white px-4 py-3 rounded-lg cursor-pointer hover:scale-105 transition-transform"
            style={{ backgroundColor: category.color, width: "20%", height: "60px" }}
          >
            <span className="font-bold text-sm">{category.label}</span>
            <img src={category.image} alt={category.label} className="w-10 h-10 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Table Title */}
      <div className="flex items-center justify-center mb-1">
        <span className="ml-2 text-gray-900 dark:text-gray-100 text-xl font-bold">{selectedCategory}</span>
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
      borderRadius: "20px",
      "& fieldset": {
        borderColor: "gray", // Default border color
      },
    },
    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
      borderColor: "gray", // Border color when focused
    },
    "& .MuiInputBase-input": {
      color: "black", // Default text color
    },
    ".dark &": {
      backgroundColor: "transparent", // Dark mode background
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "gray", // Dark mode border color
        },
      },
      "& .MuiInputBase-input": {
        color: "white", // Dark mode text color
      },
    },
  }}
  className="dark:bg-transparent dark:text-white"
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <SearchIcon className="dark:text-white" />
      </InputAdornment>
    ),
  }}
/>

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
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      "& fieldset": {
        borderColor: "gray", // Default border color
      },
    },
    "& .MuiOutlinedInput-root.Mui-focused fieldset": {
      borderColor: "gray", // Border color when focused
    },
    "& .MuiInputBase-input": {
      color: "black", // Default input text color
    },
    "& input::-webkit-calendar-picker-indicator": {
      filter: "invert(0)", // Default icon color (black)
    },
    ".dark &": {
      backgroundColor: "transparent", // Dark mode background
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "gray", // Dark mode border color
        },
      },
      "& .MuiInputBase-input": {
        color: "white", // Input text white in dark mode
      },
      "& input::-webkit-calendar-picker-indicator": {
        filter: "invert(60%)", // Dark mode: turns icon gray
      },
    },
  }}
  className="dark:bg-transparent"
  InputLabelProps={{
    shrink: true,
    sx: {
      color: "black", // Default label color
      ".dark &": {
        color: "gray", // Dark mode label color (Select Date text)
      },
    },
  }}
/>






      </Box>
      <div className="flex items-center space-x-4 mb-2">
        <IconButton className="flex items-center space-x-1  text-blue-500 relative -top-1"
         onClick={() => fetchGroceriesData(selectedCategory)} >
        <span className="text-blue-500 text-sm font-medium">Refresh</span>
        <RefreshIcon className="text-blue-500" /> </IconButton>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleDialogOpen()}
        sx={{ marginBottom: 2 }}
      >
        Add Item
      </Button>
      </div>
      </div>

      {error && <div className="text-red-600">{error}</div>}

      {/* Loading state */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
        <Box sx={{
          maxHeight: "110vh",
          maxWidth: "100%",
          overflowX: "auto",
          padding: "8px"
        }}>

        <TableContainer
        sx={{
          maxHeight: "100vh",
          overflow: "auto",
          backgroundColor: 'white',
          border: "1px solid #E0E0E0",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          overflowX: "auto",
        }}
        >
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{
                backgroundColor:
                  categoryData.find((cat) => cat.label === selectedCategory)?.color ||
                  "#F5F5F5",
                position: "sticky",
                top: 0,
                zIndex: 1,
                whiteSpace: "nowrap",
              }}
            >
              {getTableHeaders().map((header, index) => (
                <TableCell key={index} align="left" sx={{ fontWeight: "bold", color: "white" }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => {
              const rowId = selectedCategory === "Provisions" ? row.id : row.vegetableid;

              const isRowOpen = collapseOpenProvision[rowId] || collapseOpenVegetable[rowId] || false;
              const isEditRow = editMode[rowId] || false;

              return (
                <React.Fragment >
                  {/* Main Row */}
                  <TableRow className="dark:bg-gray-800 dark:text-gray-200" sx={{ border: "1px solid #E0E0E0", backgroundColor: "white" }}>
                    <TableCell>
                    <IconButton
                    className="dark:text-gray-200"
                  aria-label="expand row"
                  size="small"
                  onClick={() => {
                    const rowId = selectedCategory === "Provisions" ? row.id : row.vegetableid;

                    if (selectedCategory === "Provisions") {
                      setcollapseOpenProvision((prev) => {
                        const newCollapseState = Object.keys(prev).reduce((acc, key) => {
                          acc[key] = false;
                          return acc;
                        }, {} as Record<string, boolean>);
                        return { ...newCollapseState, [rowId]: !prev[rowId] };
                      });
                      setcollapseOpenVegetable({});
                    } else if (selectedCategory === "Vegetables") {
                      setcollapseOpenVegetable((prev) => {
                        const newCollapseState = Object.keys(prev).reduce((acc, key) => {
                          acc[key] = false;
                          return acc;
                        }, {} as Record<string, boolean>);
                        return { ...newCollapseState, [rowId]: !prev[rowId] };
                      });
                      setcollapseOpenProvision({});
                    }

    handleView(row);
    setEditId(rowId);
  }}
>
  {(selectedCategory === "Provisions" || selectedCategory === "Vegetables") &&
    (selectedCategory === "Provisions"
      ? collapseOpenProvision[row.id]
        ? <KeyboardArrowUpIcon />
        : <KeyboardArrowDownIcon />
      : collapseOpenVegetable[row.vegetableid]
        ? <KeyboardArrowUpIcon />
        : <KeyboardArrowDownIcon />
    )}
</IconButton>



                <IconButton
                  color="primary"
                   className="dark:text-gray-200"
                  onClick={() => {
                    if (selectedCategory === 'Provisions' || selectedCategory === 'Vegetables') {
                      const rowId = selectedCategory === "Provisions" ? row.id : row.vegetableid;
                      setEditMode((prev) => ({ ...prev, [rowId]: !isEditRow }));
                    } else {
                      handleDialogOpen(row);
                    }
                  }}
                >
                  <EditIcon className='dark:text-gray-200' />
                </IconButton>


          </TableCell>
          <TableCell align="left" className="dark:text-gray-200 dark:bg-gray-800">{index + 1 + page * rowsPerPage}.</TableCell>

          {/* Category-specific columns */}
          {selectedCategory === "Provisions" && (
            <>
              <TableCell align="left" className="dark:text-gray-200 dark:bg-gray-800">{row.itemname}</TableCell>
              <TableCell align="left" className="dark:text-gray-200 dark:bg-gray-800">{row.monthyear}</TableCell>
              <TableCell align="left" className="dark:text-gray-200 dark:bg-gray-800">{row.unit}</TableCell>
              <TableCell align="left" className="dark:text-gray-200 dark:bg-gray-800">
                {row?.dailyconsumption
                  ? (typeof row.dailyconsumption === "string"
                      ? JSON.parse(row.dailyconsumption)[selectedDate] ?? "0"
                      : row.dailyconsumption[selectedDate] ?? "0")
                  : "0"}
              </TableCell>
              <TableCell align="left" className="dark:text-gray-200 dark:bg-gray-800">{row.total_quantity_issued}</TableCell>
              <TableCell align="left" className="dark:text-gray-200 dark:bg-gray-800">₹ {row.total_cost}</TableCell>
            </>
          )}

          {/* Other categories (Vegetables, Egg, Milk, Gas) */}
          {selectedCategory === "Vegetables" && (
            <>
              <TableCell align="left" className="dark:text-gray-200 dark:bg-gray-800">{row.itemName}</TableCell>
              <TableCell align="left" className="dark:text-gray-200 dark:bg-gray-800">{row.monthyear}</TableCell>
              <TableCell align="left" className="dark:text-gray-200 dark:bg-gray-800">{row.total_quantity_issued}</TableCell>
              <TableCell align="left" className="dark:text-gray-200 dark:bg-gray-800">₹ {(row.TotalCost) ? row.TotalCost : 0}</TableCell>
            </>
          )}
          {selectedCategory === "Egg" && (
            <>
              <TableCell align="center" className="dark:text-gray-200 dark:bg-gray-800">{row.DateOfConsumed}</TableCell>
              <TableCell align="center" className="dark:text-gray-200 dark:bg-gray-800">{row.Quantity}</TableCell>
              <TableCell align="center" className="dark:text-gray-200 dark:bg-gray-800">{row.CostPerPiece}</TableCell>
              <TableCell align="center" className="dark:text-gray-200 dark:bg-gray-800">{row.TotalCost}</TableCell>
            </>
          )}
          {selectedCategory === "Milk" && (
            <>
              <TableCell align="center" className="dark:text-gray-200 dark:bg-gray-800">{row.DateOfConsumed}</TableCell>
              <TableCell align="center" className="dark:text-gray-200 dark:bg-gray-800">{row.Quantity}</TableCell>
              <TableCell align="center" className="dark:text-gray-200 dark:bg-gray-800">{row.CostPerLitre}</TableCell>
              <TableCell align="center" className="dark:text-gray-200 dark:bg-gray-800">{row.TotalCost}</TableCell>
            </>
          )}
          {selectedCategory === "Gas" && (
            <>
              <TableCell align="center" className="dark:text-gray-200 dark:bg-gray-800">{row.DateOfConsumed}</TableCell>
              <TableCell align="center" className="dark:text-gray-200 dark:bg-gray-800">{row.no_of_cylinder}</TableCell>
              <TableCell align="center" className="dark:text-gray-200 dark:bg-gray-800">{row.TotalAmount}</TableCell>
            </>
          )}
        </TableRow>

        {/* Collapsible Row */}
        {isRowOpen && (
          <TableRow>
          <TableCell colSpan={10} sx={{ padding: 0 }}>
            <Collapse in={isRowOpen} timeout="auto" unmountOnExit>
              <Box
                sx={{
                  padding: 3,
                  backgroundColor: "#F9FAFB",
                  borderBottomLeftRadius: "8px",
                  borderBottomRightRadius: "8px",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #E0E0E0",
                  marginBottom: "8px",
                }}
                className="dark:bg-slate-800"
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: "bold",
                    color: "#333",
                    marginBottom: "12px",
                    textAlign: "center",
                  }}
                  className="dark:text-gray-100"
                >
                  Daily Issued Information - {selectedCategory}
                </Typography>

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: 3,
                    padding: "12px",
                  }}
                >
                  {formattedData.map(({ date, value }) => (
                    <Box
                      key={date}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: "12px",
                        borderRadius: "8px",
                        backgroundColor: "white",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                        transition: "0.3s",
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        },
                      }}

                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#555",
                          fontWeight: "bold",
                          marginBottom: "6px",
                        }}
                        className="dark:text-black"
                      >
                        {dayjs(date).format("DD MMM")}
                      </Typography>

                      {selectedCategory === "Provisions" ? (

                        <TextField
                        size="small"
                        type="number"
                        value={value}
                        onChange={(e) => handleConsumptionChange(date, e.target.value)}
                        disabled={!isEditRow}
                        sx={{
                          width: "100px",
                          backgroundColor: "white",
                          borderRadius: "5px",
                          marginBottom: "6px",
                          "&.Mui-disabled": {
                            backgroundColor: "rgba(255,255,255,0.2)",
                          },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "gray",
                            },
                            "& input": {
                              color: "black", // Default for light mode
                            },
                          },
                          "&.dark .MuiOutlinedInput-root input": {
                            color: "white", // For dark mode
                          },
                        }}
                        className="dark:bg-white"
                        />

                      ) : (
                        <>
                          <TextField
                            className="bg-white"
                            size="small"
                            type="number"
                            label="Quantity"
                            value={dailyConsumptionVegData[date]?.quantity || ""}
                            onChange={(e) => handleVegetableChange(date, "quantity", e.target.value)}
                            disabled={!isEditRow}
                            sx={{
                              width: "100px",
                              marginBottom: "6px",
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: "gray",
                                },
                                "& input": {
                                  color: isDarkMode ? "white !important" : "black !important", // Force color change
                                },
                              },
                              "& .MuiInputLabel-root": {
                                color: isDarkMode ? "white !important" : "black !important", // Ensure label color changes
                              },
                            }}
                          />

                          <TextField
                            className="bg-white"
                            size="small"
                            type="number"
                            label="Cost/kg"
                            value={dailyConsumptionVegData[date]?.costPerKg || ""}
                            onChange={(e) => handleVegetableChange(date, "costPerKg", e.target.value)}
                            disabled={!isEditRow}
                            sx={{
                              width: "100px",
                              marginBottom: "6px",
                              "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                  borderColor: "gray",
                                },
                                "& input": {
                                  color: isDarkMode ? "white !important" : "black !important", // Force color change
                                },
                              },
                              "& .MuiInputLabel-root": {
                                color: isDarkMode ? "white !important" : "black !important", // Ensure label color changes
                              },
                            }}
                          />



                          <Typography
                            variant="caption"
                            sx={{ fontWeight: "bold", marginTop: "6px" }}
                            className="dark:text-black"
                          >
                            ₹{(dailyConsumptionVegData[date]?.totalCost || 0).toFixed(2)}
                          </Typography>
                        </>
                      )}
                    </Box>
                  ))}
                </Box>

                {isEditRow && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "16px",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveIcon />}
                        sx={{
                          borderRadius: "8px",
                          textTransform: "none",
                          padding: "6px 16px",
                          fontSize: "14px",
                          fontWeight: "bold",
                          backgroundColor: "#1976D2",
                          "&.dark": {
                            backgroundColor: "#1565C0",
                          },
                          "&:hover": {
                            backgroundColor: "#1565C0",
                            "&.dark": {
                              backgroundColor: "#1258A7",
                            },
                          },
                        }}
                        onClick={() => {
                          if(selectedCategory==='Provisions'){
                          handleSaveChanges(dailyConsumptionData)}
                          else{
                            handleSaveChanges(dailyConsumptionVegData)
                          }
                        }}
                      >
                        Save Changes
                      </Button>
                    </Box>
                  )}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>




        )}


                </React.Fragment>
              )
            })}
          </TableBody>

        </Table>


        </TableContainer>
        <TablePagination
        className="dark:text-gray-100 dark:bg-gray-800"
        sx={{backgroundColor: 'white', border: '1px solid #E0E0E0'}}
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={filteredData.length}
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
          {getDialogFields().map((field, index) =>
            field.name === "itemname" && field.label === "Item Name" ? (
              <Autocomplete
                key={index}
                options={availableItems.map((item) => item.itemname)}
                value={formData.itemname || ""}
                onChange={(event, newValue) => {
                  handleInputChange({
                    target: {
                      name: "itemname",
                      value: newValue || "",
                    },
                  });
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Item Name" fullWidth margin="dense" />
                )}
                disabled={isEditing}
              />
            ): (
              <TextField
                key={index}
                fullWidth
                label={field.label}
                name={field.name}
                type={field.type || "text"}
                value={
                  field.name === "selectedDate"
                    ? selectedDate
                    : field.name === "monthyear"
                    ? formattedDate
                    : field.type === "date"
                    ? formData[field.name] || new Date().toISOString().split("T")[0]
                    : formData[field.name] || ""
                }
                onChange={handleInputChange}
                margin="dense"
                InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
                disabled={field.name === "selectedDate" || field.name === "monthyear"}
              />
            ))}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {isEditing ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
            open={openSnackbar}
            autoHideDuration={3000} // 3 seconds
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
            <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
                {snackbarMessage}
            </Alert>
        </Snackbar>


    </div>
  );
};

export default Groceries;
