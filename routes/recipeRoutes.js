require("dotenv").config();
const express = require('express');
const router = express.Router();
// const authMiddleware = require('../middleware/authMiddleware');
const spoonAPIKey = process.env.SPOON_API_KEY;

router.get('/api/recipes', async (req, res) => {
  try {
    const { query } = req.query;
    const url = `https://api.spoonacular.com/recipes/random?number=`;
    const response = await fetch(`${url}${query}&apiKey=${spoonAPIKey}`);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error('Error fetching data: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
