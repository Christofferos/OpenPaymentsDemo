/* ## Imports / Dependencies ## */
const ErrorResponse = require("../utils/errorResponse.js");
const asyncHandler = require("../middleware/async");
const fetch = require("node-fetch");
const { v4: uuidv4 } = require("uuid");
let global = require("../globals");

/*
  -
  - Backend API logic defined in this folder. Endpoints defined in the "routes" folder. 
  -
*/

// @desc    Get Account list
// @route   GET /psd2/accountinformation/v1/accounts
// @access  PRIV Access Key
exports.getAccountList = asyncHandler(async (req, res) => {
  if (global.aisToken === "" || !validToken(global.aisTimestamp)) {
    global.aisToken = await requestToken("ais");
  }

  if (req.session.UIState === "AUTHENTICATE_CONSENT" && req.session.UIFlow === "DECOUPLE") {
    req.session.UIState = "SELECT_ACCOUNT";
  }

  const api_url = global.apiRoute + global.accountBaseRoute + `?withBalance=true`;
  const guid = uuidv4();

  /* console.log(`Account Request: `.yellow);
  console.log({
    api_url: api_url,
    method: "GET",
    withCredentials: true,
    credentials: "include",
    headers: {
      authorization: "Bearer " + global.aisToken,
      Accept: "application/json",
      "Content-Type": "application/json",
      "Consent-ID": req.session.consentId,
      "X-BicFi": req.session.bicFi,
      "X-Request-ID": guid,
      "PSU-IP-Address": global.PSU_IP_Address,
    },
  }); */
  // console.log(`ConsentID: ${req.session.consentId}`.blue);

  let fetch_response;
  let jsonData;
  fetch_response = await fetch(api_url, {
    method: "GET",
    withCredentials: true,
    credentials: "include",
    headers: {
      authorization: "Bearer " + global.aisToken,
      Accept: "application/json",
      "Content-Type": "application/json",
      "Consent-ID": req.session.consentId,
      "X-BicFi": req.session.bicFi,
      "X-Request-ID": guid,
      "PSU-IP-Address": global.PSU_IP_Address,
    },
    agentOptions: global.httpsClientPlatformOptions,
  });
  jsonData = await fetch_response.json();
  req.session.accounts = await jsonData.accounts;

  /* console.log(`Here are the accounts:`.yellow);
  console.log(jsonData); */

  if (jsonData !== undefined) {
    if (jsonData.accounts.length > 0) {
      /* Not relevant for Payment Procedure */
      if (global.bankCardTarget !== -1) {
        console.log(global.bankCardTarget);
        jsonData.accounts.map((acc) => {
          if (global.bankCards[global.bankCardTarget].accNames.length < jsonData.accounts.length) {
            global.bankCards[global.bankCardTarget].bicFi = req.session.bicFi;
            global.bankCards[global.bankCardTarget].bicFiLogoUrl = req.session.bicFiLogoUrl;
            global.bankCards[global.bankCardTarget].accNames.push(acc.product);
            global.bankCards[global.bankCardTarget].userNames.push(acc.name);

            let balanceSum = 0;
            let balanceCurrency = "";

            acc.balances.map((el) => {
              balanceSum += parseFloat(el.balanceAmount.amount);
              balanceCurrency = el.balanceAmount.currency;
            });

            global.bankCards[global.bankCardTarget].balances.push(Math.round(balanceSum));
            global.bankCards[global.bankCardTarget].currency = balanceCurrency;
          }
        });
      }
    }
  }

  // [Failed response]
  if (jsonData == null) res.status(404).json({ success: false, error: "Get account list response is empty" });
  else if ("tppMessages" in jsonData)
    res.status(400).json({ success: false, error: "Get account list request failed" });

  // [Successful response]
  await res.json({
    status: "Success",
    data: jsonData,
    session: req.session,
  });
});

// @desc    Update Account Iban
// @route   PUT /psd2/accountinformation/v1/accounts/updateIban/:iban
// @access  PUBLIC
exports.updateAccountIban = asyncHandler(async (req, res) => {
  req.session.accountIban = req.params.iban;
  console.log(`Account IBAN: ${req.session.accountIban}`.yellow.bold);

  res.json({
    status: "Success",
  });
});

// @desc    Update Account Bban
// @route   PUT /psd2/accountinformation/v1/accounts/updateIban/:bban
// @access  PUBLIC
exports.updateAccountBban = asyncHandler(async (req, res) => {
  req.session.accountBban = req.params.bban;
  console.log(`Account BBAN: ${req.session.accountBban}`.yellow.bold);

  res.json({
    status: "Success",
  });
});

/* Not relevant for Payment Process */

// @desc    Get Transaction list
// @route   GET /psd2/accountinformation/v1/accounts/accountId/transactions
// @access  PRIV Access Key
exports.getTransactionList = asyncHandler(async (req, res) => {
  if (global.aisToken === "" || !validToken(global.aisTimestamp)) {
    global.aisToken = await requestToken("ais");
  }

  const guid = uuidv4();
  let dateFrom;

  if (req.session.bicFi === "NDEASESS" || req.session.bicFi === "NDEAFIHH" || req.session.bicFi === "OKOYFIHH") {
    dateFrom = validDate(-360);
  } else if (req.session.bicFi === "SWEDSESS") {
    dateFrom = validDate(-89);
  } else {
    dateFrom = validDate(-3650);
  }
  // console.log(dateFrom);
  const dateTo = validDate(0);
  const accountId = req.params.accountId;

  let api_url =
    global.apiRoute +
    global.accountBaseRoute +
    `/${accountId}/transactions?bookingStatus=both&dateFrom=${dateFrom}&dateTo=${dateTo}`;

  let fetch_response = await fetch(api_url, {
    method: "GET",
    withCredentials: true,
    credentials: "include",
    headers: {
      authorization: "Bearer " + global.aisToken,
      Accept: "application/json",
      "Content-Type": "application/json",
      "Consent-ID": req.session.consentId,
      "X-BicFi": req.session.bicFi,
      "X-Request-ID": guid,
      "PSU-IP-Address": global.PSU_IP_Address,
    },
    agentOptions: global.httpsClientPlatformOptions,
  });
  let jsonData = await fetch_response.json();

  if (jsonData !== undefined) {
    if (
      global.bankCards[global.bankCardTarget].incomeAvgs.length <
      global.bankCards[global.bankCardTarget].accNames.length
    ) {
      let withdrawAmountAvrage = 0;
      let incomeAmountAvrage = 0;
      let sampleSize = await jsonData.transactions.booked.length;

      // Might need to set a transaction limit (e.g. 1000)
      await jsonData.transactions.booked.map((transaction) => {
        if (parseFloat(transaction.transactionAmount.amount) < 0) {
          withdrawAmountAvrage += parseFloat(transaction.transactionAmount.amount);
        } else {
          incomeAmountAvrage += parseFloat(transaction.transactionAmount.amount);
        }
      });

      incomeAmountAvrage = await Math.round(incomeAmountAvrage / sampleSize);
      withdrawAmountAvrage = await Math.round(withdrawAmountAvrage / sampleSize);

      await global.bankCards[global.bankCardTarget].incomeAvgs.push(incomeAmountAvrage);
      await global.bankCards[global.bankCardTarget].withdrawAvgs.push(withdrawAmountAvrage);
      await global.bankCards[global.bankCardTarget].sampleSize.push(sampleSize);
    }
  }

  await console.log(`Bank Card ${global.bankCardTarget}:`);
  await console.log(global.bankCards[global.bankCardTarget]);

  await res.json({
    status: "Success",
    data: jsonData,
    bankCards: global.bankCards,
  });
});

/* ## validDate: [] ## */
validDate = (days) => {
  var d = new Date();
  d.setDate(d.getDate() + days);
  d = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  return d;
};
