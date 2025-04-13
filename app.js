const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/cors');

const app = express();

// Apply CORS middleware
app.use(cors(corsOptions));

// ...existing code...

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});