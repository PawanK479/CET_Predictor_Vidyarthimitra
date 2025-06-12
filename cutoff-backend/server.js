// server.js
const express = require('express');
const cors = require('cors');
const cutoffRoutes = require('./routes/cutoffs');
const optionsRoutes = require('./routes/options');

const app = express();
app.use(cors());
app.use(express.json());




// Routes
app.use('/api/cutoffs', cutoffRoutes);
app.use('/api/options', optionsRoutes);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
