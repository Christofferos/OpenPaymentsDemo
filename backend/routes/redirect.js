const express = require("express");
const {
  consentCodeAuthorize,
  paymentCodeAuthorize,
  accountOverviewConsentAuthorize,
  decoupledAuthentication,
} = require("../controllers/redirect.js");

const router = express.Router();

// Base route
router.route("/consent").get(consentCodeAuthorize);
router.route("/payment").get(paymentCodeAuthorize);
router.route("/accountOverview").get(accountOverviewConsentAuthorize);
router.route("/qrDone").get(decoupledAuthentication);

module.exports = router;
