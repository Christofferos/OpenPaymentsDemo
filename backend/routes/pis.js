const express = require("express");

const { createPayment, startPaymentAuth, updatePaymentPSUData } = require("../controllers/pis.js");

const router = express.Router();

// Routes
router.route("/:amount").post(createPayment);
router.route("/paymentId/authorisations").post(startPaymentAuth);
router.route("/paymentId/authorisations/paymentAuthorisationId").put(updatePaymentPSUData);

module.exports = router;
