const express = require('express');
const multer = require('multer');
const { parseVSR } = require('../utils/parser');
const {
  comparePartNumbers,
  compareSWVersions,
  compareToMaster
} = require('../utils/compare');
const { getAllItems } = require('../services/dynamoClient');

const router = express.Router();
const upload = multer();

router.post('/upload-vsr', upload.single('vsrfile'), async (req, res) => {
  try {
    const html = req.file.buffer.toString('utf8');
    const { ecuData, metadata } = parseVSR(html);
    const masterList = await getAllItems();
    const results = compareToMaster(ecuData, masterList);
    res.json({ results, metadata });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ error: 'Failed to parse and compare VSR file.' });
  }
});

module.exports = router;
