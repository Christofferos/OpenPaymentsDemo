/* ## Imports / Dependencies ## */
const ErrorResponse = require("../utils/errorResponse.js");
const asyncHandler = require("../middleware/async");
const fetch = require("node-fetch");
let global = require("../globals");

/*
  -
  - Backend API logic defined in this folder. Endpoints defined in the "routes" folder. 
  -
*/

// @desc    Collect consent code and authorize consent
// @route   GET /externalCallback/consent
// @access  PRIV Access Token
exports.consentCodeAuthorize = asyncHandler(async (req, res) => {
  if (req.session.UIState === "AUTHENTICATE_CONSENT") {
    req.session.UIState = "SELECT_ACCOUNT";
  }
  req.session.consentCode = req.query.code;
  //console.log(`Consent-Code: ${req.session.consentCode}`.red.bold);
  req.session.redirectUri = req.session.tpp_redirect_uri;

  // @desc  Activate Consent OAuth
  await fetch(global.authRoute + global.connectTokenRoute, {
    method: "POST",
    withCredentials: true,
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-ConsentId": req.session.consentId,
      "X-ConsentAuthorisationId": req.session.consentAuthorisationId,
    },
    body: serializeToUrlencoding({
      client_id: global.client_id,
      client_secret: global.client_secret,
      code: req.session.consentCode,
      redirect_uri: req.session.redirectUri,
      scope: "accountinformation private",
      grant_type: "authorization_code",
    }),
  });

  req.session.consentStatus = await updateConsentStatus(req.session.bicFi, req.session.consentId);
  req.session.consentScaStatus = await updateConsentSCAStatus(
    req.session.bicFi,
    req.session.consentId,
    req.session.consentAuthorisationId
  );

  // console.log("Consent Auth finished.");

  // Send user back to frontend:
  await res.redirect("http://localhost:3000/payment");
});

// @desc    Collect payment code and authorize payment
// @route   GET /externalCallback/payment
// @access  PRIV Access Token
exports.paymentCodeAuthorize = asyncHandler(async (req, res) => {
  // @desc    Activate Payment OAuth
  if (req.session.UIState === "AUTHENTICATE_PAYMENT") {
    req.session.UIState = "PAYMENT_DONE";
  }
  const paymentCode = req.query.code;
  console.log(`Payment-Code: ${paymentCode}`.red.bold);
  req.session.paymentAuthCode = paymentCode;

  req.session.redirectUri = "https://localhost:5000/externalCallback/payment";

  const fetchObj = await fetch(global.authRoute + global.connectTokenRoute, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      "X-PaymentId": req.session.paymentId,
      "X-PaymentAuthorisationId": req.session.paymentAuthorisationId,
      "PSU-User-Agent": "mozilla/5.0",
      "PSU-Http-Method": "POST",
    },
    body: serializeToUrlencoding({
      client_id: global.client_id,
      client_secret: global.client_secret,
      code: req.session.paymentAuthCode,
      redirect_uri: req.session.redirectUri,
      grant_type: "authorization_code",
      scope: "paymentinitiation private",
    }),
  });
  const content = await fetchObj.json();
  req.session.paymentStatus = await updatePaymentStatus(req.session.bicFi, req.session.paymentId);
  req.session.paymentScaStatus = await updatePaymentSCAStatus(
    req.session.bicFi,
    req.session.paymentId,
    req.session.paymentAuthorisationId
  );

  console.log("Payment Auth finished.");
  console.log(content);

  // Send user back to frontend.
  await res.redirect("http://localhost:3000/payment");
});

// @desc    Polling for finalised/extended status
// @route   GET /externalCallback/qrDone
// @access  PUBLIC
exports.decoupledAuthentication = asyncHandler(async (req, res, next) => {
  // CONSENT
  if (req.session.UIState === "AUTHENTICATE_CONSENT" || req.session.UIState === "SELECT_ACCOUNT") {
    const result = await poll(
      () => updateConsentSCAStatus(req.session.bicFi, req.session.consentId, req.session.consentAuthorisationId),
      3000,
      10
    );
    // Success
    if (result === "finalised" || result === "exempted") {
      req.session.consentScaStatus = result;
      await setTimeout(async () => {
        await res.redirect("http://localhost:3000/payment");
      }, 3000); // Pretend it takes 3 seconds
    }
    // Fail
    else {
      console.log("Consent authorisation failed. Please press OK to restart the payment process.");
      req.session.UIState = "SELECT_BANK";
      req.session.UIFlow = "UNKNOWN";
      await res.redirect("http://localhost:3000/payment");
      // await window.location.reload(false);
    }
  }
  // PAYMENT
  else if (req.session.UIState === "AUTHENTICATE_PAYMENT" || req.session.UIState === "PAYMENT_DONE") {
    const result = await poll(
      () => updatePaymentSCAStatus(req.session.bicFi, req.session.paymentId, req.session.paymentAuthorisationId),
      3000,
      10
    );
    // Success
    if (result === "finalised" || result === "exempted") {
      req.session.paymentScaStatus = result;
      await setTimeout(async () => {
        await res.redirect("http://localhost:3000/payment");
      }, 3000); // Pretend it takes 3 seconds
    }
    // Fail
    else if (result !== undefined) {
      console.log("Payment authorisation failed. Please press OK to restart the payment process.");
      req.session.UIState = "SELECT_BANK";
      req.session.UIFlow = "UNKNOWN";
      await res.redirect("http://localhost:3000/payment");
    }
  }
  // Something went wrong.
  else {
    console.log("UIState is:");
    console.log(req.session.UIState);
    return next(new ErrorResponse("UIState does not match payment flow", 400));
  }
});

/* ## Polling ## */
poll = async (func, interval, maxAttempts) => {
  let attempts = 0;

  const executePoll = async (resolve, reject) => {
    const result = await func();
    attempts++;

    await console.log(result);
    await console.log("Poll func executed..");

    if (checkScaStatus(result)) {
      return resolve(result);
    } else if (maxAttempts && attempts === maxAttempts) {
      return reject(new Error("Exceeded max attempts"));
    } else {
      setTimeout(executePoll, interval, resolve, reject);
    }
  };

  return new Promise(executePoll);
};

checkScaStatus = async (result) => {
  if (result !== undefined) {
    if (result.toLowerCase() === "finalised" || result.toLowerCase() === "exempted") return true;
    else return false;
  } else return false;
};

/* 
  -
  - AIS: Account Overview Redirect Endpoint Below
  -
*/

// @desc    Collect consent code and authorize consent
// @route   GET /externalCallback/accountOverview
// @access  PRIV Access Token
exports.accountOverviewConsentAuthorize = asyncHandler(async (req, res) => {
  const consentCode = req.query.code;
  //console.log(`Consent-Code: ${consentCode}`.red.bold);
  req.session.consentCode = consentCode;

  req.session.redirectUri = req.session.tpp_redirect_uri;

  await fetch(global.authRoute + global.connectTokenRoute, {
    method: "POST",
    withCredentials: true,
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-ConsentId": req.session.consentId,
      "X-ConsentAuthorisationId": req.session.consentAuthorisationId,
    },
    body: serializeToUrlencoding({
      client_id: global.client_id,
      client_secret: global.client_secret,
      code: req.session.consentCode,
      redirect_uri: req.session.redirectUri,
      scope: "accountinformation private",
      grant_type: "authorization_code",
    }),
  });

  // console.log("Consent Auth finished.");

  // Send context to frontend:
  const bicfi = "&bicfi=" + req.session.bicFi;
  const consentMethod = "&consentMethod=" + req.session.authenticationMethodId;
  // - -
  await res.redirect("http://localhost:3000/ais?state=consentDone" + bicfi + consentMethod);
});
