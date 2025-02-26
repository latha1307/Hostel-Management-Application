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
import dayjs from "dayjs";

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
  const [today_quantity, setToday_quantity] = useState(0);
  const [collapseOpen, setcollapseOpen] = useState<Record<number, boolean>>({});
  const [editMode, setEditMode] = useState<Record<number, boolean>>({});
  const [selectedRow, setSelectedRow] = useState(null);
  const [dailyConsumptionData, setDailyConsumptionData] = useState({});
  const [formattedData, setFormattedData] = useState<{ date: string; value: number }[]>([]);
    const [monthYear, setMonthYear] = useState<string | null>(null);



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
    if (
      groceriesData.length > 0 &&
      groceriesData[0].dailyconsumption &&
      groceriesData[0].dailyconsumption[selectedDate] !== undefined
    ) {
      setToday_quantity(Number(groceriesData[0].dailyconsumption[selectedDate]));
    } else {
      setToday_quantity(0);
    }
  }, [groceriesData, selectedDate]);

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

    if (name === "today_quantity") {
      setToday_quantity(value)
    }

    if (name === "itemname") {
      const selectedItem = availableItems.find((item) => item.itemname === value);
      setMaxQty(selectedItem?.total_stock_available || 0);
    }
  };

  const handleConsumptionChange = (date: string, value: string) => {
    setDailyConsumptionData((prevData) => ({
      ...prevData,
      [date]: value === "" || value === "null" ? null : Number(value),
    }));
  };


  const handleSaveChanges = async (updatedValues: Record<string, number>) => {
    try {
        console.log(editId)
        const { data: existingEntry, error: fetchError } = await supabase
            .from('consumedgrocery')
            .select('dailyconsumption, total_quantity_issued, total_cost, itemname')
            .eq('id', editId)
            .maybeSingle();

        if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

        console.log(existingEntry)

        let updatedDailyConsumption = existingEntry?.dailyconsumption
            ? typeof existingEntry.dailyconsumption === 'string'
                ? JSON.parse(existingEntry.dailyconsumption)
                : existingEntry.dailyconsumption
            : {};

            for (const [date, quantity] of Object.entries(updatedValues)) {
            updatedDailyConsumption[date] = String(quantity);
        }



        const totalQuantityIssued: any = Object.values(updatedDailyConsumption)
            .reduce((sum: any, qty) => sum + Number(qty), 0);

        console.log(totalQuantityIssued)

        // ✅ Fetch inventory data for cost calculations
        const { data: inventoryData, error: inventoryError } = await supabase
            .from('inventorygrocery')
            .select('opening_stock, supplier1_rate, quantity_received_supplier2, supplier2_rate, quantity_received_intend_1, rate_intend_1, quantity_received_intend_2, rate_intend_2, quantity_received_intend_3, rate_intend_3')
            .eq('itemname', existingEntry?.itemname)
            .single();

        if (inventoryError) throw inventoryError;

let remainingQty: number = totalQuantityIssued;
let totalCost: number = 0;

// Step 1: Deduct from Opening Stock
if (remainingQty > 0 && inventoryData.opening_stock > 0) {
    let usedQty = Math.min(remainingQty, inventoryData.opening_stock);
    totalCost += usedQty * inventoryData.supplier1_rate;
    remainingQty -= usedQty;
}

// Step 2: Deduct from Supplier 2 Stock
if (remainingQty > 0 && inventoryData.quantity_received_supplier2 > 0) {
    let usedQty = Math.min(remainingQty, inventoryData.quantity_received_supplier2);
    totalCost += usedQty * inventoryData.supplier2_rate;
    remainingQty -= usedQty;
}

// Step 3: Deduct from Indent 1 Stock
if (remainingQty > 0 && inventoryData.quantity_received_intend_1 > 0) {
    let usedQty = Math.min(remainingQty, inventoryData.quantity_received_intend_1);
    totalCost += usedQty * inventoryData.rate_intend_1;
    remainingQty -= usedQty;
}

// Step 4: Deduct from Indent 2 Stock
if (remainingQty > 0 && inventoryData.quantity_received_intend_2 > 0) {
    let usedQty = Math.min(remainingQty, inventoryData.quantity_received_intend_2);
    totalCost += usedQty * inventoryData.rate_intend_2;
    remainingQty -= usedQty;
}

// Step 5: Deduct from Indent 3 Stock
if (remainingQty > 0 && inventoryData.quantity_received_intend_3 > 0) {
    let usedQty = Math.min(remainingQty, inventoryData.quantity_received_intend_3);
    totalCost += usedQty * inventoryData.rate_intend_3;
    remainingQty -= usedQty;
}

// ✅ Update consumed grocery with new total quantity & cost
const { error: updateGroceryError } = await supabase
    .from('consumedgrocery')
    .update({
        dailyconsumption: updatedDailyConsumption,
        total_quantity_issued: totalQuantityIssued,
        total_cost: totalCost
    })
    .eq('id', editId);

if (updateGroceryError) throw updateGroceryError;

console.log("✅ Changes saved successfully!");

    } catch (error) {
        console.error("❌ Error saving changes:", error);
    }
};




  const handleSubmit = async () => {
    try {
      const { itemname, itemName, DateOfConsumed ,ConsumedQnty = 0, Quantity, CostPerKg, CostPerPiece, CostPerLitre,no_of_cylinder, TotalAmount } = formData;

      let response;

      if (isEditing) {
        // Editing logic
        switch (selectedCategory) {
          case 'Provisions':

            const { data: existingEntry, error: fetchError } = await supabase
                .from('consumedgrocery')
                .select('dailyconsumption, total_quantity_issued, total_cost, itemname')
                .eq('id', editId)
                .maybeSingle();

                console.log("Fetched rows:", existingEntry);

            if (fetchError && fetchError.code !== 'PGRST116') {
                throw fetchError;
            }

            let updatedDailyConsumption = existingEntry?.dailyconsumption
                ? typeof existingEntry.dailyconsumption === 'string'
                    ? JSON.parse(existingEntry.dailyconsumption)
                    : existingEntry.dailyconsumption
                : {};

            console.log(today_quantity)

            const previousQuantity = Number(updatedDailyConsumption[selectedDate] || 0);
            const netChange = today_quantity - previousQuantity;

            updatedDailyConsumption[selectedDate] = String(today_quantity);

            const { data: inventoryData, error: inventoryError } = await supabase
                .from('inventorygrocery')
                .select('opening_stock_remaining, supplier1_rate, quantity_supplier2_remaining, supplier2_rate, quantity_intend1_remaining, rate_intend_1, quantity_intend2_remaining, rate_intend_2, quantity_intend3_remaining, rate_intend_3, opening_stock, quantity_received_supplier2, quantity_received_intend_1, quantity_received_intend_2, quantity_received_intend_3')
                .eq('itemname', existingEntry?.itemname)
                .single();

            if (inventoryError) throw inventoryError;

            let remainingQty = netChange;
            let updatedInventory = { ...inventoryData };
            let totalCost = 0;

            const trackUsage = (usedKey, stockKey, rateKey, isReturning = false) => {
              if (remainingQty !== 0 && updatedInventory[stockKey] > 0) {
                  let availableQty = updatedInventory[stockKey] - (updatedInventory[usedKey] || 0);

                  if (availableQty > 0) {
                      let usedNow = Math.min(Math.abs(remainingQty), availableQty); // Ensure no negative values

                      if (!isReturning) {
                          updatedInventory[usedKey] = (updatedInventory[usedKey] || 0) + usedNow;
                          totalCost += usedNow * (inventoryData[rateKey] || 0);
                      } else {
                          updatedInventory[usedKey] = (updatedInventory[usedKey] || 0) - usedNow; // Return stock
                          totalCost -= usedNow * (inventoryData[rateKey] || 0);
                      }

                      remainingQty += isReturning ? usedNow : -usedNow; // Adjust remainingQty
                  }
              }
          };


          // If quantity is being reduced, return the stock
          const isReturning = netChange < 0;

          trackUsage('opening_stock_remaining', 'opening_stock', 'supplier1_rate', isReturning);
          trackUsage('quantity_supplier2_remaining', 'quantity_received_supplier2', 'supplier2_rate', isReturning);
          trackUsage('quantity_intend1_remaining', 'quantity_received_intend_1', 'rate_intend_1', isReturning);
          trackUsage('quantity_intend2_remaining', 'quantity_received_intend_2', 'rate_intend_2', isReturning);
          trackUsage('quantity_intend3_remaining', 'quantity_received_intend_3', 'rate_intend_3', isReturning);

          // Ensure total cost updates correctly
          const updatedTotalCost = existingEntry?.total_cost + (netChange < 0 ? -Math.abs(totalCost) : totalCost);

          // ✅ Update consumed grocery
          response = await supabase
              .from('consumedgrocery')
              .update({
                  dailyconsumption: updatedDailyConsumption,
                  total_quantity_issued: Object.values(updatedDailyConsumption).reduce((sum:any, qty) => sum + Number(qty), 0),
                  total_cost: updatedTotalCost
              })
              .eq('id', editId);

          if (response.error) throw response.error;

          // ✅ Update inventory stocks
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
    setDailyConsumptionData(row.dailyconsumption || {});
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
    const newFormattedData = monthDates.map((date) => ({
      date,
      value: dailyConsumptionData[date] ? parseInt(dailyConsumptionData[date], 10) : 0,
    }));

    setFormattedData(newFormattedData);
  }, [dailyConsumptionData, selectedDate]);

  return (
<<<<<<< HEAD
    <div className="dark:bg-gray-800 dark:text-gray-200  max-h-screen max-w-screen bg-pageBg p-1 -mt-16">
      {/* Header */}
      <div className="flex items-center mt-14 mb-2">
        <Link to={`/manage-mess/${hostel === 'Boys' ? 'Boys' : 'Girls'}`}><ArrowBack className="dark:bg-gray-800 dark:text-gray-200 text-primary cursor-pointer" /></Link>
        <span className="dark:bg-gray-800 dark:text-gray-200 ml-2 text-primary text-xl font-bold">Groceries</span>
      </div>
      <div className="text-tertiary font-medium mb-4 dark:bg-gray-800 dark:text-gray-200">
=======
    <div className="max-h-screen max-w-screen bg-gray-100 dark:bg-gray-800 p-1 -mt-16">
      {/* Header */}
      <div className="flex items-center mt-14 mb-2">
        <Link to={`/manage-mess/${hostel === 'Boys' ? 'Boys' : 'Girls'}`}><ArrowBack className="text-gray-900 dark:text-gray-100 cursor-pointer" /></Link>
        <span className="ml-2 text-gray-900 dark:text-gray-100 text-xl font-bold">Groceries</span>
      </div>
      <div className="text-gray-400 font-medium mb-4">
>>>>>>> upstream/main
        <div className="text-sm mb-4">
          <Link className="dark:bg-gray-800 dark:text-gray-200" to={`/manage-mess/${hostel === 'Boys' ? 'Boys' : 'Girls'}`}>{hostel === 'Boys' ? 'Boys' : 'Girls'} Hostel</Link> &gt; Groceries
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
            <span className="font-bold text-sm dark:text:gray-200">{category.label}</span>
            <img src={category.image} alt={category.label} className="w-10 h-10 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Table Title */}
<<<<<<< HEAD
      <div className="flex items-center justify-center mb-1 dark:bg-gray-800 dark:text-gray-200">
        <span className="ml-2 text-primary text-xl font-bold">{selectedCategory}</span>
=======
      <div className="flex items-center justify-center mb-1">
        <span className="ml-2 text-gray-900 dark:text-gray-100 text-xl font-bold">{selectedCategory}</span>
>>>>>>> upstream/main
      </div>

      {/* Search and Filter Section */}
      <div className="flex justify-between">
      <Box display="flex" alignItems="center" mb={1} gap={2}>
<<<<<<< HEAD
      <TextField
  className="dark:bg-gray-800"    
  variant="outlined"
  size="small"
  placeholder="Search"
  sx={{
    width: "60%",
    backgroundColor: "white",
    borderRadius: "20px",
    "& .MuiOutlinedInput-root": {
      borderRadius: "20px",
      "& input": {
        color: "#9e9e9e", // Gray text color
      },
      "& fieldset": {
        borderColor: "#9e9e9e", // Gray border color
      },
      "&:hover fieldset": {
        borderColor: "#7d7d7d", // Darker gray on hover
      },
      "&.Mui-focused fieldset": {
        borderColor: "#616161", // Slightly darker gray when focused
      },
    },
    "& .MuiInputAdornment-root": {
      color: "#9e9e9e", // Gray color for search icon
    },
    "&::placeholder": {
      color: "#9e9e9e", // Gray placeholder text
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


=======
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
          className="dark:bg-gray-600 dark:text:gray"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
>>>>>>> upstream/main
      {selectedCategory === "Provisions" && (
          <TextField
          className="dark:bg-gray-800"
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
              "& input": {
                color: "#9e9e9e", // Gray text color
              },
              "& fieldset": {
                borderColor: "#c4c4c4", // Light gray border
              },
            },
            "& label": {
              color: "#9e9e9e", // Gray color for label
            }
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
<<<<<<< HEAD
              <TableCell key={index} align="center" sx={{ fontWeight: "bold", color: 'white' }}>
                {header}
              </TableCell>
            ))}
              </TableRow>
            </TableHead>
            <TableBody className="dark:bg-gray-800 dark:text-gray-200" >
              {paginatedData.map((row, index) => (
                <TableRow key={row.id} sx={{ border: "1px solid #E0E0E0", backgroundColor: "white",flexGrow: 0.5  }}>
                  <TableCell className=" dark:bg-gray-800 dark:text-gray-200" align="center">{index + 1 + page * rowsPerPage}</TableCell>

              {selectedCategory === 'Provisions' && (
                <>
                  <TableCell className=" dark:bg-gray-800 dark:text-gray-200" align="center">{row.itemname}</TableCell>
                  <TableCell className=" dark:bg-gray-800 dark:text-gray-200" align="center">{row.monthyear}</TableCell>
                  <TableCell className=" dark:bg-gray-800 dark:text-gray-200" align="center">{row.unit}</TableCell>
                  <TableCell className=" dark:bg-gray-800 dark:text-gray-200" align="center">
                    {row?.dailyconsumption
                      ? (typeof row.dailyconsumption === "string"
                          ? JSON.parse(row.dailyconsumption)[selectedDate] ?? "0"
                          : row.dailyconsumption[selectedDate] ?? "0")
                      : "0"}
                  </TableCell>
                  <TableCell className=" dark:bg-gray-800 dark:text-gray-200" align="center">{row.total_quantity_issued}</TableCell>
                  <TableCell className=" dark:bg-gray-800 dark:text-gray-200" align="center">{row.total_cost}</TableCell>
                  <TableCell className=" dark:bg-gray-800 dark:text-gray-200" align="center">
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
                  <TableCell className="dark:bg-gray-800 dark:text-gray-200" align="center">{row.DateOfConsumed}</TableCell>
                  <TableCell className="dark:bg-gray-800 dark:text-gray-200" align="center">{row.itemName}</TableCell>
                  <TableCell className="dark:bg-gray-800 dark:text-gray-200" align="center">{row.Quantity}</TableCell>
                  <TableCell className="dark:bg-gray-800 dark:text-gray-200" align="center">{row.CostPerKg}</TableCell>
                  <TableCell className="dark:bg-gray-800 dark:text-gray-200" align="center">{row.TotalCost}</TableCell>
                </>
              )}
              {selectedCategory === 'Egg' && (
                <>
                  <TableCell className="dark:bg-gray-800 dark:text-gray-200" align="center">{row.DateOfConsumed}</TableCell>
                  <TableCell className="dark:bg-gray-800 dark:text-gray-200" align="center">{row.Quantity}</TableCell>
                  <TableCell className="dark:bg-gray-800 dark:text-gray-200" align="center">{row.CostPerPiece}</TableCell>
                  <TableCell className="dark:bg-gray-800 dark:text-gray-200" align="center">{row.TotalCost}</TableCell>
                </>
              )}
              {selectedCategory === 'Milk' && (
                <>
                  <TableCell className="dark:bg-gray-800 dark:text-gray-200" align="center">{row.DateOfConsumed}</TableCell>
                  <TableCell className="dark:bg-gray-800 dark:text-gray-200" align="center">{row.Quantity}</TableCell>
                  <TableCell className="dark:bg-gray-800 dark:text-gray-200" align="center">{row.CostPerLitre}</TableCell>
                  <TableCell className="dark:bg-gray-800 dark:text-gray-200" align="center">{row.TotalCost}</TableCell>
                </>
              )}
              {selectedCategory === 'Gas' && (
                <>
                  <TableCell className="dark:bg-gray-800 dark:text-gray-200" align="center">{row.DateOfConsumed}</TableCell>
                  <TableCell className="dark:bg-gray-800 dark:text-gray-200" align="center">{row.no_of_cylinder}</TableCell>
                  <TableCell className="dark:bg-gray-800 dark:text-gray-200" align="center">{row.TotalAmount}</TableCell>
                </>
              )}

                  <TableCell className=" dark:bg-gray-800 dark:text-gray-200" align="center">
                    <IconButton color="primary" onClick={() => handleDialogOpen(row)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
=======
                <TableCell key={index} align="center" sx={{ fontWeight: "bold", color: "white" }}>
                  {header}
                </TableCell>
>>>>>>> upstream/main
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
          {paginatedData.map((row, index) => {
    const isRowOpen = collapseOpen[row.id] || false;
    const isEditRow = editMode[row.id] || false;

    return (
      <React.Fragment key={row.id}>
        {/* Main Row */}
        <TableRow className="dark:bg-gray-700 dark:text-gray-100" sx={{ border: "1px solid #E0E0E0", backgroundColor: "white" }}>
          <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            className="dark:text-gray-100"
            onClick={() => {
              setcollapseOpen((prev) => {
                const newCollapseState = Object.keys(prev).reduce((acc, key) => {
                  acc[key] = false;
                  return acc;
                }, {} as Record<string, boolean>);
                return { ...newCollapseState, [row.id]: !isRowOpen };
              });
              handleView(row);
              setEditId(row.id);
            }}
          >
            {isRowOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>

            <IconButton
              color="primary"
              className="dark:hover:bg-slate-600"
              onClick={() => setEditMode((prev) => ({ ...prev, [row.id]: !isEditRow }))}
            >
              <EditIcon className='dark:text-gray-900' />
            </IconButton>
          </TableCell>
          <TableCell align="left" className="dark:text-gray-100">{index + 1 + page * rowsPerPage}.</TableCell>

          {/* Category-specific columns */}
          {selectedCategory === "Provisions" && (
            <>
              <TableCell align="left" className="dark:text-gray-100">{row.itemname}</TableCell>
              <TableCell align="right"  className="dark:text-gray-100">{row.monthyear}</TableCell>
              <TableCell align="right"  className="dark:text-gray-100">{row.unit}</TableCell>
              <TableCell align="right"  className="dark:text-gray-100">
                {row?.dailyconsumption
                  ? (typeof row.dailyconsumption === "string"
                      ? JSON.parse(row.dailyconsumption)[selectedDate] ?? "0"
                      : row.dailyconsumption[selectedDate] ?? "0")
                  : "0"}
              </TableCell>
              <TableCell align="right" className="dark:text-gray-100">{row.total_quantity_issued}</TableCell>
              <TableCell align="right" className="dark:text-gray-100">{row.total_cost}</TableCell>
            </>
          )}

          {/* Other categories (Vegetables, Egg, Milk, Gas) */}
          {selectedCategory === "Vegetables" && (
            <>
              <TableCell align="center">{row.DateOfConsumed}</TableCell>
              <TableCell align="center">{row.itemName}</TableCell>
              <TableCell align="center">{row.Quantity}</TableCell>
              <TableCell align="center">{row.CostPerKg}</TableCell>
              <TableCell align="center">{row.TotalCost}</TableCell>
            </>
          )}
          {selectedCategory === "Egg" && (
            <>
              <TableCell align="center">{row.DateOfConsumed}</TableCell>
              <TableCell align="center">{row.Quantity}</TableCell>
              <TableCell align="center">{row.CostPerPiece}</TableCell>
              <TableCell align="center">{row.TotalCost}</TableCell>
            </>
          )}
          {selectedCategory === "Milk" && (
            <>
              <TableCell align="center">{row.DateOfConsumed}</TableCell>
              <TableCell align="center">{row.Quantity}</TableCell>
              <TableCell align="center">{row.CostPerLitre}</TableCell>
              <TableCell align="center">{row.TotalCost}</TableCell>
            </>
          )}
          {selectedCategory === "Gas" && (
            <>
              <TableCell align="center">{row.DateOfConsumed}</TableCell>
              <TableCell align="center">{row.no_of_cylinder}</TableCell>
              <TableCell align="center">{row.TotalAmount}</TableCell>
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
                    padding: 2,
                    backgroundColor: "#F9FAFB",
                    borderBottomLeftRadius: "8px",
                    borderBottomRightRadius: "8px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                    border: "1px solid #E0E0E0",
                    marginBottom: "4px",
                    "&.dark": {
                      boxShadow: "0px 2px 6px rgba(255, 255, 255, 0.2)",
                      backgroundColor: "#2E2E2E",
                      border: '1px solid #555'
                    }
                  }}
                  className="dark:bg-slate-800 "
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: "bold",
                      color: "#333",
                      marginBottom: "8px",
                      textAlign: "center",

                    }}
                    className="dark:text-gray-100"
                  >
                    Daily Issued Information
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                      gap: 2,
                      padding: "8px",
                    }}
                  >
                    {formattedData.map(({ date, value }) => (
                      <Box
                        key={date}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          padding: "8px",
                          borderRadius: "8px",
                          backgroundColor: "white",
                          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                          transition: "0.3s",
                          "&:hover": {
                            transform: "scale(1.05)",
                            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                          }
                        }}
                        className="dark:bg-slate-600 "
                      >
                        <Typography
                          variant="caption"
                          sx={{ color: "#555", "&.dark": { color: "#CCC"}, fontWeight: "bold" }}
                        >
                          {dayjs(date).format("DD MMM")}
                        </Typography>
                        <TextField
                          size="small"
                          value={value}
                          onChange={(e) => handleConsumptionChange(date, e.target.value)}
                          disabled={!isEditRow}
                          sx={{
                            width: "80px",
                            backgroundColor: "white",
                            borderRadius: "5px",
                            "&.Mui-disabled": {
                              backgroundColor: "rgba(255,255,255,0.2)",
                              "&.dark": {
                                backgroundColor: "#444"
                              }
                            },
                            "&.dark": {
                              backgroundColor: "#555" ,
                              color: "#FFF"
                            },
                            input: {
                              color: "#000",
                              "&.dark": {
                                color: "#FFF"
                              }
                            },
                          }}
                          className="dark:bg-gray-200 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-400"
                        />
                      </Box>
                    ))}
                  </Box>

                  {/* Save Button - Only visible when editing */}
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
                          "&.dark":{
                            backgroundColor: "#1565C0",
                          },
                          "&:hover": {
                            backgroundColor: "#1565C0",
                            "&.dark": {
                              backgroundColor: "#1258A7",
                            }
                          },
                        }}
                        onClick={() => handleSaveChanges(dailyConsumptionData)}
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
<<<<<<< HEAD
         className=" dark:bg-gray-800 dark:text-gray-200"
=======
        className="dark:bg-gray-700 dark:text-gray-100"
>>>>>>> upstream/main
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
  <DialogTitle>Add Item</DialogTitle>
  <DialogContent>
    {/* Billing Month - Disabled Field */}
    <TextField
      fullWidth
      label="Billing Month"
      name="monthyear"
      value={monthYear} // Automatically set to current YYYY-MM
      margin="dense"
      disabled
    />

    {/* Item Name - Autocomplete Dropdown */}
    <Autocomplete
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
  </DialogContent>

  <DialogActions>
    <Button onClick={handleDialogClose}>Cancel</Button>
    <Button onClick={handleSubmit} variant="contained" color="primary">
      Add
    </Button>
  </DialogActions>
</Dialog>


    </div>
  );
};

export default Groceries;


