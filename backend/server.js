const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Allow requests from your frontend
app.use(express.json());

// Endpoint to serve the API key (or any other sensitive data)
app.get('/api/key', (req, res) => {
  res.json({ apiKey: process.env.API_KEY });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
