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

const BillDistribution = () => {
  const [items, setItems] = useState([
    { name: "GROCERIES ISSUED", icon: GroceryIcon, amount: 0, shadowColor: "#d4af37"},
    { name: "VEGETABLES", icon: VegetableIcon, amount: 0, shadowColor: "#4caf50" },
    { name: "EGG", icon: EggIcon, amount: 0, shadowColor: "#ffcc80" },
    { name: "MILK", icon: MilkImage, amount: 0, shadowColor: "#64b5f6" },
    { name: "GAS", icon: GasIcon, amount: 84307, shadowColor: "#e57373" },
    { name: "STAFF", icon: StaffSalaryIcon, amount: 0, shadowColor: "#7986cb" },
  ]);

  const { hostel } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditingFoodWaste, setIsEditingFoodWaste] = useState(false);
  const [isEditingOtherWaste, setIsEditingOtherWaste] = useState(false);
  const [foodWaste, setFoodWaste] = useState(0);
  const [otherAmount, setOtherAmount] = useState(0);
  const [groceryAmount, setGroceryAmount] = useState(0);
  const [isOtherAdded, setIsOtherAdded] = useState(false);
  const [open, setOpen] = useState(false);
  const [studentHeadcounts] = useState(7784);
  const [selectedDate, setSelectedDate] = useState("December 2024");
  const totalSummation = items.reduce((sum, item) => sum + item.amount, 0);
  const netAmount = totalSummation - foodWaste - (isOtherAdded ? otherAmount : 0);
  const perDayAmount = netAmount / studentHeadcounts;


  const fetchBillData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch consumed grocery data
      const { data: consumeddata, error: error1 } = await supabase
        .from("consumedgrocery")
        .select("total_cost")
        .eq("hostel", hostel);

      if (error1) throw error1;

      // Fetch vegetable data
      const { data: vegtabledata, error: error2 } = await supabase
        .from("vegetables")
        .select("TotalCost")
        .eq("hostel", hostel);

      if (error2) throw error2;

      const { data: eggdata, error: error3 } = await supabase
        .from("egg")
        .select("TotalCost")
        .eq("hostel", hostel);

      if (error3) throw error3;

      const { data: milkdata, error: error4 } = await supabase
        .from("milk")
        .select("TotalCost")
        .eq("hostel", hostel);

      if (error4) throw error4;

      const { data: staffdata, error: error5 } = await supabase
      .from("staffsalary")
      .select("SalaryAmount")
      .eq("hostel", hostel);

    if (error5) throw error5;

      // ✅ Extract total costs
      const totalGroceryCost = consumeddata.reduce((sum, row) => parseInt(sum + row.total_cost), 0);
      const totalVegetableCost = vegtabledata.reduce((sum, row) => sum + row.TotalCost, 0);
      const totalEggCost = eggdata.reduce((sum, row) => sum + row.TotalCost, 0);
      const totalMilkCost = milkdata.reduce((sum, row) => sum + row.TotalCost, 0);
      const totalStaffCost = staffdata.reduce((sum, row) => sum + row.SalaryAmount, 0);

      // ✅ Update the amounts
      setGroceryAmount(totalGroceryCost);

      setItems((prevItems) =>
        prevItems.map((item) => {
          if (item.name === "GROCERIES ISSUED") return { ...item, amount: totalGroceryCost };
          if (item.name === "VEGETABLES") return { ...item, amount: totalVegetableCost };
          if (item.name === "EGG") return { ...item, amount: totalEggCost };
          if (item.name === "MILK") return { ...item, amount: totalMilkCost };
          if (item.name === "STAFF") return { ...item, amount: totalStaffCost };
          return item;
        })
      );
    } catch (error) {
      console.error("Error fetching bill data:", error.message);
      setError("Error fetching bill data");
    } finally {
      setLoading(false);
    }
  }, [hostel]);


  useEffect(() => {
    fetchBillData();
  }, [fetchBillData]);


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddOrEditOther = () => {
    setIsOtherAdded(true);
    handleClose();
  };

  return (
    <Box className="dark:text-gray-200" sx={{ p: 10, paddingTop: 1, textAlign: "center" }}>
      <Typography className="dark:text-gray-200" variant="h5" color="purple" fontWeight={600} gutterBottom>
        BILL DISTRIBUTION
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Select className='dark:bg-gray-700 dark:text-gray-200' value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} sx={{ bgcolor: "#fff" }}>
          {["December 2024"].map((date) => (
            <MenuItem key={date} value={date}>{date}</MenuItem>
          ))}
        </Select>
        <Button variant="contained" color="primary" sx={{ fontSize: "0.7rem" }}>View History</Button>
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
  sx={{ fontSize: "1rem",marginTop:"10px", height: "4%", height: "40px" }}
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
    </Box>
  );
};

export default BillDistribution;
