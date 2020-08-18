/* ## Imports / Dependencies ## */
const ErrorResponse = require("../utils/errorResponse.js");
const asyncHandler = require("../middleware/async");
const fetch = require("node-fetch");
const { v4: uuidv4 } = require("uuid");
let global = require("../globals");

const SessionContextPIS = require("../sessionContexts/SessionContextPIS.js");
const SessionContextAIS = require("../sessionContexts/SessionContextAIS.js");

/*
  -
  - Backend API logic defined in this folder. Endpoints defined in the "routes" folder. 
  -
*/

instantiateSessionContextPIS = function (req) {
  new SessionContextPIS(req.session);
};

instantiateSessionContextAIS = function (req) {
  new SessionContextAIS(req.session);
};

// @desc    Get ASPSP list (banks)
// @route   GET /psd2/aspspinformation/v1/aspsps
// @access  Public
exports.getAspspList = asyncHandler(async (req, res) => {
  if (!validToken(global.aspspTimestamp)) {
    global.aspspToken = await requestToken("aspsp");
  }
  /*
  if (!("PIS" in req.session) && req.params.processType === "PIS") {
    instantiateSessionContextPIS(req);
  } else if (!("AIS" in req.session) && req.params.processType === "AIS") {
    instantiateSessionContextAIS(req); 
  } 
  */

  const api_url = global.apiRoute + global.aspspBaseRoute;
  const guid = uuidv4(); // Example: 383f00aa-3ae0-4e13-aded-3b3acefb5389

  if (!("UIState" in req.session)) {
    req.session.UserUID = guid;
    req.session.UIState = "SELECT_BANK"; // "SELECT_BANK", "AUTHENTICATE_CONSENT", "SELECT_ACCOUNT", "AUTHENTICATE_PAYMENT", "PAYMENT_DONE"
    req.session.UIFlow = "UNKNOWN"; // "REDIRECT", "DECOUPLE"
  } else if (req.session.UIState === "PAYMENT_DONE") {
    req.session.UIState = "SELECT_BANK";
    req.session.UIFlow = "UNKNOWN";
  }

  const fetch_response = await fetch(api_url, {
    method: "GET",
    withCredentials: true,
    credentials: "include",
    headers: {
      authorization: "Bearer " + global.aspspToken,
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Request-ID": guid,
    },
    agentOptions: global.httpsClientPlatformOptions,
  });
  const jsonData = await fetch_response.json();

  /* console.log("ASPSP LIST RESPONSE:");
  console.log(jsonData); */

  // [Failed response]
  if (jsonData == null) await res.status(404).json({ success: false, error: "ASPSP List response is empty" });
  else if ("tppMessages" in jsonData)
    await res.status(400).json({ success: false, error: "ASPSP List request failed" });

  // [Successful response]
  await res.status(200).json({
    status: "Success",
    data: jsonData.aspsps, // Send data result to frontend
    session: req.session,
  });
});

// @desc    Get a specific ASPSP
// @route   GET /psd2/aspspinformation/v1/aspsps/:bicfi
// @access  Public
exports.getAspspDetails = asyncHandler(async (req, res) => {
  if (!validToken(global.aspspTimestamp)) {
    global.aspspToken = await requestToken("aspsp");
  }

  if (req.session.UIState === "SELECT_BANK") {
    req.session.UIState = "AUTHENTICATE_CONSENT";
  }
  req.session.bicFi = await req.params.bicfi;

  const api_url = global.apiRoute + global.aspspBaseRoute + `${req.session.bicFi}`;
  const guid = uuidv4();

  const fetch_response = await fetch(api_url, {
    method: "GET",
    withCredentials: true,
    credentials: "include",
    headers: {
      authorization: "Bearer " + global.aspspToken,
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Request-ID": guid,
    },
    agentOptions: global.httpsClientPlatformOptions,
  });
  const jsonData = await fetch_response.json();

  req.session.bankSelected = jsonData;
  req.session.aspspAuthMethod = jsonData.supportedAuthorizationMethods[0].name;
  req.session.redirectUri = jsonData.supportedAuthorizationMethods[0].uri;
  req.session.redirectAuth = true; // Default

  req.session.UIFlow = "REDIRECT";
  if (req.session.redirectUri === "") {
    req.session.redirectAuth = false;
    req.session.UIFlow = "DECOUPLE";
  }

  req.session.bicFiLogoUrl = jsonData.logoUrl;

  // [Failed response]
  if (jsonData == null) res.status(404).json({ success: false, error: "ASPSP details response is empty" });
  else if ("tppMessages" in jsonData) res.status(400).json({ success: false, error: "ASPSP details request failed" });

  // [Successful response]
  await res.json({
    status: "Success",
    data: jsonData,
    redirectAuth: req.session.redirectAuth,
    session: req.session,
  });
});

//
// Helper functions. No more endpoints below...
//

/* ### RequestToken: Creates a new token [valid for 1 hour] ### */
requestToken = async (tokenType) => {
  const api_url = global.authRoute + global.connectTokenRoute;
  let tokenScope;

  if (tokenType === "aspsp") {
    global.aspspTimestamp = Date.now();
    tokenScope = "aspspinformation private";
  }
  if (tokenType === "ais") {
    aisTimestamp = Date.now();
    tokenScope = "accountinformation private";
  }
  if (tokenType === "pis") {
    pisTimestamp = Date.now();
    tokenScope = "paymentinitiation private";
  }

  const fetch_response = await fetch(api_url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: serializeToUrlencoding({
      client_id: global.client_id,
      client_secret: global.client_secret,
      grant_type: "client_credentials",
      scope: tokenScope,
    }),
    agentOptions: global.httpsClientPlatformOptions,
  });
  const jsonData = await fetch_response.json();

  return jsonData.access_token;
};

/* ### SerializeToUrlencoding: [Convert JS object to urlencoded string] ### */
serializeToUrlencoding = function (obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
};

/* ## ValidUntil: [] ## */
validUntil = () => {
  var d = new Date();
  d.setDate(d.getDate() + 2);
  d = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) + " ";
  return d;
};

/* ### ValidToken: [Return true if token is valid, Date.now() is milliseconds since 1970.] ### */
validToken = (timestamp) => {
  const timeValid = 3600000;
  if (timestamp + timeValid < Date.now()) {
    return false;
  }
  return true;
};

/* ### TokenTimeLeft: [Returns how many seconds until token becomes invalid]. ### */
/* let tokenTimeLeft = (timestamp) => {
  const timeValid = 3600000;
  if (timestamp + timeValid < Date.now()) {
    return -1;
  }
  return (Date.now() - timestamp) / 1000;
}; */
