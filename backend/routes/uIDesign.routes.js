// backend/routes/uiDesignRoutes.js
const express = require("express");
const router = express.Router();
const { createUIDesign, getAllUIDesigns, getUIDesignById } = require("../controllers/uIDesign.controller");

// POST /api/ui-design - Create a new UI design
router.post("/", createUIDesign);

// GET /api/ui-design - Retrieve all UI designs
router.get("/", getAllUIDesigns);

// GET /api/ui-design/:id - Retrieve a specific UI design by its ID
router.get("/:id", getUIDesignById);

module.exports = router;
