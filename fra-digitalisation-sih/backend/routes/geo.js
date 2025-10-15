const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', file), 'utf8'));
  } catch (e) {
    return [];
  }
}

// Get tehsils for Bhopal
router.get('/geo/bhopal/tehsils', (req, res) => {
  res.json({ tehsils: ['Berasia', 'Phanda'] });
});

// Get gram panchayats for a tehsil in Bhopal
router.get('/geo/bhopal/gps', (req, res) => {
  const tehsil = (req.query.tehsil || '').toString().toLowerCase();
  let data = [];
  if (tehsil === 'berasia') data = readJson('berasia-gp.json');
  else if (tehsil === 'phanda') data = readJson('phanda-gp.json');
  else return res.status(400).json({ message: 'Invalid tehsil' });
  res.json({ items: data });
});

module.exports = router;


