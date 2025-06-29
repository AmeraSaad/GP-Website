
const express = require("express");
const router = express.Router();
const { runCrewAI, getAllCrewOutputs, getCrewOutputById, runCrewReq, runCrewSRS, runCrewUML } = require("../controllers/crewai.controller");
const multer  = require("multer");
const upload  = multer();

// POST /api/crewai - create a new CrewAI output based on a summary input
router.post("/",upload.none(), runCrewAI);

// GET /api/crewai - retrieve all CrewAI output documents
router.get("/", getAllCrewOutputs);

// GET /api/crewai/:id - retrieve a specific CrewAI output by its ID
router.get("/:id", getCrewOutputById);

router.post('/req', upload.none(), runCrewReq);
router.post('/srs', upload.none(), runCrewSRS);
router.post('/uml', upload.none(), runCrewUML);

module.exports = router;
