// backend/routes/master.js
const express = require('express');
const router = express.Router();
const { getAllItems, updateItem } = require('../services/dynamoClient');

router.get('/get-master', async (req, res) => {
  try {
    const items = await getAllItems();
    res.json(items);
  } catch {
    res.status(500).json({ error: "Failed to fetch master list" });
  }
});

router.post('/update-master', async (req, res) => {
  const updates = req.body;
  console.log("🔧 Incoming updates:", updates);
  console.log(JSON.stringify(updates, null, 2));

  try {
    for (const item of updates) {
      const sanitizedItem = {
        ECU: item.ECU,
        PartNum: item.ExpectedPartNum ?? item.PartNum,
        SWVersion: item.ExpectedSW ?? item.SWVersion,
        Priority: item.Priority,
        FIOwner: item.FIOwner,
        SubsystemOwner: item.SubsystemOwner
      };
      await updateItem(sanitizedItem);
    }
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Update failed" });
  }
});

module.exports = router;
