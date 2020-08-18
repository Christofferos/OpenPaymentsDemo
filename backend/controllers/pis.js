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

/* Regex helper function */
const isNumber = (n) => {
  return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
};

// @desc    Create Payment Initiation
// @route   POST /psd2/paymentinitiation/v1/payment-service/payment-product/:amount
// @access  PRIV Access Key
exports.createPayment = asyncHandler(async (req, res) => {
  if (global.pisToken === "" || !validToken(global.pisTimestamp)) {
    global.pisToken = await requestToken("pis");
  }

  if (req.session.UIState === "SELECT_ACCOUNT" && req.session.UIFlow === "REDIRECT") {
    req.session.UIState = "AUTHENTICATE_PAYMENT";
  } else if (req.session.UIState === "SELECT_ACCOUNT" && req.session.UIFlow === "DECOUPLE") {
    req.session.UIState = "PAYMENT_DONE";
  }

  // Swedish banks use: "domestic"
  // "Non-domestic" banks use: "sepa-credit-transfers" instead of the: "PaymentBaseRoute".
  let api_url = global.apiRoute + global.paymentBaseRoute;

  const guid = uuidv4();
  req.session.paymentCurrency = "SEK";
  let transferAmount = req.params.amount;

  if (transferAmount === 0 || transferAmount === "0" || transferAmount === undefined || !isNumber(transferAmount)) {
    transferAmount = 1; // Transaction amount required to be greater than 0.
  }
  console.log(`Transfer amount: ${transferAmount}`.yellow.bold);

  /* ## Body objects for create payment request ## */
  let debtorAccountObj = {
    iban: req.session.accountIban,
    bban: req.session.accountBban,
    currency: req.session.paymentCurrency,
  };
  let creditorAccountObj = {
    iban: "SE4850000000052310173371",
    bban: "0173371",
    currency: req.session.paymentCurrency,
  };
  let creditorAddress = {
    street: "Malmskillnadsgatan",
    buildingNumber: "32",
    city: "Stockholm",
    postalCode: "11151",
    country: "SE",
  };
  let bodyObj = {};

  /* ### Custom bank requirements: ### */
  switch (req.session.bicFi) {
    case "ESSESESS": // USE: Domestic, SEK
      api_url = global.apiRoute + "/psd2/paymentinitiation/v1/payments/domestic";
      req.session.paymentCurrency = "SEK";
      global.PSU_ID = "9311219639";
      break;

    case "HANDSESS": // USE: Domestic, SEK, BBAN, Clearing number, PSU-ID and PSU-IP-Address headers.
      api_url = global.apiRoute + "/psd2/paymentinitiation/v1/payments/domestic";
      req.session.paymentCurrency = "SEK";
      debtorAccountObj = {
        bban: req.session.accountBban,
        currency: req.session.paymentCurrency,
      };
      creditorAccountObj = {
        bban: "401975231",
        currency: req.session.paymentCurrency,
        clearingNumber: "5231",
      };
      break;

    case "SWEDSESS": // USE: Domestic, SEK, PSU-IP-Address, PSU-User-Agent and PSU-Http-Method headers.
      api_url = global.apiRoute + "/psd2/paymentinitiation/v1/payments/domestic";
      req.session.paymentCurrency = "SEK";
      debtorAccountObj = {
        iban: req.session.accountIban,
        currency: req.session.paymentCurrency,
      };
      break;

    case "NDEASESS": // USE: Domestic, SEK, debtor-BBAN, creditor-IBAN,
      api_url = global.apiRoute + "/psd2/paymentinitiation/v1/payments/domestic";
      req.session.paymentCurrency = "SEK";
      debtorAccountObj = {
        bban: req.session.accountBban,
        currency: req.session.paymentCurrency,
      };
      creditorAccountObj = {
        iban: req.session.accountIban,
        currency: req.session.paymentCurrency,
      };
      break;

    case "NDEAFIHH": // USE: EUR, sepa-, IBAN
      api_url = global.apiRoute + global.paymentBaseRoute;
      req.session.paymentCurrency = "EUR";
      debtorAccountObj = {
        iban: req.session.accountIban,
        bban: req.session.accountBban,
        currency: req.session.paymentCurrency,
      };
      creditorAccountObj = {
        iban: "SE4850000000052310173371",
        bban: "0173371",
        currency: req.session.paymentCurrency,
      };
      break;

    case "OKOYFIHH": // USE: EUR, sepa-, creditorAddress, IBAN
      api_url = global.apiRoute + global.paymentBaseRoute;
      req.session.paymentCurrency = "EUR";
      creditorAccountObj = {
        iban: req.session.accountIban,
        currency: req.session.paymentCurrency,
      };
      creditorAddress = {
        street: "Malmskillnadsgatan",
        buildingNumber: "32",
        city: "Stockholm",
        postalCode: "11151",
        country: "SE",
      };
      break;

    case "DABASESX": // USE: GBP, domestic, BBAN
      api_url = global.apiRoute + "/psd2/paymentinitiation/v1/payments/domestic";
      req.session.paymentCurrency = "GBP";
      debtorAccountObj = {
        //bban:req.session.accountBban,
        iban: req.session.accountIban,
        currency: req.session.paymentCurrency,
      };
      creditorAccountObj = {
        //bban: "401975231",
        iban: "GB74NWBK15517312471731",
        currency: req.session.paymentCurrency,
      };
      bodyObj = {
        instructedAmount: {
          currency: req.session.paymentCurrency,
          amount: `${transferAmount}`,
        },
        debtorAccount: debtorAccountObj, // Error: missing debtor account if left empty or if field is left out.
        creditorName: "Open Payments Europe AB",
        creditorAccount: creditorAccountObj,
        remittanceInformationUnstructured: "OBP-IT",
        creditorAddress: creditorAddress,
      };
      break;

    default:
      break;
  }

  if (req.session.bicFi !== "DABASESX") {
    bodyObj = {
      instructedAmount: {
        currency: req.session.paymentCurrency,
        amount: `${transferAmount}`,
      },
      debtorAccount: debtorAccountObj,
      debtorAgent: "HANDSESS",
      creditorName: "Open Payments Europe AB",
      creditorAccount: creditorAccountObj,
      remittanceInformationUnstructured: "OBP-IT",
      creditorAddress: creditorAddress,
    };
  }

  /* HeaderObj for payment create initiation request */
  let headerObj = {
    authorization: "Bearer " + global.pisToken,
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-BicFi": req.session.bicFi,
    "X-Request-ID": guid,
    "PSU-ID": global.PSU_ID,
    "PSU-IP-Address": global.PSU_IP_Address,
    "PSU-User-Agent": "mozilla/5.0",
    "PSU-Http-Method": "POST",
  };

  // Request Logging >>>
  console.log("");
  console.log(`Create Payment Request:`.red.bold);
  console.log({
    api_url: api_url,
    method: "POST",
    withCredentials: true,
    credentials: "include",
    headers: headerObj,
    body: bodyObj,
  });
  console.log(`----- END -----`.red.bold);
  console.log("");
  // Request Logging <<<

  // FETCH >>>
  const fetch_response = await fetch(api_url, {
    method: "POST",
    withCredentials: true,
    credentials: "include",
    headers: headerObj,
    body: JSON.stringify(bodyObj),
  });
  const jsonData = await fetch_response.json();
  req.session.paymentId = jsonData.paymentId;
  // FETCH <<<

  // Response Logging >>>
  console.log("");
  console.log(`Create Payment Response:`.red.bold);
  console.log(jsonData);
  console.log(`----- END -----`.red.bold);
  console.log("");
  // Response Logging <<<

  // [Failed response]
  if (jsonData == null) res.status(404).json({ success: false, error: "Create payment initation response is empty" });
  else if ("tppMessages" in jsonData)
    res.status(400).json({ success: false, error: "Create payment initation request failed" });

  // [Successful response]
  res.json({
    status: "Success",
    data: jsonData,
    paymentStatus: jsonData.transactionStatus,
  });
});

// @desc    Start Payment Auth
// @route   POST /psd2/paymentinitiation/v1/payment-service/payment-product/paymentId/authorisations
// @access  PRIV Access Key
exports.startPaymentAuth = asyncHandler(async (req, res) => {
  if (global.pisToken === "" || !validToken(global.pisTimestamp)) {
    global.pisToken = await requestToken("pis");
  }

  let api_url;

  if (
    req.session.bicFi === "NDEASESS" ||
    req.session.bicFi === "HANDSESS" ||
    req.session.bicFi === "ESSESESS" ||
    req.session.bicFi === "SWEDSESS" ||
    req.session.bicFi === "DABASESX"
  ) {
    api_url =
      global.apiRoute + "/psd2/paymentinitiation/v1/payments/domestic/" + `${req.session.paymentId}/authorisations`;
  } else {
    api_url = global.apiRoute + global.paymentBaseRoute + `${req.session.paymentId}/authorisations`;
  }
  const guid = uuidv4();

  // 2.....
  console.log("");
  console.log(`Start Payment Request:`.red.bold);
  console.log({
    api_url: api_url,
    method: "POST",
    withCredentials: true,
    credentials: "include",
    headers: {
      authorization: "Bearer " + global.pisToken,
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-BicFi": req.session.bicFi,
      "X-Request-ID": guid,
      "PSU-ID": global.PSU_ID,
      "PSU-IP-Address": global.PSU_IP_Address,
      "PSU-User-Agent": "mozilla/5.0",
      "PSU-Http-Method": "POST",
    },
  });
  console.log(`----- END -----`.red.bold);
  console.log("");

  const fetch_response = await fetch(api_url, {
    method: "POST",
    withCredentials: true,
    credentials: "include",
    headers: {
      authorization: "Bearer " + global.pisToken,
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-BicFi": req.session.bicFi,
      "X-Request-ID": guid,
      "PSU-ID": global.PSU_ID,
      "PSU-IP-Address": global.PSU_IP_Address,
      "PSU-User-Agent": "mozilla/5.0",
      "PSU-Http-Method": "POST",
    },
  });
  const jsonData = await fetch_response.json();
  req.session.paymentAuthorisationId = jsonData.authorisationId;

  console.log("");
  console.log(`Start Payment Response:`.red.bold);
  console.log(jsonData);
  console.log(`----- END -----`.red.bold);
  console.log("");

  if (jsonData !== undefined && "scaMethods" in jsonData) {
    if (jsonData.scaMethods.length > 0) {
      req.session.paymentAuthenticationMethodId = jsonData.scaMethods[0].authenticationMethodId;
    }
  }

  // [Failed response]
  if (jsonData == null) res.status(404).json({ success: false, error: "Start payment auth response is empty" });
  else if ("tppMessages" in jsonData)
    res.status(400).json({ success: false, error: "Start payment auth request failed" });

  // [Successful response]
  res.json({
    status: "Success",
    data: jsonData,
    paymentScaStatus: jsonData.scaStatus,
    paymentAuthMethod: req.session.paymentAuthenticationMethodId,
  });
});

// @desc    PUT Update Payment PSU Data
// @route   PUT /psd2/paymentinitiation/v1/payment-service/payment-product/paymentId/authorisations/paymentAuthorisationId
// @access  PRIV Access Key
exports.updatePaymentPSUData = asyncHandler(async (req, res) => {
  if (global.pisToken === "" || !validToken(global.pisTimestamp)) {
    global.pisToken = await requestToken("pis");
  }

  let api_url;
  if (
    req.session.bicFi === "NDEASESS" ||
    req.session.bicFi === "HANDSESS" ||
    req.session.bicFi === "ESSESESS" ||
    req.session.bicFi === "SWEDSESS" ||
    req.session.bicFi === "DABASESX"
  ) {
    api_url =
      global.apiRoute +
      "/psd2/paymentinitiation/v1/payments/domestic/" +
      `${req.session.paymentId}/authorisations/${req.session.paymentAuthorisationId}`;
  } else {
    api_url =
      global.apiRoute +
      global.paymentBaseRoute +
      `${req.session.paymentId}/authorisations/${req.session.paymentAuthorisationId}`;
  }
  const guid = uuidv4();

  // 3.....
  console.log("");
  console.log(`Update Payment Request:`.red.bold);
  console.log({
    api_url: api_url,
    method: "PUT",
    withCredentials: true,
    credentials: "include",
    headers: {
      authorization: "Bearer " + global.pisToken,
      Accept: "application/json",
      "Content-Type": "application/json",
      "PSU-IP-Address": global.PSU_IP_Address,
      "X-BicFi": req.session.bicFi,
      "X-Request-ID": guid,
    },
    body: { authenticationMethodId: req.session.paymentAuthenticationMethodId },
  });
  console.log(`----- END -----`.red.bold);
  console.log("");

  const fetch_response = await fetch(api_url, {
    method: "PUT",
    withCredentials: true,
    credentials: "include",
    headers: {
      authorization: "Bearer " + global.pisToken,
      Accept: "application/json",
      "Content-Type": "application/json",
      "PSU-IP-Address": global.PSU_IP_Address,
      "X-BicFi": req.session.bicFi,
      "X-Request-ID": guid,
    },
    body: JSON.stringify({ authenticationMethodId: req.session.paymentAuthenticationMethodId }),
  });

  const jsonData = await fetch_response.json();

  console.log("");
  console.log(`Update Payment Response:`.red.bold);
  console.log(jsonData);
  console.log(`----- END -----`.red.bold);
  console.log("");

  const paymentStatus = await updatePaymentStatus(req.session.bicFi, req.session.paymentId); // Update Status

  // After link is edited, it is ready to be sent to the frontend - so that the user can click it.
  req.session.tpp_redirect_uri = "https://localhost:5000/externalCallback/payment";
  if (req.session.redirectAuth === true) {
    req.session.paymentscaOAuthHref = jsonData._links.scaOAuth.href;
    const regex = /\[CLIENT_ID\]/gi;
    const regex2 = /\[TPP_REDIRECT_URI\]/gi;
    const regex3 = /\&state=\[TPP_STATE\]/gi;
    req.session.paymentscaOAuthHref = req.session.paymentscaOAuthHref.replace(regex, global.client_id);
    req.session.paymentscaOAuthHref = req.session.paymentscaOAuthHref.replace(regex2, req.session.tpp_redirect_uri);
    req.session.paymentscaOAuthHref = req.session.paymentscaOAuthHref.replace(regex3, "");

    req.session.redirect = req.session.paymentscaOAuthHref;
    req.session.paymentStatus = paymentStatus;
    req.session.paymentScaStatus = jsonData.scaStatus;

    // [Failed response]
    if (jsonData == null) res.status(404).json({ success: false, error: "Update PSU payment response is empty" });
    else if ("tppMessages" in jsonData)
      res.status(400).json({ success: false, error: "Update PSU payment request failed" });

    // [Successful response]
    res.json({
      status: "Success",
      paymentStatus: paymentStatus,
      paymentScaStatus: jsonData.scaStatus,
      redirect: req.session.redirect,
      session: req.session,
    });
  } else {
    req.session.paymentStatus = paymentStatus;
    req.session.paymentScaStatus = jsonData.scaStatus;
    req.session.challengeData = jsonData.challengeData.data[0];
    res.json({
      status: "Success",
      paymentStatus: paymentStatus,
      paymentScaStatus: jsonData.scaStatus,
      challengeData: jsonData.challengeData.data[0],
      session: req.session,
    });
  }
});

/*
//
// STATUS UPDATES
//
*/

/* Update payment status */
updatePaymentStatus = async (bicFi, paymentId) => {
  guid = uuidv4();

  let api_url;
  if (
    bicFi === "NDEASESS" ||
    bicFi === "HANDSESS" ||
    bicFi === "ESSESESS" ||
    bicFi === "SWEDSESS" ||
    bicFi === "DABASESX"
  ) {
    api_url = global.apiRoute + "/psd2/paymentinitiation/v1/payments/domestic/" + `${paymentId}/status`;
  } else {
    api_url = global.apiRoute + global.paymentBaseRoute + `${paymentId}/status`;
  }

  const paymentStatus = await fetch(api_url, {
    method: "GET",
    withCredentials: true,
    credentials: "include",
    headers: {
      authorization: "Bearer " + global.pisToken,
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Request-ID": guid,
      "X-BicFi": bicFi,
      "PSU-IP-Address": global.PSU_IP_Address,
    },
  });
  const jsonConsentStatus = await paymentStatus.json();
  return await jsonConsentStatus.transactionStatus;
};

/* Update payment SCA status */
updatePaymentSCAStatus = async (bicFi, paymentId, paymentAuthorisationId) => {
  let api_url;
  if (
    bicFi === "NDEASESS" ||
    bicFi === "HANDSESS" ||
    bicFi === "ESSESESS" ||
    bicFi === "SWEDSESS" ||
    bicFi === "DABASESX"
  ) {
    api_url =
      global.apiRoute +
      "/psd2/paymentinitiation/v1/payments/domestic/" +
      `${paymentId}/authorisations/${paymentAuthorisationId}`;
  } else {
    api_url = global.apiRoute + global.paymentBaseRoute + `${paymentId}/authorisations/${paymentAuthorisationId}`;
  }

  guid = uuidv4();
  const paymentSCAStatus = await fetch(api_url, {
    method: "GET",
    withCredentials: true,
    credentials: "include",
    headers: {
      authorization: "Bearer " + global.pisToken,
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Request-ID": guid,
      "X-BicFi": bicFi,
      "PSU-IP-Address": global.PSU_IP_Address,
    },
  });
  const jsonPaymentSCAStatus = await paymentSCAStatus.json();

  return await jsonPaymentSCAStatus.scaStatus;
};
