import React, { useState } from "react";
import { Box, Button, Card, Grid, MenuItem, Select, TextField, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EggIcon from "@mui/icons-material/Egg";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import GasMeterIcon from "@mui/icons-material/LocalGasStation";
import MilkIcon from "@mui/icons-material/LocalDrink";
import ChefHatIcon from "@mui/icons-material/Restaurant";
import PeopleIcon from "@mui/icons-material/People";

const BillDistribution = () => {
  const [items, setItems] = useState([
    { name: "Grocery (Issued)", icon: <ShoppingCartIcon />, amount: 2500, shadowColor: "#d4af37" },
    { name: "Vegetables", icon: <LocalGroceryStoreIcon />, amount: 2500, shadowColor: "#4caf50" },
    { name: "Egg", icon: <EggIcon />, amount: 2500, shadowColor: "#ffcc80" },
    { name: "Milk", icon: <MilkIcon />, amount: 2500, shadowColor: "#64b5f6" },
    { name: "Gas", icon: <GasMeterIcon />, amount: 2500, shadowColor: "#e57373" },
    { name: "Staff Salary", icon: <ChefHatIcon />, amount: 2500, shadowColor: "#7986cb" },
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
      
      <Card sx={{ p: 2, bgcolor: "#fff", borderRadius: 2, boxShadow: "0px 4px 8px gray", mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>Summation <span style={{ color: 'green' }}>+ ₹ {totalSummation}</span></Typography>
        <Grid container spacing={1} sx={{ mt: 1 }}>
          {items.map((item, index) => (
            <Grid item xs={6} md={4} key={index}>
              <Card variant="outlined" sx={{ p: 1, bgcolor: "#ffffff", borderRadius: 2, boxShadow: `0px 4px 8px ${item.shadowColor}` }}>
                {item.icon}
                <Typography>{item.name}</Typography>
                <TextField type="number" fullWidth value={item.amount} onChange={(e) => handleItemChange(index, e.target.value)} />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Card>
      
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, mt: 1 }}>
        <Card sx={{ p: 2, width: "48%", bgcolor: "#fff", borderRadius: 2, boxShadow: "0px 4px 8px red" }}>
          <Typography variant="h6" fontWeight={600}>Reduction <span style={{ color: 'red' }}>- ₹ {totalReduction}</span></Typography>
          <TextField label="Food waste" fullWidth type="number" value={foodWaste} onChange={(e) => setFoodWaste(Number(e.target.value))} sx={{ mt: 1 }} />
          <Button variant="contained" color="primary" sx={{ mt: 1, fontSize: "0.7rem" }}>Add other</Button>
        </Card>
        
        <Card sx={{ p: 2, width: "48%", bgcolor: "#fff", borderRadius: 2, boxShadow: "0px 4px 8px blue" }}>
          <Typography variant="h6" fontWeight={600}>Distribution <span style={{ color: 'blue' }}>+ {studentHeadcounts}</span></Typography>
          <Card variant="outlined" sx={{ mt: 1, p: 1, borderRadius: 2, boxShadow: "0px 4px 8px purple" }}>
            <Typography color="purple">Student Headcounts <PeopleIcon /></Typography>
            <TextField type="number" fullWidth value={studentHeadcounts} onChange={(e) => setStudentHeadcounts(Number(e.target.value))} />
          </Card>
        </Card>
      </Box>
      
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1, alignItems: "center" }}>
        <Typography variant="subtitle2" sx={{ color: "green", bgcolor: "#e6ffe6", p: 1, borderRadius: 1 }}>Per day Amount : ₹ {perDayAmount.toFixed(2)}</Typography>
        <Button variant="contained" color="error" sx={{ fontSize: "0.7rem" }}>Distribute To All Students</Button>
      </Box>
    </Box>
  );
};

export default BillDistribution;