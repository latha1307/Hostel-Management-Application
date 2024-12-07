import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  InputAdornment,
} from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Link } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";

import ConsumedProvisionsImage from "../../assets/consumed_provisions.png";
import VegetableImage from "../../assets/vegetable.png";
import EggImage from "../../assets/egg.png";
import MilkImage from "../../assets/milk.png";
import GasImage from "../../assets/gas.png";
import { theme } from "../../constants/theme";

const categoryData = [
  { label: "Consumed Provisions", image: ConsumedProvisionsImage, color: "#A07444" },
  { label: "Vegetables", image: VegetableImage, color: "#43A047" },
  { label: "Egg", image: EggImage, color: "#F9A825" },
  { label: "Milk", image: MilkImage, color: "#03A9F4" },
  { label: "Gas", image: GasImage, color: "#D32F2F" },
];

// Example data for tables
const groceriesData = {
  "Consumed Provisions": [
    { id: 1, itemName: "Rice", consumedQty: 100, consumedCost: 50, remainingQty: 20, dateConsumed: "10/9/2024" },
  ],
  Vegetables: [
    { id: 1, itemName: "Carrot", consumedQty: 10, consumedCost: 30, remainingQty: 5, dateConsumed: "11/9/2024" },
  ],
  Egg: [
    { id: 1, itemName: "Egg", consumedQty: 50, consumedCost: 200, remainingQty: 10, dateConsumed: "12/9/2024" },
  ],
  Milk: [
    { id: 1, itemName: "Milk", consumedQty: 20, consumedCost: 100, remainingQty: 5, dateConsumed: "13/9/2024" },
  ],
  Gas: [
    { id: 1, itemName: "Gas Cylinder", consumedQty: 1, consumedCost: 1500, remainingQty: 0, dateConsumed: "14/9/2024" },
  ],
};

const Groceries = () => {
  const [selectedCategory, setSelectedCategory] = useState("Consumed Provisions");

  return (
    <div className="max-h-screen max-w-screen bg-pageBg p-1 -mt-10">
      {/* Header */}
      <div className="flex items-center mb-4">
        <ArrowBack className="text-primary cursor-pointer" />
        <span className="ml-2 text-primary text-xl font-bold">Groceries</span>
      </div>
      <p className="text-tertiary font-medium mb-4">
        <nav className="text-sm mb-4">
          <Link to="/manage-mess/boys-hostel">Boys Hostel</Link> &gt; Groceries
        </nav>
      </p>

      {/* Category Buttons */}
      <div className="flex flex-nowrap justify-between gap-4 mb-8">
        {categoryData.map((category, index) => (
          <div
            key={index}
            onClick={() => setSelectedCategory(category.label)} // Update selected category
            className="flex items-center justify-between bg-blue-500 text-white px-4 py-3 rounded-sm cursor-pointer hover:scale-105 transition-transform"
            style={{ backgroundColor: category.color, width: "20%", height: "60px" }}
          >
            <span className="font-bold text-sm">{category.label}</span>
            <img src={category.image} alt={category.label} className="w-10 h-10 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Table Title */}
      <div className="flex items-center justify-center mb-4">
        <span className="ml-2 text-primary text-xl font-bold">{selectedCategory}</span>
      </div>

      {/* Search and Filter Section */}
      <Box display="flex" alignItems="center" mb={2} gap={2}>
        {/* Search Box */}
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search"
          sx={{
            width: "40%",
            backgroundColor: "white",
            borderRadius: "20px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px", // Ensure border radius is applied to the input
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

        {/* Filter Button */}
        <Button
          variant="contained"
          startIcon={<FilterListIcon />}
          sx={{ backgroundColor: theme.colors.secondary }}
        >
          Filter By
        </Button>
      </Box>

      {/* Table Section */}
      <TableContainer sx={{ border: "1px solid #E0E0E0", borderRadius: "8px" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: categoryData.find((cat) => cat.label === selectedCategory)?.color || "#F5F5F5" }}>
              {["S.No", "Item Name", "Consumed Quantity", "Consumed Cost", "Remaining Quantity", "Date of Consumed", "Action"].map(
                (header, index) => (
                  <TableCell key={index} align="center" sx={{ fontWeight: "bold", color: "white" }}>
                    {header}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {groceriesData[selectedCategory]?.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">{row.itemName}</TableCell>
                <TableCell align="center">{row.consumedQty}</TableCell>
                <TableCell align="center">{row.consumedCost}</TableCell>
                <TableCell align="center">{row.remainingQty}</TableCell>
                <TableCell align="center">{row.dateConsumed}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Groceries;
