const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const formRoutes = require('./routes/formRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/forms', formRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
