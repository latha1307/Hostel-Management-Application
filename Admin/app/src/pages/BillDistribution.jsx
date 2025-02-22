import React, { useState } from "react";
import { Box, Button, Card, Grid, MenuItem, Select, TextField, Typography } from "@mui/material";
import GroceryIcon from "../assets/grocery-Icon.png";
import EggIcon from "../assets/egg-Icon.png";
import VegetableIcon from "../assets/vegetables-Icon.png";
import GasIcon from "../assets/gas-Icon.png";// New icon for Vegetables
import MilkImage from "../assets/milk-Icon.png";
import StaffSalaryIcon from "../assets/staffSalary-Icon.png"; // New icon for Staff Salary
import PeopleIcon from "@mui/icons-material/People";

const BillDistribution = () => {
  const [items, setItems] = useState([
    { name: "Groceries",
      icon: (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
          <img src={GroceryIcon} alt="Milk" style={{ width: 32, height: 32 }} />
        </Box>
      ),
      amount: 2500,
      textColor: "violet", shadowColor: "#d4af37" },
    {
      name: "Vegetables",
      icon: (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
          <img src={VegetableIcon} alt="Milk" style={{ width: 32, height: 32 }} />
        </Box>
      ),
      amount: 2500,
      textColor: "violet",
      shadowColor: "#4caf50"
    },
    
    {
      name: "Egg",
      icon: (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
          <img src={EggIcon} alt="Milk" style={{ width: 32, height: 32 }} />
        </Box>
      ),
      amount: 2500,
      textColor: "violet",
      shadowColor: "#ffcc80"
    },
    
     {
      name: "Milk",
      icon: (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
          <img src={MilkImage} alt="Milk" style={{ width: 32, height: 32 }} />
        </Box>
      ),
      amount: 2500,
      textColor: "violet",
      shadowColor: "#64b5f6"
    },
    
    
    
    { name: "Gas",
      icon: (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
          <img src={GasIcon} alt="Milk" style={{ width: 32, height: 32 }} />
        </Box>
      ),
      amount: 2500,
      textColor: "violet", shadowColor: "#e57373" },
    {
      name: "Staff Salary",
      icon: (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
          <img src={StaffSalaryIcon} alt="Milk" style={{ width: 32, height: 32 }} />
        </Box>
      ),
      amount: 2500,
      textColor: "violet",
      shadowColor: "#7986cb"
    },
    
  ]);
  
  const [foodWaste, setFoodWaste] = useState(2500);
  const [studentHeadcounts, setStudentHeadcounts] = useState(500);
  const [year, setYear] = useState("2025");
  const [month, setMonth] = useState("January");

  const handleItemChange = (index, value) => {
    const updatedItems = [...items];
    updatedItems[index].amount = Number(value);
    setItems(updatedItems);
  };

  const totalSummation = items.reduce((sum, item) => sum + item.amount, 0);
  const totalReduction = foodWaste;
  const netAmount = totalSummation - totalReduction;
  const perDayAmount = netAmount / studentHeadcounts;

  return (
    <Box sx={{ p: 2, maxWidth: "100%", mx: "auto", borderRadius: 2, textAlign: "center" }}>
      <Typography variant="h5" color="purple" fontWeight={600} gutterBottom>
        BILL DISTRIBUTION
      </Typography>

      {/* Month & Year Selection */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, mb: 2 }}>
        <Select value={month} onChange={(e) => setMonth(e.target.value)}>
          {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((m) => (
            <MenuItem key={m} value={m}>{m}</MenuItem>
          ))}
        </Select>
        <Select value={year} onChange={(e) => setYear(e.target.value)}>
          {["2024", "2025", "2026", "2027"].map((y) => (
            <MenuItem key={y} value={y}>{y}</MenuItem>
          ))}
        </Select>
        <Button variant="contained" color="primary" sx={{ fontSize: "0.7rem" }}>View History</Button>
      </Box>

      {/* Expense Summary */}
      <Card sx={{ p: 2, bgcolor: "#fff", borderRadius: 2, boxShadow: "0px 4px 8px gray", mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>Summation <span style={{ color: 'green' }}>+ ₹ {totalSummation}</span></Typography>
        <Grid container spacing={1} sx={{ mt: 1 }}>
          {items.map((item, index) => (
            <Grid item xs={6} md={4} key={index}>
              <Card variant="outlined" sx={{ p: 1, bgcolor: "#ffffff", borderRadius: 2, boxShadow: `0px 4px 8px ${item.shadowColor}` }}>
                {item.icon}
                <Typography>{item.name}</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography>₹</Typography>
                  <TextField type="number" fullWidth value={item.amount} onChange={(e) => handleItemChange(index, e.target.value)} />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Card>

      {/* Reduction & Distribution Sections */}
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, mt: 1 }}>
        <Card sx={{ p: 2, width: "48%", bgcolor: "#fff", borderRadius: 2, boxShadow: "0px 4px 8px red" }}>
          <Typography variant="h6" fontWeight={600}>Reduction <span style={{ color: 'red' }}>- ₹ {totalReduction}</span></Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <Typography>₹</Typography>
            <TextField label="Food waste" fullWidth type="number" value={foodWaste} onChange={(e) => setFoodWaste(Number(e.target.value))} />
          </Box>
          <Button variant="contained" color="primary" sx={{ mt: 1, fontSize: "0.7rem" }}>Add other</Button>
        </Card>

        <Card sx={{ p: 2, width: "48%", bgcolor: "#fff", borderRadius: 2, boxShadow: "0px 4px 8px blue" }}>
          <Typography variant="h6" fontWeight={600}>Distribution <span style={{ color: 'blue' }}>+ {studentHeadcounts}</span></Typography>
          <Card variant="outlined" sx={{ mt: 1, p: 2, borderRadius: 2, boxShadow: "0px 4px 8px purple" }}>
            <Typography color="purple">Student Headcounts <PeopleIcon /></Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField type="number" fullWidth value={studentHeadcounts} onChange={(e) => setStudentHeadcounts(Number(e.target.value))} />
            </Box>
          </Card>
        </Card>
      </Box>

      {/* Final Calculation */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1, alignItems: "center" }}>
        <Typography variant="subtitle2" sx={{ color: "green", bgcolor: "#e6ffe6", p: 1, borderRadius: 1 }}>
          Per day Amount : ₹ {perDayAmount.toFixed(2)}
        </Typography>
        <Button variant="contained" color="error" sx={{ fontSize: "0.7rem" }}>Distribute To All Students</Button>
      </Box>
    </Box>
  );
};

export default BillDistribution;
