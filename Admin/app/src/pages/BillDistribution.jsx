import React, { useState } from "react";
import { Box, Button, Card, Grid, TextField, MenuItem, Select, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import GroceryIcon from "../assets/grocery-Icon.png";
import EggIcon from "../assets/egg-Icon.png";
import VegetableIcon from "../assets/vegetables-Icon.png";
import GasIcon from "../assets/gas-Icon.png";
import MilkImage from "../assets/milk-Icon.png";
import StaffSalaryIcon from "../assets/staffSalary-Icon.png";
import DivisionIcon from "../assets/division-Icon.png";
import PeopleIcon from "@mui/icons-material/People";

const BillDistribution = () => {
  const [items] = useState([
    { name: "GROCERIES ISSUED", icon: GroceryIcon, amount: 2500, shadowColor: "#d4af37" },
    { name: "VEGETABLES", icon: VegetableIcon, amount: 2500, shadowColor: "#4caf50" },
    { name: "EGG", icon: EggIcon, amount: 2500, shadowColor: "#ffcc80" },
    { name: "MILK", icon: MilkImage, amount: 2500, shadowColor: "#64b5f6" },
    { name: "GAS", icon: GasIcon, amount: 2500, shadowColor: "#e57373" },
    { name: "STAFF", icon: StaffSalaryIcon, amount: 2500, shadowColor: "#7986cb" },
  ]);


  
  const [isEditingFoodWaste, setIsEditingFoodWaste] = useState(false);
  const [isEditingOtherWaste, setIsEditingOtherWaste] = useState(false);
  const [foodWaste, setFoodWaste] = useState(2500);
  const [otherAmount, setOtherAmount] = useState(0);
  const [isOtherAdded, setIsOtherAdded] = useState(false);
  const [open, setOpen] = useState(false);
  const [studentHeadcounts] = useState(500);
  const [selectedDate, setSelectedDate] = useState("January 2025");
  const totalSummation = items.reduce((sum, item) => sum + item.amount, 0);
  const netAmount = totalSummation - foodWaste - (isOtherAdded ? otherAmount : 0);
  const perDayAmount = netAmount / studentHeadcounts;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddOrEditOther = () => {
    setIsOtherAdded(true);
    handleClose();
  };

  return (
    <Box sx={{ p: 2, textAlign: "center" }}>
      <Typography variant="h5" color="purple" fontWeight={600} gutterBottom>
        BILL DISTRIBUTION
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} sx={{ bgcolor: "#fff" }}>
          {["January 2024", "February 2024", "March 2024", "April 2024", "May 2024", "June 2024", "July 2024", "August 2024", "September 2024", "October 2024", "November 2024", "December 2024", "January 2025", "February 2025", "March 2025", "April 2025", "May 2025", "June 2025", "July 2025", "August 2025", "September 2025", "October 2025", "November 2025", "December 2025"].map((date) => (
            <MenuItem key={date} value={date}>{date}</MenuItem>
          ))}
        </Select>
        <Button variant="contained" color="primary" sx={{ fontSize: "0.7rem" }}>View History</Button>
      </Box>

      <Card sx={{ p: 2, bgcolor: "#fff", borderRadius: 2, boxShadow: "0px 4px 8px green", mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" fontWeight={600}>Summation</Typography>
          <Typography variant="h6" fontWeight={600} color="green">
            + <span style={{ color: "green" }}>₹</span> {totalSummation}
          </Typography>
        </Box>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {items.map((item, index) => (
            <Grid item xs={6} md={4} key={index}>
              <Card variant="outlined" sx={{ p: 2, bgcolor: "#ffffff", borderRadius: 2, boxShadow: `0px 4px 8px ${item.shadowColor}`, margin: "10px" }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography variant="h6" fontWeight= "Medium" color="purple">{item.name}</Typography>
                  <img src={item.icon} alt={item.name} style={{ width: 35, height: 35 }} />
                </Box>
                <Typography variant="h5" fontWeight={600} color="text.secondary" sx={{ textAlign: "left", mt: 1 }}>
                  <span style={{ color: "purple" }}>₹</span> {item.amount}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Card>



      
      
      
      
      
      
      
    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
    <Card sx={{ p: 3, width: "48%", boxShadow: "0px 4px 8px red", background: "#fff" }}>
  <Typography variant="h5" fontWeight={700} display="flex" justifyContent="space-between">
    <span>Reduction</span>
    <span style={{ color: "red" }}>- ₹{foodWaste + (isOtherAdded ? otherAmount : 0)}</span>
  </Typography>

  {/* Food Waste - Click to Edit */}
  <Box sx={{ display: "flex", alignItems: "center", mt: 3, justifyContent: "space-between" }}>
    <Typography variant="h6" fontWeight={500} sx={{ color: "purple" }}>Food Waste:</Typography>
    {isEditingFoodWaste ? (
      <TextField
        type="number"
        value={foodWaste}
        onChange={(e) => setFoodWaste(Number(e.target.value))}
        onBlur={() => setIsEditingFoodWaste(false)}
        autoFocus
        sx={{ width: "120px", fontSize: "1.2rem" }}
      />
    ) : (
      <Typography
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
      <Typography variant="h6" fontWeight={500} sx={{ color: "purple" }}>Other Reduction:</Typography>
      {isEditingOtherWaste ? (
        <TextField
          type="number"
          value={otherAmount}
          onChange={(e) => setOtherAmount(Number(e.target.value))}
          onBlur={() => setIsEditingOtherWaste(false)}
          autoFocus
          sx={{ width: "120px", fontSize: "1.2rem" }}
        />
      ) : (
        <Typography
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



       
     
     
     
     
     
     
     
     
      <Card sx={{ p: 2, width: "48%", bgcolor: "#fff", borderRadius: 2, boxShadow: "0px 4px 8px blue" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" fontWeight={600}>Distribution</Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "blue" }}>
              <img src={DivisionIcon} alt="Division" style={{ width: 15, height: 15}} />
              <Typography variant="h6" fontWeight={600}>{studentHeadcounts}</Typography>
            </Box>
        </Box>
      <Card variant="outlined" sx={{ mt: 3, p: 2, width: "80%", marginLeft: "10%", height:"60%", borderRadius: 2, boxShadow: "0px 4px 8px purple" }}>
            <Typography color="purple" sx={{ display: "flex", justifyContent: "space-between", fontWeight: 500 }}>
              STUDENT HEADCOUNTS <PeopleIcon />
            </Typography>
            <Typography variant="h5" fontWeight={600} sx={{ margin:"5%"}} color="text.secondary">{studentHeadcounts}</Typography>
          </Card>
      </Card>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, alignItems: "center" }}>
        <Typography variant="subtitle2" sx={{ color: "green", bgcolor: "#e6ffe6", p: 1, borderRadius: 1 }}>
          Per day Amount : <span style={{ color: "green" }}>₹</span> {perDayAmount.toFixed(2)}
        </Typography>
        <Button variant="contained" color="error" sx={{ fontSize: "0.7rem" }}>Distribute To All Students</Button>
      </Box>
      



      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isOtherAdded ? "Edit Other Reduction" : "Add Other Reduction"}</DialogTitle>
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