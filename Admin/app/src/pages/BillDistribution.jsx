import React, { useState, useCallback, useEffect } from "react";
import { Box, Button, Card, Grid, TextField, MenuItem, Select, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import GroceryIcon from "../assets/grocery-Icon.png";
import EggIcon from "../assets/egg-Icon.png";
import VegetableIcon from "../assets/vegetables-Icon.png";
import GasIcon from "../assets/gas-Icon.png";
import MilkImage from "../assets/milk-Icon.png";
import StaffSalaryIcon from "../assets/staffSalary-Icon.png";
import DivisionIcon from "../assets/division-Icon.png";
import PeopleIcon from "@mui/icons-material/People";
import  supabase  from "../supabaseClient";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ArrowBack from "@mui/icons-material/ArrowBack";

const BillDistribution = () => {
  const [items, setItems] = useState([
    { name: "GROCERIES ISSUED", icon: GroceryIcon, amount: 0, shadowColor: "#d4af37"},
    { name: "VEGETABLES", icon: VegetableIcon, amount: 0, shadowColor: "#4caf50" },
    { name: "EGG", icon: EggIcon, amount: 0, shadowColor: "#ffcc80" },
    { name: "MILK", icon: MilkImage, amount: 0, shadowColor: "#64b5f6" },
    { name: "GAS", icon: GasIcon, amount: 0, shadowColor: "#e57373" },
    { name: "STAFF SALARY", icon: StaffSalaryIcon, amount: 0, shadowColor: "#7986cb" },
  ]);

  const { hostel } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditingFoodWaste, setIsEditingFoodWaste] = useState(false);
  const [isEditingOtherWaste, setIsEditingOtherWaste] = useState(false);
  const [foodWaste, setFoodWaste] = useState(0);
  const [otherAmount, setOtherAmount] = useState(0);
  const [isOtherAdded, setIsOtherAdded] = useState(false);
  const [open, setOpen] = useState(false);
  const [distributeOpen, setDistributeOpen] = useState(false);
  const [studentHeadcounts, setStudentHeadcounts] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const totalSummation = items.reduce((sum, item) => sum + item.amount, 0);
  const netAmount = totalSummation - foodWaste - (isOtherAdded ? otherAmount : 0);
  const perDayAmount = netAmount / studentHeadcounts;

  const generateMonthOptions = () => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const currentYear = new Date().getFullYear();
    let options = [];

    for (let year = currentYear - 1; year <= currentYear + 1; year++) {
      for (let month = 0; month < 12; month++) {
        const value = `${year}-${String(month + 1).padStart(2, "0")}`;
        const label = `${months[month]} ${year}`;
        options.push({ value, label });
      }
    }

    return options;
  };


  const fetchBillData = useCallback(async () => {
    if (!selectedDate) return;

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching data for:", selectedDate);

      const { data: consumeddata, error: error1 } = await supabase
        .from("consumedgrocery")
        .select("total_cost")
        .eq("hostel", hostel)
        .eq("monthyear", selectedDate);

      if (error1) throw error1;

      // Fetch Vegetable Data
      const { data: vegtabledata, error: error2 } = await supabase
        .from("vegetables")
        .select("TotalCost")
        .eq("hostel", hostel)
        .eq("monthyear", selectedDate);

      if (error2) throw error2;
      function getNextMonth(ym) {
        let [year, month] = ym.split("-").map(Number);
        month += 1;
        if (month > 12) {  // Handle December -> January transition
          month = 1;
          year += 1;
        }
        return `${year}-${String(month).padStart(2, "0")}`;  // Format as YYYY-MM
      }
      // Fetch Egg Data
      const { data: eggdata, error: error3 } = await supabase
  .from("egg")
  .select("TotalCost")
  .eq("hostel", hostel)
  .gte("DateOfConsumed", `${selectedDate}-01`)
  .lt("DateOfConsumed", `${getNextMonth(selectedDate)}-01`);

      if (error3) throw error3;

      // Fetch Milk Data
      const { data: milkdata, error: error4 } = await supabase
        .from("milk")
        .select("TotalCost")
        .eq("hostel", hostel)
        .gte("DateOfConsumed", `${selectedDate}-01`)
        .lt("DateOfConsumed", `${getNextMonth(selectedDate)}-01`);

      if (error4) throw error4;

      // Fetch Staff Salary
      const { data: staffdata, error: error5 } = await supabase
        .from("staffsalary")
        .select("SalaryAmount")
        .eq("hostel", hostel)
        .gte("DateOfIssued", `${selectedDate}-01`)
        .lt("DateOfIssued", `${getNextMonth(selectedDate)}-01`);

      if (error5) throw error5;

      const { data: gasdata, error: error6 } = await supabase
      .from("gas")
      .select("TotalAmount")
      .eq("hostel", hostel)
      .gte("DateOfConsumed", `${selectedDate}-01`)
      .lt("DateOfConsumed", `${getNextMonth(selectedDate)}-01`);

    if (error6) throw error6;

    const { data: studentsdata, error: error7 } = await supabase
    .from("hoste")
    .select("Present_Days")
    .eq("hostel", hostel)
    .eq("monthyear", selectedDate);


  if (error7) throw error7;

      // ✅ Extract total costs safely
      const totalGroceryCost = consumeddata?.reduce((sum, row) => sum + parseInt(row.total_cost || 0), 0) || 0;
      const totalVegetableCost = vegtabledata?.reduce((sum, row) => sum + parseInt(row.TotalCost || 0), 0) || 0;
      const totalEggCost = Array.isArray(eggdata) ? eggdata.reduce((sum, row) => sum + row.TotalCost, 0) : 0;
      const totalGasCost = Array.isArray(gasdata) ? gasdata.reduce((sum, row) => sum + row.TotalAmount, 0) : 0;
      const totalMilkCost = milkdata?.reduce((sum, row) => sum + parseInt(row.TotalCost || 0), 0) || 0;
      const totalStaffCost = staffdata?.reduce((sum, row) => sum + parseInt(row.SalaryAmount || 0), 0) || 0;
      const totalHeadcounts = studentsdata?.reduce((sum, row) => sum + parseInt(row.Present_Days || 0), 0) || 0;

      // ✅ Update the UI amounts
      setItems((prevItems) =>
        prevItems.map((item) => {
          if (item.name === "GROCERIES ISSUED") return { ...item, amount: totalGroceryCost };
          if (item.name === "VEGETABLES") return { ...item, amount: totalVegetableCost };
          if (item.name === "EGG") return { ...item, amount: totalEggCost };
          if (item.name === "MILK") return { ...item, amount: totalMilkCost };
          if (item.name === "STAFF SALARY") return { ...item, amount: totalStaffCost };
          if (item.name === "GAS") return { ...item, amount: totalGasCost };
          return item;
        })
      );
      setStudentHeadcounts(totalHeadcounts)
    } catch (error) {
      console.error("Error fetching bill data:", error.message);
      setError("Error fetching bill data");
    } finally {
      setLoading(false);
    }
  }, [selectedDate, hostel]); // ✅ Now depends on `selectedDate`

  // 🔹 Re-run fetchBillData when selectedDate changes
  useEffect(() => {
    fetchBillData();
  }, [fetchBillData]);


  useEffect(() => {
    const defaultDate = new Date().toISOString().slice(0, 7); // Set default to YYYY-MM
    setSelectedDate(defaultDate);
  }, []);


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClickOpen = () => {
    setDistributeOpen(true);
  };

  const handleClickClose = () => {
    setDistributeOpen(false);
  };


  const handleAddOrEditOther = () => {
    setIsOtherAdded(true);
    handleClose();
  };

  const handleDistribute = async () => {
    try {
        // Prepare data for insertion
        const messBillData = {
            monthyear: selectedDate, // Format YYYY-MM
            hostel: hostel,
            grocery_issued_total: items.find(item => item.name === "GROCERIES ISSUED")?.amount || 0,
            vegetables_total: items.find(item => item.name === "VEGETABLES")?.amount || 0,
            egg_total: items.find(item => item.name === "EGG")?.amount || 0,
            milk_total: items.find(item => item.name === "MILK")?.amount || 0,
            gas_total: items.find(item => item.name === "GAS")?.amount || 0,
            staff_salary_total: items.find(item => item.name === "STAFF SALARY")?.amount || 0,
            students_head_count: studentHeadcounts || 0,
            reduction_total: (foodWaste || 0) + (otherAmount || 0),
            per_day_amount: Number(perDayAmount.toFixed(2)) || 0, // Ensure it's a number
        };

        console.log("Fetching data from hoste table...");

        // Fetch all students' Present_Days, Adjust_Advance, and Prev_Month_Fine
        const { data: hosteData, error: fetchError } = await supabase
            .from("hoste")
            .select("id, Present_Days, Adjust_Advance, Prev_Month_Fine") // Fetching id as well
            .eq("hostel", hostel)
            .eq("monthyear", selectedDate);

        if (fetchError) {
            console.error("Error getting students data:", fetchError.message);
            return;
        }

        if (!hosteData || hosteData.length === 0) {
            console.error("No data found in hoste table for the given month and hostel.");
            alert("No records found for the selected month and hostel.");
            return;
        }

        console.log("Inserting Mess Bill Data:", messBillData);

        // Insert data into Supabase
        const { error: insertError } = await supabase
            .from("messbill")
            .insert([messBillData]);

        if (insertError) {
            console.error("Error inserting mess bill:", insertError.message);
            alert("Failed to distribute mess bill. Please try again.");
            return;
        }

        console.log("Mess bill inserted successfully!");
        alert("Mess bill distributed successfully!");

        // **Update Total for each student separately**
        for (const student of hosteData) {
            const presentDays = Number(student.Present_Days) || 0;
            const adjustAdvance = Number(student.Adjust_Advance) || 0;
            const prevMonthFine = Number(student.Prev_Month_Fine) || 0;
            const totalAmount = (presentDays * Number(perDayAmount)) - adjustAdvance + prevMonthFine;

            console.log(`Updating student ID ${student.id} with Total: ${totalAmount}`);

            const { error: updateError } = await supabase
                .from("hoste")
                .update({ Total: totalAmount.toFixed(2) }) // ✅ Directly set calculated value
                .eq("id", student.id); // ✅ Updating each student separately

            if (updateError) {
                console.error(`Error updating student ID ${student.id}:`, updateError.message);
            }
        }

        console.log("All student records updated successfully!");
        alert("Hoste table updated successfully!");

    } catch (error) {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred.");
    }
};



  return (
    <Box className="dark:text-gray-200" sx={{ p: 10, paddingTop: 1, textAlign: "center" }}>
      <Typography className="dark:text-gray-200" variant="h5" color="purple" fontWeight={600} gutterBottom>
        BILL DISTRIBUTION - {hostel} Hostel
      </Typography>
      <div className="flex items-center mt-8 mb-2">
        <Link to={`/manage-mess/${hostel === 'Boys' ? 'Boys' : 'Girls'}`}><ArrowBack className="text-primary cursor-pointer dark:text-gray-200" /></Link>
        <span className="ml-2 text-primary text-xl font-bold dark:text-gray-200">Back</span>
      </div>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
      <Select
      className="dark:bg-gray-700 dark:text-gray-200"
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
      sx={{ bgcolor: "#fff" }}
    >
      {generateMonthOptions().map(({ value, label }) => (
        <MenuItem key={value} value={value}>{label}</MenuItem>
      ))}
    </Select>
      </Box>

      <Card  className='dark:bg-gray-700 dark:text-gray-200' sx={{ p: 2, bgcolor: "#fff", borderRadius: 2, boxShadow: "0px 4px 8px green", mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" fontWeight={600}>Summation</Typography>
          <Typography className="dark:bg-gray-200 dark:rounded dark:p-1" variant="h6" fontWeight={600} color="green">
            + <span style={{ color: "green" }}>₹</span> {totalSummation}
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {items.map((item, index) => (
            <Grid item xs={6} md={4} key={index}>
              <Card className='dark:bg-gray-700 dark:text-gray-200' variant="outlined" sx={{ p: 2, bgcolor: "#ffffff", borderRadius: 2, boxShadow: `0px 4px 8px ${item.shadowColor}`, margin: "10px" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="h6" fontWeight= "Medium" color="purple" className="dark:text-gray-200" >{item.name}</Typography>
                  <img src={item.icon} alt={item.name} style={{ width: 35, height: 35 }} />
                </Box>
                <Typography className="dark:text-gray-200" variant="h5" fontWeight={600} color="text.secondary" sx={{ textAlign: "left", mt: 1 }}>
                  <span style={{ color: "purple"}}>₹</span> {item.amount}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Card>

  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
    <Card className='dark:bg-gray-700 dark:text-gray-200' sx={{ p: 3, width: "48%", boxShadow: "0px 4px 8px red", background: "#fff" }}>
  <Typography variant="h5" fontWeight={700} display="flex" justifyContent="space-between">
    <span>Reduction</span>
    <span className="dark:bg-gray-200 dark:rounded dark:p-1" style={{ color: "red" }}>- ₹{foodWaste + (isOtherAdded ? otherAmount : 0)}</span>
  </Typography>

  {/* Food Waste - Click to Edit */}
  <Box sx={{ display: "flex", alignItems: "center", mt: 3, justifyContent: "space-between" }}>
    <Typography className="dark:text-gray-200" variant="h6" fontWeight={500} sx={{ color: "purple" }}>Food Waste:</Typography>
    {isEditingFoodWaste ? (
      <TextField
        type="number"
        value={foodWaste}
        onChange={(e) => setFoodWaste(Number(e.target.value))}
        onBlur={() => setIsEditingFoodWaste(false)}
        autoFocus
        className='dark:bg-gray-100'
        sx={{ width: "120px", fontSize: "1.2rem" }}
      />
    ) : (
      <Typography
       className="dark:text-gray-200"
        variant="h5"
        fontWeight={700}
        sx={{ textDecoration: "underline", cursor: "pointer", color: "black" }}
        onClick={() => setIsEditingFoodWaste(true)}
      >
        ₹ {foodWaste}
      </Typography>
    )}
  </Box>

  {/* Other Waste - Click to Edit */}
  {isOtherAdded && (
    <Box sx={{ display: "flex", alignItems: "center", mt: 2, justifyContent: "space-between" }}>
      <Typography className="dark:text-gray-200" variant="h6" fontWeight={500} sx={{ color: "purple" }}>Other Reduction:</Typography>
      {isEditingOtherWaste ? (
        <TextField
          type="number"
          value={otherAmount}
          onChange={(e) => setOtherAmount(Number(e.target.value))}
          onBlur={() => setIsEditingOtherWaste(false)}
          autoFocus
          className='dark:bg-gray-100'
          sx={{ width: "120px", fontSize: "1.2rem", color: 'black' }}
        />
      ) : (
        <Typography
          className="dark:text-gray-200"
          variant="h5"
          fontWeight={700}
          sx={{ textDecoration: "underline", cursor: "pointer", color: "black" }}
          onClick={() => setIsEditingOtherWaste(true)}
        >
          ₹ {otherAmount}
        </Typography>
      )}
    </Box>
  )}

  <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mt: 3 }}>
    {isOtherAdded ? "Edit Other" : "Add Other"}
  </Button>
</Card>





    <Card  className='dark:bg-gray-700 dark:text-gray-200' sx={{ p: 2, width: "48%", bgcolor: "#fff", borderRadius: 2, boxShadow: "0px 4px 8px blue" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" fontWeight={600}>Distribution</Typography>
            <Box className="dark:bg-gray-200 dark:rounded dark:p-1" sx={{ display: "flex", alignItems: "center", gap: 1, color: "blue" }}>
              <img src={DivisionIcon} alt="Division" style={{ width: 15, height: 15}} />
              <Typography variant="h6" fontWeight={600}>{studentHeadcounts}</Typography>
            </Box>
        </Box>
      <Card className='dark:bg-gray-700 dark:text-gray-200' variant="outlined" sx={{ mt: 3, p: 2, width: "80%", marginLeft: "10%", height:"60%", borderRadius: 2, boxShadow: "0px 4px 8px purple" }}>
            <Typography className="dark:text-gray-200" color="purple" sx={{ display: "flex", justifyContent: "space-between", fontWeight: 500 }}>
              STUDENT HEADCOUNTS <PeopleIcon />
            </Typography>
            <Typography className="dark:text-gray-200" variant="h5" fontWeight={600} sx={{ margin:"5%"}} color="text.secondary">{studentHeadcounts}</Typography>
          </Card>
      </Card>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, alignItems: "center" }}>
        <Typography variant="subtitle2" sx={{ marginTop:"10px", height: "4%", color: "green", bgcolor: "#e6ffe6", p: 1, borderRadius: 1 }}>
          Per day Amount : <span style={{ color: "green" }}>₹</span> {perDayAmount.toFixed(2)}
        </Typography>
        <Button
  variant="contained"
  color="error"
  sx={{ fontSize: "1rem",marginTop:"10px", height: "4%"}}
  onClick={handleClickOpen}
>
  Distribute To All Students
</Button>
      </Box>




      <Dialog open={open} onClose={handleClose}>
        <DialogTitle className="dark:text-gray-200">{isOtherAdded ? "Edit Other Reduction" : "Add Other Reduction"}</DialogTitle>
        <DialogContent>
          <TextField fullWidth type="number" label="Other Reduction Amount" value={otherAmount} onChange={(e) => setOtherAmount(Number(e.target.value))} sx={{ mt: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">Cancel</Button>
          <Button onClick={handleAddOrEditOther} color="primary">{isOtherAdded ? "Save" : "Add"}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={distributeOpen} onClose={handleClickClose}>
        <DialogTitle>Mess Bill Distribution</DialogTitle>
        <DialogContent>
  <Typography variant="h6">Summation</Typography>
  {items.map((item, index) => (
    <Typography key={index}>
      {item.name}: ₹{item.amount}
    </Typography>
  ))}

  <Typography variant="h6" sx={{ mt: 2 }}>Reduction</Typography>
  <Typography>Food Waste: ₹{foodWaste}</Typography>
  <Typography>Others: ₹{otherAmount}</Typography>

  <Typography variant="h6" sx={{ mt: 2 }}>Distribution</Typography>
  <Typography>Total Headcount: {studentHeadcounts}</Typography>
  <Typography>Per Day Amount: ₹{perDayAmount.toFixed(2)}</Typography>
</DialogContent>


        <DialogActions>
          <Button onClick={handleClickClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleDistribute();
              handleClickClose();
            }}
            color="primary"
            variant="contained"
          >
            Distribute
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BillDistribution;
