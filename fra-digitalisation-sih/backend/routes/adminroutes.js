// routes/adminRoutes.js
const express = require("express");
const { registerAdmin, loginAdmin, logoutAdmin } = require("../controller/admincontroller.js");
const { verifyToken, authorizeRoles } = require("../middlewares/AdminAuth.js");
const { getClaimsByStatus, updateClaimStatus, getClaimDetails } = require("../controller/claim.js");

const router = express.Router();

// Auth
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);

// Dashboards
router.get(
  "/dashboard/gramsabha",
  verifyToken,
  authorizeRoles("GramSabha"),
  (req, res) => res.json({ message: "Gram Sabha Dashboard Data" })
);

router.get(
  "/dashboard/sdlc",
  verifyToken,
  authorizeRoles("SDLCOfficer"),
  (req, res) => res.json({ message: "SDLC Officer Dashboard Data" })
);

router.get(
  "/dashboard/dlc",
  verifyToken,
  authorizeRoles("DLCOfficer"),
  (req, res) => res.json({ message: "DLC Officer Dashboard Data" })
);

router.get(
  "/dashboard/superadmin",
  verifyToken,
  authorizeRoles("SuperAdmin"),
  (req, res) => res.json({ message: "Super Admin Dashboard Data" })
);

// Claim Management Routes
router.get(
  "/claims",
  verifyToken,
  authorizeRoles("GramSabha", "SDLCOfficer", "DLCOfficer", "SuperAdmin"),
  getClaimsByStatus
);

router.get(
  "/claim/:claimId",
  verifyToken,
  authorizeRoles("GramSabha", "SDLCOfficer", "DLCOfficer", "SuperAdmin"),
  getClaimDetails
);

router.put(
  "/claim/:claimId/status",
  verifyToken,
  authorizeRoles("GramSabha", "SDLCOfficer", "DLCOfficer", "SuperAdmin"),
  updateClaimStatus
);

module.exports = router;
