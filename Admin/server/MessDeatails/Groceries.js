const sql = require('mssql/msnodesqlv8');
const express = require("express");
const { openPool } = require('../database');

const router = express.Router();

const validTables = ['Consumed Provisions', 'Vegetables', 'Egg', 'Milk', 'Gas', 'Purchased Provisions'];

//Get item-name
router.get('/mess/grocery/purchased/item-name', async (req, res) => {
  try {
      const pool = await openPool();
      const query = `
          SELECT ItemName, RemainingQty
          FROM [TPGITHostelManagement].[dbo].[PurchasedProvisions]
      `;

      const result = await pool.request().query(query);

      res.status(200).json(result.recordset);
  } catch (error) {
      console.error('Error fetching item names and categories:', error);
      res.status(500).json({ message: "Server error: " + error.message });
  }
});

//Consumed Provision
router.get('/mess/grocery/consumed/:Hostel/:table', async (req, res) => {
  const { Hostel, table } = req.params;

  // Define valid table names


  if (!validTables.includes(table)) {
    return res.status(400).json({ message: 'Invalid table name' });
  }

  try {
    const pool = await openPool();

    // Construct dynamic query based on the table name
    let query;
    switch (table) {
      case 'Purchased Provisions':
        query = `
          SELECT
              PurchaseID,
              itemName,
              PurchasedQnty,
              PurchasedCostPerKg,
              RemainingQty,
              PurchasedTotalCost,
              DateOfPurchased
          FROM
              [TPGITHostelManagement].[dbo].[PurchasedProvisions]
        `;
        break;

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

router.put('/mess/grocery/consumed/:hostel/:category/:id', async (req, res) => {
  const { hostel, category, id } = req.params;
  const formData = req.body;

  if (!validTables.includes(category)) {
    return res.status(400).json({ message: 'Invalid category name' });
  }

  try {
    const pool = await openPool();
    let query;

    switch (category) {
      case 'Purchased Provisions':
        query = `
          DECLARE @ChangeInQnty INT;

            -- Calculate the change in purchased quantity
          SELECT @ChangeInQnty = @PurchasedQnty - PurchasedQnty
          FROM [TPGITHostelManagement].[dbo].[PurchasedProvisions]
          WHERE PurchaseID = @ID;

          -- Update PurchasedQnty and RemainingQnty based on the change
          UPDATE [TPGITHostelManagement].[dbo].[PurchasedProvisions]
          SET
            PurchasedQnty = @PurchasedQnty,
            PurchasedCostPerKg = @PurchasedCostPerKg,
            DateOfPurchased = @DateOfPurchased,
            RemainingQty = RemainingQty + @ChangeInQnty -- Adjust RemainingQnty based on change
          WHERE PurchaseID = @ID;
        `;
        break;
      case 'Consumed Provisions':
        query = `
        DECLARE @ChangeInQnty INT;
        DECLARE @PurchaseID INT;

        -- Retrieve and assign values to variables
        SELECT
            @ChangeInQnty = @ConsumedQnty - ConsumedQnty,
            @PurchaseID = PurchaseID
        FROM [TPGITHostelManagement].[dbo].[ConsumedProvisions]
        WHERE Hostel = @Hostel AND ConsumedID = @ID;

        -- Update the ConsumedProvisions table
        UPDATE [TPGITHostelManagement].[dbo].[ConsumedProvisions]
        SET
            ConsumedQnty = @ConsumedQnty,
            RemainingQty = RemainingQty - @ChangeInQnty,
            DateOfConsumed = @DateOfConsumed
        WHERE Hostel = @Hostel AND ConsumedID = @ID;

        -- Update the PurchasedProvisions table
        UPDATE [TPGITHostelManagement].[dbo].[PurchasedProvisions]
        SET
            RemainingQty = RemainingQty - @ChangeInQnty -- Adjust RemainingQty based on change
        WHERE PurchaseID = @PurchaseID;


        `;
        break;
      case 'Vegetables':
        query = `
          UPDATE [TPGITHostelManagement].[dbo].[Vegetables]
          SET Quantity = @Quantity, CostPerKg = @CostPerKg, DateOfConsumed = @DateOfConsumed
          WHERE Hostel = @Hostel AND VegetableID = @ID
        `;
        break;
      case 'Egg':
        query = `
          UPDATE [TPGITHostelManagement].[dbo].[Egg]
          SET Quantity = @Quantity, CostPerPiece = @CostPerPiece, DateOfConsumed = @DateOfConsumed
          WHERE Hostel = @Hostel AND ID = @ID
        `;
        break;
      case 'Milk':
        query = `
          UPDATE [TPGITHostelManagement].[dbo].[Milk]
          SET Quantity = @Quantity, CostPerLitre = @CostPerLitre, DateOfConsumed = @DateOfConsumed
          WHERE Hostel = @Hostel AND ID = @ID
        `;
        break;
      case 'Gas':
        query = `
          UPDATE [TPGITHostelManagement].[dbo].[Gas]
          SET TotalAmount = @TotalAmount, DateOfConsumed = @DateOfConsumed
          WHERE Hostel = @Hostel AND ID = @ID
        `;
        break;
      default:
        return res.status(400).json({ message: 'Invalid category' });
    }

    await pool.request()
      .input('Hostel', sql.VarChar, hostel)
      .input('ID', sql.Int, id)
      .input('ConsumedQnty', sql.Decimal, formData.ConsumedQnty || null)
      .input('PurchasedQnty', sql.Decimal, formData.PurchasedQnty || null)
      .input('DateOfConsumed', sql.Date, formData.DateOfConsumed || null)
      .input('DateOfPurchased', sql.Date, formData.DateOfPurchased || null)
      .input('Quantity', sql.Decimal, formData.Quantity || null)
      .input('CostPerKg', sql.Decimal, formData.CostPerKg || null)
      .input('PurchasedCostPerKg', sql.Decimal, formData.PurchasedCostPerKg || null)
      .input('TotalCost', sql.Decimal, formData.TotalCost || null)
      .input('CostPerPiece', sql.Decimal, formData.CostPerPiece || null)
      .input('CostPerLitre', sql.Decimal, formData.CostPerLitre || null)
      .input('TotalAmount', sql.Decimal, formData.TotalAmount || null)
      .query(query);

    res.status(200).json({ message: 'Record updated successfully' });
  } catch (error) {
    console.error('Error updating record:', error.message);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// POST (Add new record)
router.post('/mess/grocery/consumed/:hostel/:category/', async (req, res) => {
  const {  hostel, category } = req.params;
  const formData = req.body;

  if (!validTables.includes(category)) {
    return res.status(400).json({ message: 'Invalid category name' });
  }

  try {
    const pool = await openPool();
    let query;

    switch (category) {
      case 'Purchased Provisions':
        query = `
          INSERT INTO [TPGITHostelManagement].[dbo].[PurchasedProvisions] (itemName, PurchasedQnty, PurchasedCostPerKg, RemainingQty, DateOfPurchased)
          VALUES (@itemName, @PurchasedQnty, @PurchasedCostPerKg, @PurchasedQnty, @DateOfPurchased)
        `;
        break;
      case 'Consumed Provisions':
        query = `
         INSERT INTO [TPGITHostelManagement].[dbo].[ConsumedProvisions]
          (Hostel, itemName, PurchaseID, ConsumedQnty, ConsumedCost, RemainingQty, DateOfConsumed)
          VALUES
            (
              @Hostel,
              @itemName,
              (SELECT TOP 1 PurchaseID FROM [TPGITHostelManagement].[dbo].[PurchasedProvisions] WHERE itemName = @itemName),
              @ConsumedQnty,
              (SELECT TOP 1 PurchasedCostPerKg * @ConsumedQnty
                FROM [TPGITHostelManagement].[dbo].[PurchasedProvisions]
                WHERE itemName = @itemName),
              (SELECT TOP 1 RemainingQty - @ConsumedQnty
                FROM [TPGITHostelManagement].[dbo].[PurchasedProvisions]
                WHERE itemName = @itemName),
              @DateOfConsumed
            );

          UPDATE [TPGITHostelManagement].[dbo].[PurchasedProvisions]
          SET RemainingQty = RemainingQty - @ConsumedQnty
          WHERE PurchaseID = (SELECT TOP 1 PurchaseID FROM [TPGITHostelManagement].[dbo].[PurchasedProvisions] WHERE itemName = @itemName);
        `;
        break;
      case 'Vegetables':
        query = `
          INSERT INTO [TPGITHostelManagement].[dbo].[Vegetables] (Hostel, itemName, Quantity, CostPerKg, DateOfConsumed)
          VALUES (@Hostel, @itemName, @Quantity, @CostPerKg, @DateOfConsumed)
        `;
        break;
      case 'Egg':
        query = `
          INSERT INTO [TPGITHostelManagement].[dbo].[Egg] (Hostel, Quantity, CostPerPiece, DateOfConsumed)
          VALUES (@Hostel, @Quantity, @CostPerPiece, @DateOfConsumed)
        `;
        break;
      case 'Milk':
        query = `
          INSERT INTO [TPGITHostelManagement].[dbo].[Milk] (Hostel, Quantity, CostPerLitre, DateOfConsumed)
          VALUES (@Hostel, @Quantity, @CostPerLitre, @DateOfConsumed)
        `;
        break;
      case 'Gas':
        query = `
          INSERT INTO [TPGITHostelManagement].[dbo].[Gas] (Hostel, TotalAmount, DateOfConsumed)
          VALUES (@Hostel, @TotalAmount, @DateOfConsumed)
        `;
        break;
      default:
        return res.status(400).json({ message: 'Invalid category' });
    }

    await pool.request()
      .input('Hostel', sql.VarChar, hostel)
      .input('itemName', sql.VarChar, formData.itemName)
      .input('ConsumedQnty', sql.Decimal, formData.ConsumedQnty || null)
      .input('PurchasedQnty', sql.Decimal, formData.PurchasedQnty || null)
      .input('DateOfConsumed', sql.Date, formData.DateOfConsumed || null)
      .input('DateOfPurchased', sql.Date, formData.DateOfPurchased || null)
      .input('Quantity', sql.Decimal, formData.Quantity || null)
      .input('CostPerKg', sql.Decimal, formData.CostPerKg || null)
      .input('PurchasedCostPerKg', sql.Decimal, formData.PurchasedCostPerKg || null)
      .input('TotalCost', sql.Decimal, formData.TotalCost || null)
      .input('CostPerPiece', sql.Decimal, formData.CostPerPiece || null)
      .input('CostPerLitre', sql.Decimal, formData.CostPerLitre || null)
      .input('TotalAmount', sql.Decimal, formData.TotalAmount || null)
      .query(query);

    res.status(201).json({ message: 'Record added successfully' });
  } catch (error) {
    console.error('Error adding record:', error.message);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// DELETE (Remove record)
router.delete('/mess/grocery/consumed/:hostel/:category/:id', async (req, res) => {
  const { hostel, category, id } = req.params;

  if (!validTables.includes(category)) {
    return res.status(400).json({ message: 'Invalid category name' });
  }

  try {
    const pool = await openPool();
    let query;

    switch (category) {
      case 'Purchased Provisions':
        query = `
          DELETE FROM [TPGITHostelManagement].[dbo].[PurchasedProvisions]
          WHERE PurchaseID = @ID
        `;
        break;
      case 'Consumed Provisions':
        query = `
          DECLARE @ChangeInQnty INT;
          DECLARE @PurchaseID INT;

          SELECT
              @ChangeInQnty = ConsumedQnty,
              @PurchaseID = PurchaseID
          FROM [TPGITHostelManagement].[dbo].[ConsumedProvisions]
          WHERE Hostel = @Hostel AND ConsumedID = @ID;


          UPDATE [TPGITHostelManagement].[dbo].[PurchasedProvisions]
          SET
              RemainingQty = RemainingQty + @ChangeInQnty
          WHERE PurchaseID = @PurchaseID;

            DELETE FROM [TPGITHostelManagement].[dbo].[ConsumedProvisions]
            WHERE Hostel = @Hostel AND ConsumedID = @ID
        `;
        break;
      case 'Vegetables':
        query = `
          DELETE FROM [TPGITHostelManagement].[dbo].[Vegetables]
          WHERE Hostel = @Hostel AND VegetableID = @ID
        `;
        break;
      case 'Egg':
        query = `
          DELETE FROM [TPGITHostelManagement].[dbo].[Egg]
          WHERE Hostel = @Hostel AND ID = @ID
        `;
        break;
      case 'Milk':
        query = `
          DELETE FROM [TPGITHostelManagement].[dbo].[Milk]
          WHERE Hostel = @Hostel AND ID = @ID
        `;
        break;
      case 'Gas':
        query = `
          DELETE FROM [TPGITHostelManagement].[dbo].[Gas]
          WHERE Hostel = @Hostel AND ID = @ID
        `;
        break;
      default:
        return res.status(400).json({ message: 'Invalid category' });
    }

    await pool.request()
      .input('Hostel', sql.VarChar, hostel)
      .input('ID', sql.Int, id)
      .query(query);

    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Error deleting record:', error.message);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;
