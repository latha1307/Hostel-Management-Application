const sql = require('mssql/msnodesqlv8');
const express = require("express");
const { openPool } = require('../database');

const router = express.Router();

//Consumed Provision
router.get('/mess/grocery/consumed/:Hostel/:table', async (req, res) => {
  const { Hostel, table } = req.params;

  // Define valid table names
  const validTables = ['Consumed Provisions', 'Vegetables', 'Egg', 'Milk', 'Gas'];

  if (!validTables.includes(table)) {
    return res.status(400).json({ message: 'Invalid table name' });
  }

  try {
    const pool = await openPool();

    // Construct dynamic query based on the table name
    let query;
    switch (table) {
      case 'Consumed Provisions':
        query = `
          SELECT
              cc.ConsumedID,
              pp.PurchaseID,
              pp.itemName,
              cc.ConsumedQnty,
              pp.PurchasedQnty,
              (cc.ConsumedQnty * pp.PurchasedCostPerKg) AS ConsumedCostTotal,
              pp.PurchasedCostPerKg,
              pp.RemainingQty,
              (pp.PurchasedQnty * pp.PurchasedCostPerKg) AS PurchasedTotalCost,
              cc.DateOfConsumed
          FROM
              [TPGITHostelManagement].[dbo].[ConsumedProvisions] cc
          JOIN
              [TPGITHostelManagement].[dbo].[PurchasedProvisions] pp
              ON cc.PurchaseID = pp.PurchaseID
          WHERE
              cc.Hostel = @Hostel;
        `;
        break;
      case 'Vegetables':
        query = `
          SELECT
              VegetableID,
              itemName,
              Quantity,
              CostPerKg,
              TotalCost,
              DateOfConsumed
          FROM
              [TPGITHostelManagement].[dbo].[Vegetables]
          WHERE
              Hostel = @Hostel;
        `;
        break;
      case 'Egg':
        query = `
          SELECT
              ID,
              Quantity,
              CostPerPiece,
              TotalCost,
              DateOfConsumed
          FROM
              [TPGITHostelManagement].[dbo].[Egg]
          WHERE
              Hostel = @Hostel;
        `;
        break;
      case 'Milk':
        query = `
          SELECT
              ID,
              Quantity,
              CostPerLitre,
              TotalCost,
              DateOfConsumed
          FROM
              [TPGITHostelManagement].[dbo].[Milk]
          WHERE
              Hostel = @Hostel;
        `;
        break;
      case 'Gas':
        query = `
          SELECT
              ID,
              TotalAmount,
              DateOfConsumed
          FROM
              [TPGITHostelManagement].[dbo].[Gas]
          WHERE
              Hostel = @Hostel;
        `;
        break;
      default:
        return res.status(400).json({ message: 'Invalid table name' });
    }

    const result = await pool.request()
      .input('Hostel', sql.VarChar, Hostel)
      .query(query);

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});


module.exports = router;
