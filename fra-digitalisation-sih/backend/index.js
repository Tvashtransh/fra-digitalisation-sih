require("dotenv").config({ path: './.env' });

const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const ClaimantRouter = require("./routes/claimantroutes.js");
const AdminRouter = require("./routes/adminroutes.js");
const GSRoutes = require('./routes/gsroutes.js');
const SubdivisionRoutes = require('./routes/subdivisionRoutes.js');
const DistrictRoutes = require('./routes/districtRoutes.js');
const BlockOfficerRoutes = require('./routes/blockOfficerRoutes.js');
const GeoRoutes = require('./routes/geo.js');
const NotificationRoutes = require('./routes/notificationRoutes.js');
const MapRoutes = require('./routes/mapRoutes.js');
const app = express();


// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// MongoDB connection
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL)  
.then(async () => {
  console.log("MongoDB is  connected successfully");
  try {
    // Ensure indexes (including unique Aadhaar) are in place
    const Claimant = require('./model/claimant');
    await Claimant.syncIndexes();
  } catch (e) {
    console.error('Index sync error:', e);
  }
})
.catch((err) => console.error(err));

app.use("/api", ClaimantRouter);
app.use("/admin",AdminRouter);
app.use('/api', GSRoutes);
app.use('/api', SubdivisionRoutes);
app.use('/api', DistrictRoutes);
app.use('/api', BlockOfficerRoutes);
app.use('/api', GeoRoutes);
app.use('/api', NotificationRoutes);
app.use('/api', MapRoutes);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});