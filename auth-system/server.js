const express = require('express');
const cors = require('cors'); 
const authRoutes = require('./routes/auth'); // Import เส้นทาง

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors()); 

// Routes
app.use('/auth', authRoutes); // ใช้เส้นทางจาก authRoutes

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
