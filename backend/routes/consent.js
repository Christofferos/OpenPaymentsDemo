const express = require("express");
const { createConsent, startConsentAuth, updateConsentPSUData } = require("../controllers/consent.js");

const router = express.Router();

// Routes to each consent api call.
router.route("/").post(createConsent);
router.route("/consentId/authorisations").post(startConsentAuth);
router.route("/consentId/authorisations/consentAuthorisationId").put(updateConsentPSUData);

module.exports = router;
