import React, { useEffect, useState } from "react";
import axios from "axios";
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
import { useParams } from 'react-router-dom';

interface GroceryItem {
  itemName: string;
  ConsumedQnty: number;
  ConsumedCostTotal: number;
  RemainingQty: number;
  DateOfConsumed: string;
  CostPerPiece: number;
  CostPerKg: number;
  CostPerLitre: number;
  TotalCost: number;
  TotalAmount: number;
  id: number;
  Quantity: number; // Or use the actual identifier you want
}

const categoryData = [
  { label: "Consumed Provisions", image: ConsumedProvisionsImage, color: "#A07444" },
  { label: "Vegetables", image: VegetableImage, color: "#43A047" },
  { label: "Egg", image: EggImage, color: "#F9A825" },
  { label: "Milk", image: MilkImage, color: "#03A9F4" },
  { label: "Gas", image: GasImage, color: "#D32F2F" },
];

const Groceries = () => {
  const { hostel } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("Consumed Provisions");
  const [groceriesData, setGroceriesData] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroceriesData = async (category) => {
      setLoading(true);
      setError(null);
      const hostelType = hostel === 'Boys' ? 'boys' : 'girls';
      try {
        const response = await axios.get(`http://localhost:8081/api/mess/grocery/consumed/${hostelType}/${category}`);
        setGroceriesData(response.data);
      } catch (error) {
        console.error("Error fetching groceries data:", error);
        setError("Error fetching groceries data");
      } finally {
        setLoading(false);
      }
    };

    fetchGroceriesData(selectedCategory);
  }, [selectedCategory, hostel]);

  const getTableHeaders = () => {
    switch (selectedCategory) {
      case 'Consumed Provisions':
        return ['S.No', 'Item Name', 'Consumed Quantity', 'Consumed Cost', 'Remaining Quantity', 'Date of Consumed', 'Action'];
      case 'Vegetables':
        return ['S.No', 'Item Name', 'Quantity', 'Cost Per Kg', 'Total Cost', 'Date of Consumed', 'Action'];
      case 'Egg':
        return ['S.No', 'Quantity', 'Cost Per Piece', 'Total Cost', 'Date of Consumed', 'Action'];
      case 'Milk':
        return ['S.No', 'Quantity', 'Cost Per Litre', 'Total Cost', 'Date of Consumed', 'Action'];
      case 'Gas':
        return ['S.No', 'Total Amount', 'Date of Consumed', 'Action'];
      default:
        return [];
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if day is single digit
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-based, so add 1)
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <div className="max-h-screen max-w-screen bg-pageBg p-1 -mt-10">
      {/* Header */}
      <div className="flex items-center mb-4">
        <ArrowBack className="text-primary cursor-pointer" />
        <span className="ml-2 text-primary text-xl font-bold">Groceries</span>
      </div>
      <p className="text-tertiary font-medium mb-4">
        <div className="text-sm mb-4">
          <Link to="/manage-mess/boys-hostel">{hostel === 'Boys' ? 'Boys' : 'Girls'} Hostel</Link> &gt; Groceries
        </div>
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

        <Button
          variant="contained"
          startIcon={<FilterListIcon />}
          sx={{ backgroundColor: theme.colors.secondary }}
        >
          Filter By
        </Button>
      </Box>
      {error && <div className="text-red-600">{error}</div>}

      {/* Loading state */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <TableContainer sx={{ border: "1px solid #E0E0E0", borderRadius: "8px" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: categoryData.find((cat) => cat.label === selectedCategory)?.color || "#F5F5F5" }}>
              {getTableHeaders().map((header, index) => (
              <TableCell key={index} align="center" sx={{ fontWeight: "bold", color: 'white' }}>
                {header}
              </TableCell>
            ))}
              </TableRow>
            </TableHead>
            <TableBody >
              {groceriesData.map((row, index) => (
                <TableRow key={row.id} sx={{ border: "1px solid #E0E0E0", backgroundColor: "white" }}>
                  <TableCell align="center">{index + 1}</TableCell>

              {selectedCategory === 'Consumed Provisions' && (
                <>
                  <TableCell align="center">{row.itemName}</TableCell>
                  <TableCell align="center">{row.ConsumedQnty}</TableCell>
                  <TableCell align="center">{row.ConsumedCostTotal}</TableCell>
                  <TableCell align="center">{row.RemainingQty || '-'}</TableCell>
                </>
              )}
              {selectedCategory === 'Vegetables' && (
                <>
                  <TableCell align="center">{row.itemName}</TableCell>
                  <TableCell align="center">{row.Quantity}</TableCell>
                  <TableCell align="center">{row.CostPerKg}</TableCell>
                  <TableCell align="center">{row.TotalCost}</TableCell>
                </>
              )}
              {selectedCategory === 'Egg' && (
                <>
                  <TableCell align="center">{row.Quantity}</TableCell>
                  <TableCell align="center">{row.CostPerPiece}</TableCell>
                  <TableCell align="center">{row.TotalCost}</TableCell>
                </>
              )}
              {selectedCategory === 'Milk' && (
                <>
                  <TableCell align="center">{row.Quantity}</TableCell>
                  <TableCell align="center">{row.CostPerLitre}</TableCell>
                  <TableCell align="center">{row.TotalCost}</TableCell>
                </>
              )}
              {selectedCategory === 'Gas' && (
                <TableCell align="center">{row.TotalAmount}</TableCell>
              )}
                  <TableCell align="center">{formatDate(row.DateOfConsumed)}</TableCell>
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
      )}
    </div>
  );
};

export default Groceries;
