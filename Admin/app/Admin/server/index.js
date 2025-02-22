const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const groceries = require("./MessDeatails/Groceries")

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

app.use('/api', groceries);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



// Example route

