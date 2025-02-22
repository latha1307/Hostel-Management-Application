import React, { useState, useEffect,useCallback } from "react";
import supabase from "../../supabaseClient";
import * as XLSX from "xlsx";
import { Link } from 'react-router-dom';
import  saveAs from "file-saver";
import { Dayjs } from "dayjs";
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
import dayjs from "dayjs";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { GrDocumentExcel } from "react-icons/gr";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useParams } from "react-router-dom";
import ArrowBack from "@mui/icons-material/ArrowBack";

  
const ExcelImport: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const { hostel } = useParams<{ hostel: string }>();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [open, setOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Dayjs | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  

 
  interface InventoryItem {
  id: number;
 
   "Register No  Unique Id": string,
    "Room No": number,
    monthyear:string,
    Name: string,
    Course: string,
    Branch: string,
    "Year of Study":number,
    "Total days": number,
    "Present Days": number,
   "Reduction Days": number,
    "Adjust Advance": number,
    "Prev Month Fine": number,
     Total: number
}
interface FormFields {
  "Register No  Unique ID": string;
  "Room No": number;
  monthyear: string;
  Name: string;
  Course: string;
  Branch: string;
  "Year of Study": number;
  "Total days": number;
  "Present Days": number;
  "Reduction Days": number;
  "Adjust Advance": number;
  "Prev Month Fine": number;
  Total: number;
}
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
 const [groceriesData, setGroceriesData] = useState<InventoryItem[]>([]);
  const [formData, setFormData] = useState<FormFields>({
   "Register No  Unique ID": "",
    "Room No": 0,
    monthyear: '',
    Name: '',
    Course: '',
    Branch: '',
    "Year of Study":0,
    "Total days": 0,
    "Present Days": 0,
    "Reduction Days": 0,
    "Adjust Advance": 0,
    "Prev Month Fine": 0,
     Total: 0
  });
  const getDialogFields = [
    { label: "Register No", name: "Register No  Unique ID" },
    { label: "Room No", name: "Room No",type:"number" },
    { label: "Month/Year", name: "monthyear" },
    { label: "Name", name: "Name" },
    { label: "Course", name: "Course" },
    { label: "Branch", name: "Branch"},
    { label: "Year of Study", name: "Year of Study" },
    { label: "Total days", name: "Total  days", type: "number" },
    { label: "Present Days", name: "Present Days", type: "number" },
    { label: "Reduction Days", name: "Reduction Days", type: "number" },
    { label: "Adjust Advance", name: "Adjust Advance", type: "number" },
    { label: "Prev Month Fine", name: "Prev Month Fine", type: "number" },
    { label: "Total", name: "Total" ,type:"number"},
  ];
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // Convert table data into an array format
   // Define column headers
   
  const handleDialogOpen = (data: any = null) => {
    setIsEditing(!!data);
    if (data) {
      setEditId(data.id);
    }
    setFormData(data || {}); // If data is passed, prefill the form; otherwise, use an empty object.
    setOpenDialog(true); // This sets the openDialog state to true, which makes the dialog visible.
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

const handleSearch = (event) => {
  setSearchQuery(event.target.value);
};

  const filteredData = paginatedData.filter((row) =>
    Object.values(row).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  const fetchGroceriesData = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
    const { data, error } = await supabase
      .from("hoste")
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


  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);
  const handlemonth = () => {
    setSelectedDate(tempDate); // Confirm selection
    setFormData((prev) => ({ ...prev, monthyear: tempDate?.format("YYYY-MM") || "" }));
    alert("Successfully selected"); // Show success message
    handleCloseDialog(); // Close dialog
  };
    const handleDialogClose = () => {
    setOpenDialog(false);
    setFormData({
      
    "Register No  Unique ID": "",
    "Room No": 0,
    monthyear: '',
    Name: '',
    Course: '',
    Branch: '',
    "Year of Study":0,
    "Total  days": 0,
    "Present Days": 0,
    "Reduction Days": 0,
    "Adjust Advance": 0,
    "Prev Month Fine": 0,
     Total: 0
    });
    setIsEditing(false);
    setEditId(null);
  };
  const importExcelData = (): Promise<Record<string, any>[]> => {
    return new Promise((resolve, reject) => {
      try {
       

        const reader = new FileReader();
        console.log("Starting file read...");
        reader.readAsArrayBuffer(file);

        reader.onload = async (e) => {
          if (!e.target?.result) {
            alert("Failed to read file.");
            reject("Failed to read file.");
            return;
          }
          console.log("File read successfully");
          const buffer = e.target.result as ArrayBuffer;
          const workbook = XLSX.read(buffer, { type: "array" });
          console.log("Workbook parsed", workbook);
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];

          // Extract raw rows to detect headers
          const rawRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          console.log("Raw rows extracted:", rawRows);
          if (rawRows.length === 0) {
            alert("Excel file is empty.");
            reject("Excel file is empty.");
            return;
          }
 // Define normalization function
const normalize = (str: string) => str.trim().toLowerCase().replace(/\s+/g, " ");

// Define required headers without monthyear (since it's added later)
const requiredHeaders = [
  "Register No Unique ID", "Room No", "Name",
  "Course", "Branch", "Year of Study", "Total days", "Present Days",
  "Reduction Days", "Adjust Advance", "Total"
];

// Find header row index dynamically
const headerRowIndex = rawRows.findIndex(row => 
  row.some((cell: any) => typeof cell === "string" && 
    normalize(cell).includes("register no unique id")
  )
);

if (headerRowIndex === -1) {
  alert("Header row not found.");
  reject("Header row not found.");
  return;
}

const headers = rawRows[headerRowIndex].map((header: string) => header.trim());
console.log("Extracted Headers:", headers);
if (headers.length > 12) {
  headers[12] = "Prev Month Fine";
}
// Normalize extracted headers and required headers for comparison
const normalizedExtracted = headers.map(normalize);
const normalizedRequired = requiredHeaders.map(normalize);

const missingHeaders = normalizedRequired.filter(h => !normalizedExtracted.includes(h));
if (missingHeaders.length > 0) {
  alert(`Missing headers: ${missingHeaders.join(", ")}`);
  reject(`Missing headers: ${missingHeaders.join(", ")}`);
  return;
}

          
        
          

          // Parse data rows
          const dataRows = XLSX.utils.sheet_to_json(worksheet, {
            header: headers,
            range: headerRowIndex + 1
          });

          console.log("Final Processed Records:", dataRows);
          resolve(dataRows);
        };

        reader.onerror = (error) => reject(error);
      } catch (err) {
        console.error("Error during import:", err);
        reject(err);
      }
    });
  };
const handleSubmit = async (
 
) => {
  // Make sure a file is selected
  console.log("handleSubmit triggered");
 
  if (!selectedDate) {
    alert("Please select a month and year.");
    return;
  }
  console.log("working triggered");
  
  const formattedDate = selectedDate.format("YYYY-MM");
  try {
    const excelData = await importExcelData();
    console.log("Excel data imported:", excelData);
    if (!excelData.length) {
      alert("No data imported from Excel.");
      return;
    }

    // Define keys to remove (normalized)
    const keysToRemove = ["s.no", "reg & page no."];
    console.log("Hostel value before insert:", hostel);

    // Remove unwanted keys and add the monthyear field
    const recordsWithMonthYear = excelData.map(record => {
      const filteredRecord = Object.keys(record).reduce((acc, key) => {
        // Normalize the key: trim, lowercase, and collapse multiple spaces.
        const normalizedKey = key.trim().toLowerCase().replace(/\s+/g, " ");
        // Only add the key if it's not one of the unwanted keys.
        if (!keysToRemove.includes(normalizedKey)) {
          acc[key] = record[key];
        }
        return acc;
      }, {} as Record<string, any>);

      return {
        ...filteredRecord,
        monthyear: formattedDate,
        hostel,
      };
    });
 console.log("Final array to db:",recordsWithMonthYear);
    const { error } = await supabase.from("hoste").insert(recordsWithMonthYear);
    if (error) {
      console.error("Error inserting data:", error);
      alert("Error uploading data to Supabase.");
    } else {
      alert("Data imported successfully!");
      handleCloseDialog();
    }
  } catch (error) {
    console.error("Error processing data:", error);
  }
};
const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  if (event.target.files?.length > 0) {
    const uploadedFile = event.target.files[0];
    console.log("File selected:", uploadedFile);
    setFile(uploadedFile);
    handleSubmit(); // Trigger file submission
  }
};
useEffect(() => {
  if (file) {
    handleSubmit(file); // Pass file here if needed
  }
}, [file]);
const handleupdate= async () => {
  try {
    const requiredFields = [
      { key: "Register No  Unique ID", label: "Register No" },
      { key: "Name", label: "Name" },
       { key: "monthyear", label: "Month/Year" }
    ];
    
    const missing = requiredFields.filter(field => !formData[field.key]);
    
    if (missing.length > 0) {
      const missingLabels = missing.map(field => field.label).join(", ");
      alert(`Please fill in the following fields: ${missingLabels}`);
      return;
    }
    
    if (!formData.Name || !formData["Register No  Unique ID"] || !formData.monthyear) {
      alert("Please fill in all required fields.");
      return;
    }

    if (isEditing) {

      const { data: existingData, error: fetchError } = await supabase
        .from("hoste")
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
        const { error } = await supabase.from("hoste").update(updateData).eq("id", editId);
        if (error) {
          console.error("Error updating item:", error);
          throw error;
        }
        console.log("Item updated successfully!");
      } else {
        console.log("No changes detected, skipping update.");
      }
    } else {

      const { error } = await supabase.from("hoste").insert([formData]);
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
const exportToExcel = () => {
  if (!groceriesData || groceriesData.length === 0) {
    alert("No data available to export!");
    return;
  }
let headers = [
  "S.No",
  "Name",
  "Room No",
  "Month Year",
  "Course",
  "Branch",
  "Year of Study",
  "Total  days",
  "Present Days",
  "Reduction Days",
  "Adjust Advance",
  "Prev Month Fine",
  "Total",
];
const excelData = groceriesData.map((row, index) => {
  let rowData = [
    page * rowsPerPage + index + 1,
    row.Name,
    row["Room No"],
    row.monthyear,
    row.Course,
    row.Branch,
    row["Year of Study"],
    row["Total  days"],
    row["Present Days"],
    row["Reduction Days"],
    row["Adjust Advance"],
    row["Prev Month Fine"],
    row.Total,
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

saveAs(dataBlob, "Attendence.xlsx");
};


return (
  <div className="max-h-screen bg-pageBg p-1 -mt-10 max-w-screen">
    <div className="flex items-center mb-4">
      <ArrowBack className="text-primary cursor-pointer" />
      <span className="ml-2 text-primary text-xl font-bold"> Attendance</span>
    </div>
    <div className="text-sm mb-4">
          <Link to={`/manage-mess/${hostel === 'Boys' ? 'Boys' : 'Girls'}`}>{hostel === 'Boys' ? 'Boys' : 'Girls'} Hostel</Link> &gt; Attendence
      </div>
    <div className='flex space-x-3 m-3 -ml-0'>
    <Button
          variant="contained"
          size="small"
          startIcon={<GrDocumentExcel size={18} />}
          onClick={exportToExcel}
          sx={{
            backgroundColor: "#D81B60",
            color: "white",
            "&:hover": { backgroundColor: "#C2185B" },
          }}
        >
          Export
        </Button>

        {/* Import from Excel Button */}
        <label htmlFor="import-excel">
          <Input type="file" id="import-excel" style={{ display: "none" }} onChange={handleFileChange} 
           />
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


    
          <TextField
                    type="date"
                    label="Select Date"
                    value={selectedDate ? selectedDate.format("YYYY-MM-DD") : ""}
                       onChange={(e) => setSelectedDate(dayjs(e.target.value))}
                    variant="outlined"
                    size="small"
                    sx={{
                      width: "180px",
                      backgroundColor: "white",
                      borderRadius: "10px",
                    }}
                    InputLabelProps={{ shrink: true }}
                    disabled
                  />


      </Box>

      {/* Add Item Button */}
      <Button
        variant="contained"
        size="small"
        startIcon={<AddCircleOutlineIcon />}
        onClick={handleDialogOpen}
        sx={{
          backgroundColor: "#5D4037",
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
        <Box sx={{ maxHeight: "70vh", maxWidth: '1180px', overflowX: "auto" }}>
        <TableContainer
          sx={{
            maxHeight: "60vh",
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
              <TableRow sx={{ backgroundColor:"#F57F17", position: "sticky", top: 0, zIndex: 1, whiteSpace: "nowrap" }}>
                {["S.No", "Register NO  Unique Id","Name","Room No", "Month Year","Course","Branch",
                "Year of Study","Total days","Present Days","Reduction Days","Adjust Advance","Prev Month Fine","Total","Action"]
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
                  <TableCell align="center">{row["Register No  Unique ID"]}</TableCell>
                  <TableCell align="center">{row.Name}</TableCell>
                  <TableCell align="center">{row["Room No"]}</TableCell>
                  <TableCell align="center">{row.monthyear}</TableCell>
                 
                  <TableCell align="center">{row.Course}</TableCell>
                  <TableCell align="center">{row.Branch}</TableCell>
                  <TableCell align="center">{row["Year of Study"]}</TableCell>
                  <TableCell align="center">{row["Total  days"]}</TableCell>
                  <TableCell align="center">{row["Present Days"]}</TableCell>
                  <TableCell align="center">{row["Reduction Days"]}</TableCell>
                  <TableCell align="center">{row["Adjust Advance"]}</TableCell>
                  <TableCell align="center">{row["Prev Month Fine"]}</TableCell>
                  <TableCell align="center">{row.Total}</TableCell>
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
          <Button onClick={handleupdate} color="primary">
            {isEditing ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>


<Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Select Month & Year</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker views={["year", "month"]} label="Month & Year" value={tempDate}
            onChange={(newValue) => setTempDate(newValue)} />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handlemonth} variant="contained" disabled={!tempDate}>Submit</Button>
        </DialogActions>
      </Dialog>    
        
  </div>
);
};
export default ExcelImport;
