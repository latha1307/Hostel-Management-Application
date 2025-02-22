import React, { useState, useEffect, useCallback } from 'react';
import  supabase  from "../../supabaseClient";
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  Input,
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
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { GrDocumentExcel } from "react-icons/gr";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import * as XLSX from "xlsx";
import  saveAs from "file-saver";


interface InventoryItem {
  id: number;
  monthyear: string;
  itemname: string;
  unit: string;
  opening_stock: number;
  quantity_issued_boys: number;
  quantity_issued_girls: number;
  total_quantity_issued_units: number;
  total_quantity_issued_rupees: number;
  closing_balance_till_date: number;
  stock_remaining: number;
  supplier1_rate: number;
  supplier2_rate: number;
  quantity_received_supplier2: number;
  quantity_received_intend_1: number;
  quantity_received_intend_2: number;
  quantity_received_intend_3: number;
  rate_intend_1: number;
  rate_intend_2: number;
  rate_intend_3: number;
}
type FormData = {
  itemname: string;
  unit: string;
  opening_stock: number;
  supplier1_rate: number;
  monthyear: string;
  supplier2_rate: number;
  quantity_received_supplier2: number;
  quantity_received_intend_1: number;
  quantity_received_intend_2: number;
  quantity_received_intend_3: number;
  rate_intend_1: number;
  rate_intend_2: number;
  rate_intend_3: number;
};

const Provisions = () => {
  const [groceriesData, setGroceriesData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    itemname: "",
    unit: "",
    opening_stock: 0,
    supplier1_rate: 0,
    supplier2_rate: 0,
    quantity_received_supplier2: 0,
    monthyear: '',
    quantity_received_intend_1: 0,
    quantity_received_intend_2: 0,
    quantity_received_intend_3: 0,
    rate_intend_1: 0,
    rate_intend_2: 0,
    rate_intend_3: 0
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openNewMonth, setOpenNewMonth] = useState(false);
  const [monthYear, setMonthYear] = useState<string
   | null>(null);
  const [fileName, setFileName] = useState("Provisions_Stock.xlsx");
  const [searchQuery, setSearchQuery] = useState("");


const handleSearch = (event) => {
  setSearchQuery(event.target.value);
};

  // Fetch groceries data from Supabase
  const fetchGroceriesData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("inventorygrocery")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;

      setGroceriesData(data as InventoryItem[]);
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

  useEffect(() => {
    console.log("Updated isEditing:", isEditing);
}, [isEditing]);

const getDialogFields = [
  { label: "Item Description", name: "itemname" },
  { label: "Unit", name: "unit" },
  { label: "Month/Year", name: "monthyear" },
  { label: "Opening Stock", name: "opening_stock", type: "number" },
  { label: "Supplier 1 Rate in Rs.", name: "supplier1_rate", type: "number" },
  { label: "Quantity Received From Supplier 2", name: "quantity_received_supplier2", type: "number" },
  { label: "Supplier 2 Rate in Rs.", name: "supplier2_rate", type: "number" },
  { label: "Quantity Received (Indent Order 1)", name: "quantity_received_intend_1", type: "number" },
  { label: "Rate (Indent Order 1)", name: "rate_intend_1", type: "number" },
  { label: "Quantity Received (Indent Order 2)", name: "quantity_received_intend_2", type: "number" },
  { label: "Rate (Indent Order 2)", name: "rate_intend_2", type: "number" },
  { label: "Quantity Received (Indent Order 3)", name: "quantity_received_intend_3", type: "number" },
  { label: "Rate (Indent Order 3)", name: "rate_intend_3", type: "number" },
];


  const handleNewMonth = () => {
    setOpenNewMonth(true);
  }

  const handleMonthClose = () => {
    setOpenNewMonth(false);
    setMonthYear(null);
};

const handleMonthSubmit = async () => {
  if (!monthYear) {
      alert("Please enter Month-Year.");
      return;
  }

  setLoading(true);

  try {

    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0].split("-").reverse().join("-");
      // 1. Fetch groceries list (itemname, unit)
      const { data: groceriesList, error: groceriesError } = await supabase
          .from("grocerieslist")
          .select("itemname, unit");

      if (groceriesError) throw groceriesError;

      // 2. Insert new rows into inventorygrocery table
      const inventoryData = groceriesList.map(item => ({
          monthyear: monthYear,
          itemname: item.itemname,
          unit: item.unit
      }));

      const inventoryBoysData = groceriesList.map(item => ({
        monthyear: monthYear,
        itemname: item.itemname,
        unit: item.unit,
        hostel: 'Boys',
        dailyconsumption: { [formattedDate]: "0" }
    }));

    const inventoryGirlsData = groceriesList.map(item => ({
      monthyear: monthYear,
      itemname: item.itemname,
      unit: item.unit,
      hostel: 'Girls',
      dailyconsumption: { [formattedDate]: "0" }
  }));
      const { error: insertError } = await supabase.from("inventorygrocery").insert(inventoryData);
      if (insertError) throw insertError;


      const { error: insertBoysError } = await supabase.from("consumedgrocery").insert(inventoryBoysData);
      if (insertBoysError) throw insertBoysError

      const { error: insertGirlsError } = await supabase.from("consumedgrocery").insert(inventoryGirlsData);
      if (insertGirlsError) throw insertGirlsError


      alert("New month added successfully!");
      handleMonthClose();
      fetchGroceriesData();
  } catch (err) {
      console.error("Error:", err.message);
      alert("Failed to create new month.");
  } finally {
      setLoading(false);
  }
};

  const handleDialogOpen = (data: any = null) => {
    setIsEditing(!!data);
    if(data){
    setEditId(data.id );
    }
    setFormData(data || {});
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setFormData({
      itemname: "",
      unit: "",
      opening_stock: 0,
      supplier1_rate: 0,
      monthyear: "",
      supplier2_rate: 0,
      quantity_received_supplier2: 0,
      quantity_received_intend_1: 0,
      quantity_received_intend_2: 0,
      quantity_received_intend_3: 0,
      rate_intend_1: 0,
      rate_intend_2: 0,
      rate_intend_3: 0
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



  const handleSubmit = async () => {
    try {
      if (!formData.itemname || !formData.unit || !formData.monthyear) {
        alert("Please fill in all required fields.");
        return;
      }

      if (isEditing) {

        const { data: existingData, error: fetchError } = await supabase
          .from("inventorygrocery")
          .select("*")
          .eq("id", editId)
          .single();

        if (fetchError) {
          console.error("Error fetching existing data:", fetchError);
          throw fetchError;
        }

        console.log("Existing Data:", existingData);


        const updateData: Record<string, any> = {};
        Object.keys(formData).forEach((key) => {
          if (formData[key] !== existingData[key] && formData[key] !== undefined) {
            updateData[key] = formData[key];
          }
        });

        console.log("Final update data:", updateData);

        if (Object.keys(updateData).length > 0) {
          const { error } = await supabase.from("inventorygrocery").update(updateData).eq("id", editId);
          if (error) {
            console.error("Error updating item:", error);
            throw error;
          }
          console.log("Item updated successfully!");
        } else {
          console.log("No changes detected, skipping update.");
        }
      } else {

        const { error } = await supabase.from("inventorygrocery").insert([formData]);
        if (error) throw error;
        console.log("New item added successfully!");
      }

      fetchGroceriesData();
      handleDialogClose();
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error submitting data. Please try again.");
    }
  };



  // Handle pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = groceriesData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


  const filteredData = paginatedData.filter((row) =>
    Object.values(row).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );


  const exportToExcel = () => {
    if (!groceriesData || groceriesData.length === 0) {
      alert("No data available to export!");
      return;
    }

    // Define column headers
    let headers = [
      "S.No",
      "Item Description",
      "Unit",
      "Month Year",
      "Opening Stock",
      "Quantity Received (Indent Order 1)",
      "Quantity Received (Indent Order 2)",
      "Quantity Received (Indent Order 3)",
      "Supplier 1 Rate in Rs.",
      "Supplier 2 Rate",
      "Quantity Received From Supplier 2",
      "Quantity Issued Boys",
      "Quantity Issued Girls",
      "Total Quantity Issued in Units",
      "Total Quantity Issued in Rupees",
      "Closing Stock Balance as on till date",
      "Stock Remaining in Rupees",
    ];


    // Convert table data into an array format
    const excelData = groceriesData.map((row, index) => {
      let rowData = [
        page * rowsPerPage + index + 1,
        row.itemname,
        row.unit,
        row.monthyear,
        row.opening_stock,
        row.quantity_received_intend_1,
        row.quantity_received_intend_2,
        row.quantity_received_intend_3,
        row.supplier1_rate,
        row.supplier2_rate,
        row.quantity_received_supplier2,
        row.quantity_issued_boys,
        row.quantity_issued_girls,
        row.total_quantity_issued_units,
        row.total_quantity_issued_rupees,
        row.closing_balance_till_date,
        row.stock_remaining,
      ];

      return rowData;
    });

    // Create a worksheet and workbook
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...excelData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Data");

    // Generate Excel file and trigger download
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    saveAs(dataBlob, "Provisions_Stock.xlsx");
  };

  const importFromExcel = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target || !e.target.result) {
        console.error("File reading failed!");
        return;
      }

      const data = new Uint8Array(e.target.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (parsedData.length > 1) {
        const newData = parsedData.slice(1).map((row: any, index: number) => ({
          id: index + 1,
          itemname: row[1] || "",
          unit: row[2] || "",
          monthyear: row[3] || "",
          opening_stock: row[4] || "",
          quantity_received_intend_1: row[5] || "",
          rate_intend_1: row[6] || "",
          quantity_received_intend_2: row[7] || "",
          rate_intend_2: row[8] || "",
          quantity_received_intend_3: row[9] || "",
          rate_intend_3: row[10] || "",
          supplier1_rate: row[11] || "",
          supplier2_rate:  row[12] || "" ,
          quantity_received_supplier2: row[13] || "",
          quantity_issued_boys: row[14] || "",
          quantity_issued_girls: row[15] || "",
          total_quantity_issued_units: row[16] || "",
          total_quantity_issued_rupees: row[17] || "",
          closing_balance_till_date: row[18] || "",
          stock_remaining: row[19] || "",
        }));

        setGroceriesData(newData);
      }
    };

    reader.readAsArrayBuffer(file);
  };
  return (
    <div className="max-h-screen bg-pageBg p-1 -mt-10 max-w-screen">
      <div className="flex items-center mt-8 mb-2">
        <span className=" text-primary text-xl font-bold"> Stocks in Inventory</span>
      </div>
      <p className="text-tertiary font-medium mb-4">Manage mess / Inventory</p>
      <div className='flex space-x-3 m-3 -ml-0'>
      <Button
            variant="contained"
            size="small"
            startIcon={<GrDocumentExcel size={18} />}
            onClick={exportToExcel}
            sx={{
              backgroundColor: "#01713c",
              color: "white",
              "&:hover": { backgroundColor: "#01582e" },
            }}
          >
            Export
          </Button>

          {/* Import from Excel Button */}
          <label htmlFor="import-excel">
            <Input type="file" id="import-excel" style={{ display: "none" }} onChange={importFromExcel} />
            <Button
              variant="contained"
              size="small"
              startIcon={<GrDocumentExcel size={18} />}
              component="span"
              sx={{
                backgroundColor: "#ffc107",
                color: "black",
                "&:hover": { backgroundColor: "#e0a800" },
              }}
            >
              Import
            </Button>
          </label>
      </div>
            <div className="flex justify-between">
        <Box display="flex" alignItems="center" mb={2} gap={2}>
          {/* Search Field */}
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch}
            sx={{
              width: "60%",
              backgroundColor: "#f9f9f9",
              borderRadius: "10px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon style={{ color: "#007bff" }} />
                </InputAdornment>
              ),
            }}
          />


          {/* Add New Month Button */}
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleNewMonth}
            sx={{
              backgroundColor: "#28a745",
              color: "white",
              "&:hover": { backgroundColor: "#218838" },
            }}
          >
            Add Month
          </Button>


        </Box>

        {/* Add Item Button */}
        <Button
          variant="contained"
          size="small"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleDialogOpen}
          sx={{
            backgroundColor: "secondary",
            color: "white",
            "&:hover": { backgroundColor: "#c82333" },
            marginBottom: 2,
          }}
        >
          Add Item
        </Button>
      </div>


      {error && <div className="text-red-600">{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Box sx={{ maxHeight: "110vh", maxWidth: '100%', overflowX: "auto", padding: "8px" }}>
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
            <Table size='small'>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#7d1818', position: "sticky", top: 0, zIndex: 1, whiteSpace: "nowrap" }}>
                  {["S.No", "Item Description", "Unit", "Month Year", "Opening stock", "Quantity Received (Indent Order 1)", "Rate (Order 1)", "Quantity Received (Indent Order 2)", "Rate (Order 2)", "Quantity Received (Indent Order 3)", "Rate (Order 3)", "Supplier 1 Rate in Rs.", "Supplier 2 Rate", "Quantity Received From Supplier 2", "Quantity Issued Boys", "Quantity Issued Girls", "Total Quantity Issued in Units", "Total Quantity Issued in Rupees", "Closing Stock Balance as on till date", "Stock Remaining in Rupees", "Action"]
                    .map((header, index) => (
                      <TableCell key={index} align="center" sx={{ fontWeight: "bold", color: "white" }}>
                        {header}
                      </TableCell>
                    ))
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row, index) => (
                  <TableRow key={row.id} sx={{ backgroundColor: 'white' }}>
                    <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell align="center">{row.itemname}</TableCell>
                    <TableCell align="center">{row.unit}</TableCell>
                    <TableCell align="center">{row.monthyear}</TableCell>
                    <TableCell align="center">{row.opening_stock}</TableCell>
                    <TableCell align="center">{row.quantity_received_intend_1}</TableCell>
                    <TableCell align="center">{row.rate_intend_1}</TableCell>
                    <TableCell align="center">{row.quantity_received_intend_2}</TableCell>
                    <TableCell align="center">{row.rate_intend_2}</TableCell>
                    <TableCell align="center">{row.quantity_received_intend_3}</TableCell>
                    <TableCell align="center">{row.rate_intend_3}</TableCell>
                    <TableCell align="center">{row.supplier1_rate}</TableCell>
                    <TableCell align="center">{row.supplier2_rate}</TableCell>
                    <TableCell align="center">{row.quantity_received_supplier2}</TableCell>
                    <TableCell align="center">{row.quantity_issued_boys}</TableCell>
                    <TableCell align="center">{row.quantity_issued_girls}</TableCell>
                    <TableCell align="center">{row.total_quantity_issued_units}</TableCell>
                    <TableCell align="center">{row.total_quantity_issued_rupees}</TableCell>
                    <TableCell align="center">{row.closing_balance_till_date}</TableCell>
                    <TableCell align="center">{row.stock_remaining}</TableCell>



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
            rowsPerPageOptions={[10, 20, 50]}
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
  {/* Render Other Fields */}
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
      disabled={name === "monthyear"}
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


      <Dialog open={openNewMonth} onClose={handleMonthClose}>
        <DialogTitle>Add New Month Data</DialogTitle>
          <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            views={["year", "month"]}
            label="Month & Year"
            value={monthYear ? dayjs(monthYear, "YYYY-MM") : null}
            onChange={(newValue) => {
              if (newValue) {
                const formattedValue = newValue.format("YYYY-MM");
                setMonthYear(formattedValue);
              }
            }}
            slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
          />

          </LocalizationProvider>
          </DialogContent>
        <DialogActions>
          <Button onClick={handleMonthClose} color="secondary">Cancel</Button>
          <Button onClick={handleMonthSubmit} color="primary" disabled={loading}>
            {loading ? "Processing..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Provisions;
