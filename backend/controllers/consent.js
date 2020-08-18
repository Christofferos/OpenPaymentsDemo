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

// @desc    POST Create Consent
// @route   POST /psd2/consent/v1/consents
// @access  PRIV Access Key
exports.createConsent = asyncHandler(async (req, res) => {
  if (global.aisToken === "" || !validToken(global.aisTimestamp)) {
    global.aisToken = await requestToken("ais");
  }

  const api_url = global.apiRoute + global.consentBaseRoute;
  const guid = uuidv4();
  const validUntilDate = validUntil();
  let frequencyPerDay = 0;
  req.session.bicFi === "SWEDSESS" ? (frequencyPerDay = 4) : "";

  const fetch_response = await fetch(api_url, {
    method: "POST",
    withCredentials: true,
    credentials: "include",
    headers: {
      authorization: "Bearer " + global.aisToken,
      "Content-Type": "application/json",
      "PSU-IP-Address": global.PSU_IP_Address,
      "X-BicFi": req.session.bicFi,
      "X-Request-ID": guid,
      "PSU-User-Agent": "mozilla/5.0",
      "PSU-Http-Method": "POST",
    },
    body: JSON.stringify({
      access: {},
      recurringIndicator: true,
      validUntil: validUntilDate, // 2 days from today
      frequencyPerDay: frequencyPerDay,
      combinedServiceIndicator: false,
    }),
    agentOptions: global.httpsClientPlatformOptions,
  });

  const jsonData = await fetch_response.json();

  req.session.consentId = await jsonData.consentId;
  // console.log(`ConsentId: ${req.session.consentId}`.blue);

  // [Failed response]
  if (jsonData == null) res.status(404).json({ success: false, error: "Create consent response is empty" });
  else if ("tppMessages" in jsonData) res.status(400).json({ success: false, error: "Create consent request failed" });

  // [Successful response]
  res.json({
    status: "Success",
    data: jsonData,
  });
});

// @desc    POST Start Consent Auth
// @route   POST /psd2/consent/v1/consents
// @access  PRIV Access Key
exports.startConsentAuth = asyncHandler(async (req, res) => {
  if (global.aisToken === "" || !validToken(global.aisTimestamp)) {
    global.aisToken = await requestToken("ais");
  }

  const api_url = global.apiRoute + global.consentBaseRoute + `${req.session.consentId}/authorisations`;
  const guid = uuidv4();

  const fetch_response = await fetch(api_url, {
    method: "POST",
    withCredentials: true,
    credentials: "include",
    headers: {
      authorization: "Bearer " + global.aisToken,
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Request-ID": guid,
      "X-BicFi": req.session.bicFi,
      "PSU-IP-Address": global.PSU_IP_Address,
      "PSU-ID": global.PSU_ID,
    },
    body: JSON.stringify({}),
  });

  const jsonData = await fetch_response.json();

  req.session.consentAuthorisationId = jsonData.authorisationId;
  req.session.authenticationMethodId = jsonData.scaMethods[0].authenticationMethodId;

  // [Failed response]
  if (jsonData == null) res.status(404).json({ success: false, error: "Start consent response is empty" });
  else if ("tppMessages" in jsonData) res.status(400).json({ success: false, error: "Start consent request failed" });

  // [Successful response]
  res.json({
    status: "Success",
    data: jsonData,
  });
});

// @desc    PUT Update Consent PSU Data
// @route   PUT /psd2/consent/v1/consents/consentId/authorisations
// @access  PRIV Access Key
exports.updateConsentPSUData = asyncHandler(async (req, res) => {
  if (global.aisToken === "" || !validToken(global.aisTimestamp)) {
    global.aisToken = await requestToken("ais");
  }

  const api_url =
    global.apiRoute +
    global.consentBaseRoute +
    `${req.session.consentId}/authorisations/${req.session.consentAuthorisationId}`;
  const guid = uuidv4();

  const fetch_response = await fetch(api_url, {
    method: "PUT",
    withCredentials: true,
    credentials: "include",
    headers: {
      authorization: "Bearer " + global.aisToken,
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Request-ID": guid,
      "X-BicFi": req.session.bicFi,
      "PSU-IP-Address": global.PSU_IP_Address,
    },
    body: JSON.stringify({
      authenticationMethodId: req.session.authenticationMethodId,
    }),
  });
  const jsonData = await fetch_response.json();

  const consentStatus = await updateConsentStatus(req.session.bicFi, req.session.consentId); // Update Status
  req.session.consentStatus = consentStatus;
  req.session.consentScaStatus = jsonData.scaStatus;
  req.session.tpp_redirect_uri = "https://localhost:5000/externalCallback/consent"; // Default

  // Not relevant for payment flow.
  if ("accountoverview" in req.headers) {
    req.session.tpp_redirect_uri = "https://localhost:5000/externalCallback/accountOverview"; // console.log("AccountOverview: " + req.headers.accountoverview);
  }

  // [Failed response]
  if (jsonData == null) res.status(404).json({ success: false, error: "Update PSU consent response is empty" });
  else if ("tppMessages" in jsonData)
    res.status(400).json({ success: false, error: "Update PSU consent request failed" });

  // [Successful response]
  if (req.session.redirectAuth === true) {
    req.session.consentscaOAuthHref = jsonData._links.scaOAuth.href;
    const regex = /\[CLIENT_ID\]/gi;
    const regex2 = /\[TPP_REDIRECT_URI\]/gi;
    const regex3 = /\&state=\[TPP_STATE\]/gi;
    req.session.consentscaOAuthHref = req.session.consentscaOAuthHref.replace(regex, global.client_id);
    req.session.consentscaOAuthHref = req.session.consentscaOAuthHref.replace(regex2, req.session.tpp_redirect_uri);
    req.session.consentscaOAuthHref = req.session.consentscaOAuthHref.replace(regex3, "");
    req.session.redirect = req.session.consentscaOAuthHref;

    res.json({
      status: "Success",
      consentStatus: consentStatus,
      scaStatus: jsonData.scaStatus,
      redirect: req.session.consentscaOAuthHref,
    });
  } else {
    req.session.psuMessage = jsonData.psuMessage;
    req.session.challengeData = jsonData.challengeData.data[0];

    res.json({
      status: "Success",
      consentStatus: consentStatus,
      scaStatus: jsonData.scaStatus,
      psuMessage: jsonData.psuMessage,
      challengeData: jsonData.challengeData.data[0],
    });
  }
});

/*
//
// STATUS UPDATES
//
*/

/* Update consent status */
updateConsentStatus = async (bicFi, consentId) => {
  let guid = uuidv4();
  const consentStatus = await fetch(global.apiRoute + `/psd2/consent/v1/consents/${consentId}/status`, {
    method: "GET",
    withCredentials: true,
    credentials: "include",
    headers: {
      authorization: "Bearer " + global.aisToken,
      Accept: "application/json",
      "Accept-Encoding": "gzip, deflate, br",
      "Content-Type": "application/json",
      "X-Request-ID": guid,
      "X-BicFi": bicFi,
      "PSU-IP-Address": global.PSU_IP_Address,
    },
  });
  const jsonConsentStatus = await consentStatus.json();
  return await jsonConsentStatus.consentStatus;
};

/* Update consent SCA status */
updateConsentSCAStatus = async (bicFi, consentId, consentAuthorisationId) => {
  guid = uuidv4();
  const consentSCAStatus = await fetch(
    global.apiRoute + global.consentBaseRoute + `${consentId}/authorisations/${consentAuthorisationId}`,
    {
      method: "GET",
      withCredentials: true,
      credentials: "include",
      headers: {
        authorization: "Bearer " + global.aisToken,
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Request-ID": guid,
        "X-BicFi": bicFi,
        "PSU-IP-Address": global.PSU_IP_Address,
      },
    }
  );
  const jsonConsentSCAStatus = await consentSCAStatus.json();
  return await jsonConsentSCAStatus.scaStatus;
};
