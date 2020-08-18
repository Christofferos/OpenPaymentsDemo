const express = require("express");
const { getAspspList, getAspspDetails } = require("../controllers/aspsp.js");

const router = express.Router();

// Base route
router.route("/").get(getAspspList);

// Extra addon to route
router.route("/:bicfi").get(getAspspDetails);

module.exports = router;
