const express = require("express");
const { getAccountList, updateAccountIban, updateAccountBban, getTransactionList } = require("../controllers/ais.js");

const router = express.Router();

// Base route
router.route("/").get(getAccountList);
router.route("/updateIban/:iban").put(updateAccountIban);
router.route("/updateBban/:bban").put(updateAccountBban);
router.route("/accountId/transactions/:accountId").get(getTransactionList);

//{{apiHost}}/psd2/accountinformation/v1/accounts/{{accountId}}/transactions?bookingStatus={{bookingStatus}}&dateFrom={{dateFrom}}&dateTo={{dateTo}}

https: module.exports = router;
