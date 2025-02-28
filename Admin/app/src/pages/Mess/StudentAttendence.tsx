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
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
  
const ExcelImport: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const { hostel } = useParams<{ hostel: string }>();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [open, setOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Dayjs | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  

 
  interface StudentAttendance {
  id: number;
 
   "Register_No": string,
    "Room_No": number,
    monthyear:string,
    Name: string,
    Course: string,
    Branch: string,
    "Year_of_Study":number,
    "Total_days": number,
    "Present_Days": number,
   "Reduction_Days": number,
    "Adjust_Advance": number,
    "Prev_Month_Fine": number,
     Total: number
}
interface FormFields {
  "Register_no": string;
  "Room_No": number;
  monthyear: string;
  Name: string;
  Course: string;
  Branch: string;
  "Year_of_Study": number;
  "Total_days": number;
  "Present_Days": number;
  "Reduction_Days": number;
  "Adjust_Advance": number;
  "Prev_Month_Fine": number;
  Total: number;
}
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
 const [StudentData, setStudentData] = useState<StudentAttendance[]>([]);
  const [formData, setFormData] = useState<FormFields>({
   "Register_no": "",
    "Room_No": 0,
    monthyear: '',
    Name: '',
    Course: '',
    Branch: '',
    "Year_of_Study":0,
    "Total_days": 0,
    "Present_Days": 0,
    "Reduction_Days": 0,
    "Adjust_Advance": 0,
    "Prev_Month_Fine": 0,
     Total: 0
  });
  const getDialogFields = [
    { label: "Register No", name: "Register_no" },
    { label: "Room No", name: "Room_No",type:"number" },
    { label: "Month/Year", name: "monthyear" },
    { label: "Name", name: "Name" },
    { label: "Course", name: "Course" },
    { label: "Branch", name: "Branch"},
    { label: "Year of Study", name: "Year_of_Study" },
    { label: "Total days", name: "Total_days", type: "number" },
    { label: "Present Days", name: "Present_Days", type: "number" },
    { label: "Reduction Days", name: "Reduction_Days", type: "number" },
    { label: "Adjust Advance", name: "Adjust_Advance", type: "number" },
    { label: "Prev Month Fine", name: "Prev_Month_Fine", type: "number" },
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

  const paginatedData = StudentData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
  const FetchAttendanceData = useCallback(async (hostelType?: string) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from("hoste").select("*").order("id", { ascending: true });
  
      if (hostelType) {
        query = query.eq("hostel", hostelType); // Filter by hostel type
      }
  
      const { data, error } = await query;
  
      if (error) throw error;
  
      setStudentData(data as StudentAttendance[]);
    } catch (error: any) {
      console.error("Error fetching student attendance data:", error.message);
      setError("Error fetching student attendance data");
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Fetch data when component mounts or hostel type changes
  useEffect(() => {
    FetchAttendanceData(hostel || "Girls"); // Default to 'Girls' if undefined
  }, [hostel,FetchAttendanceData]);
  
     

  
  


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
      
    "Register_no": "",
    "Room_No": 0,
    monthyear: '',
    Name: '',
    Course: '',
    Branch: '',
    "Year_of_Study":0,
    "Total_days": 0,
    "Present_Days": 0,
    "Reduction_Days": 0,
    "Adjust_Advance": 0,
    "Prev_Month_Fine": 0,
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
 const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, "").trim();

  // Normalize column names to match database schema
 
// Define required headers without monthyear (since it's added later)
const requiredHeaders = [
  "Register No Unique ID", "Room No", "Name",
  "Course", "Branch", "Year of Study", "Total days", "Present Days",
  "Reduction Days", "Adjust Advance", "Total"
];

// Find header row index dynamically
const headerRowIndex = 0;
const headers = rawRows[headerRowIndex].map((header: string) => header.trim());
console.log("Extracted Headers:", headers);
if (!headers.length) {
  alert("Header row is empty.");
  reject("Header row is empty.");
  return;
}
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
            // Parse data rows
            const columnMapping: Record<string, string> = {
              "Register No Unique ID": "Register_no",
              "Room No": "Room_No",
              "Name": "Name",
              "Course": "Course",
              "Branch": "Branch",
              "Year of Study": "Year_of_Study",
              "Total days": "Total_days",
              "Present Days": "Present_Days",
              "Reduction Days": "Reduction_Days",
              "Adjust Advance": "Adjust_Advance",
              "Prev Month Fine": "Prev_Month_Fine",
              "Total": "Total",
            };
    
            // Function to rename extracted column names to match database column names
            const normalizeColumnNames = (data: Record<string, any>[]) => {
              return data.map(record => {
                const transformedRecord: Record<string, any> = {};
                Object.keys(record).forEach((key) => {
                  const normalizedKey = key.trim();
                  if (columnMapping[normalizedKey]) {
                    transformedRecord[columnMapping[normalizedKey]] = record[key];
                  } else {
                    transformedRecord[normalizedKey] = record[key];
                  }
                });
                return transformedRecord;
              });
            };

            // Apply column name normalization
            const normalizedData = normalizeColumnNames(dataRows);
            console.log("Final Normalized Data:", normalizedData);
    
            resolve(normalizedData);
  
          };
  
          reader.onerror = (error) => {
            console.error("Error during file read:", error);
            reject(error);
          };
          } catch (error) {
      console.error("Error in importExcelData function:", error);
      reject(error);
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
      { key: "Register_no", label: "Register No" },
      { key: "Name", label: "Name" },
       { key: "monthyear", label: "Month/Year" }
    ];
    
    const missing = requiredFields.filter(field => !formData[field.key]);
    
    if (missing.length > 0) {
      const missingLabels = missing.map(field => field.label).join(", ");
      alert(`Please fill in the following fields: ${missingLabels}`);
      return;
    }
    
    if (!formData.Name || !formData["Register_no"] || !formData.monthyear) {
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
      const insertData = { ...formData };
      console.log("Form Data before update:", insertData);
      if (!insertData || Object.keys(insertData).length === 0) {
        console.error("formData is empty or undefined, cannot proceed!");
        return; // Prevent further execution
      }
      Object.keys(insertData).forEach((key) => {
        if (typeof insertData[key] === "undefined") {
          insertData[key] = 0; // or use another appropriate default value
        }
      });
      const { error } = await supabase.from("hoste").insert([insertData]);
      if (error) throw error;
      console.log("New item added successfully!");
    }

    FetchAttendanceData();
    handleDialogClose();
  } catch (error) {
    console.error("Error submitting data:", error);
    alert("Error submitting data. Please try again.");
  }
}   

      
   
     
        
 


const exportToExcel = () => {
  if (!StudentData || StudentData.length === 0) {
    alert("No data available to export!");
    return;
  }
let headers = [
  "S.No",
  "Register No",
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
const excelData = StudentData.map((row, index) => {
  let rowData = [
    page * rowsPerPage + index + 1,
    row["Register_no"],
    row.Name,
    row["Room_No"],
    row.monthyear,
    row.Course,
    row.Branch,
    row["Year_of_Study"],
    row["Total_days"],
    row["Present_Days"],
    row["Reduction-Days"],
    row["Adjust_Advance"],
    row["Prev_Month_Fine"],
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
          <div className="flex items-center mt-8 mb-2">
        <Link to={`/manage-mess/${hostel === 'Boys' ? 'Boys' : 'Girls'}`}><ArrowBack className="text-primary cursor-pointer" /></Link>
        <span className="ml-2 text-primary text-xl font-bold">Attendance</span>
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
<LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker
      views={["year", "month"]} // Only show month & year
      label="Select Month"
      value={selectedDate}
      onChange={(newValue) => setSelectedDate(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          variant="outlined"
          sx={{
            width: "180px",
            backgroundColor: "white",
            borderRadius: "10px",
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: <CalendarMonthIcon sx={{ marginRight: 1 }} />, // Add calendar icon
          }}
        />
      )}
    />
  </LocalizationProvider>


         

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
        <Box sx={{ maxHeight: "70vh", maxWidth: '1200px', overflowX: "auto" }}>
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
                {["Action","S.No", "Register NO","Name","Room No", "Month Year","Course","Branch",
                "Year of Study","Total days","Present Days","Reduction Days","Adjust Advance","Prev Month Fine","Total"]
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
                   <IconButton color="primary" onClick={() => handleDialogOpen(row)}>
                      <EditIcon />
                    </IconButton>
                  <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell align="center">{row["Register_no"]}</TableCell>
                  <TableCell align="center">{row.Name}</TableCell>
                  <TableCell align="center">{row["Room_No"]}</TableCell>
                  <TableCell align="center">{row.monthyear}</TableCell>
                 
                  <TableCell align="center">{row.Course}</TableCell>
                  <TableCell align="center">{row.Branch}</TableCell>
                  <TableCell align="center">{row["Year_of_Study"]}</TableCell>
                  <TableCell align="center">{row["Total_days"]}</TableCell>
                  <TableCell align="center">{row["Present_Days"]}</TableCell>
                  <TableCell align="center">{row["Reduction_Days"]}</TableCell>
                  <TableCell align="center">{row["Adjust_Advance"]}</TableCell>
                  <TableCell align="center">{row["Prev_Month_Fine"]}</TableCell>
                  <TableCell align="center">{row.Total}</TableCell>
                  <TableCell align="center">
                   
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
          count={StudentData.length}
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
    disabled={name=="monthyear"}
   
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