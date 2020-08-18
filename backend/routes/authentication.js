const express = require("express");

const { requestAspspInfoToken } = require("../controllers/authentication.js");

const router = express.Router();

// Public access (no required :id)
router.route("/").post(requestAspspInfoToken);

module.exports = router;
