const fs = require("fs");

module.exports = {
  /* ### Config variables ### */
  client_id: process.env.OPENPAYMENTS_CLIENT_ID,
  client_secret: process.env.OPENPAYMENTS_CLIENT_SECRET,
  // Openpayments Domains
  apiRoute: process.env.OPENPAYMENTS_API_ROUTE,
  authRoute: process.env.OPENPAYMENTS_AUTH_ROUTE,
  // Client certificate - used in production mode
  httpsClientPlatformOptions: {
    pfx: fs.readFileSync("./spectre.com.pfx"),
    passphrase: process.env.CERTIFICATE_PASSWORD,
  },

  /* ### Defining base routes - used to fetch data from OpenPayments API ### */
  connectTokenRoute: "/connect/token",
  aspspBaseRoute: "/psd2/aspspinformation/v1/aspsps/",
  consentBaseRoute: "/psd2/consent/v1/consents/",
  consentInitAuthRoute: "consentId/authorisations/",
  accountBaseRoute: "/psd2/accountinformation/v1/accounts",
  paymentBaseRoute: "/psd2/paymentinitiation/v1/payments/sepa-credit-transfers/",
  paymentInitAuthRoute: "paymentId/authorisations/",

  /* ### Define tokens and timestamps ### */
  aspspTimestamp: 0,
  aspspToken: "",
  aisTimestamp: 0,
  aisToken: "",
  pisTimestamp: 0,
  pisToken: "",

  /* ## Option variables used in every Open Payments API request ## */
  PSU_IP_Address: "192.168.0.1",
  PSU_ID: "990505",

  /* ### Currently not in use ### */
  // clientsInConsentAuthorization: [],
  // clientsInPaymentAuthorization: [],

  /* ### Define other global variables: [Alphabetic Order] */
  // NOT RELEVANT for PIS
  bankCardTarget: -1,
  bankCards: [
    {
      bicFi: "-",
      bicFiLogoUrl: "",
      accNames: [],
      userNames: [],
      balances: [],
      currency: "",
      incomeAvgs: [],
      withdrawAvgs: [],
      sampleSize: [],
    },
    {
      bicFi: "-",
      bicFiLogoUrl: "",
      accNames: [],
      userNames: [],
      balances: [],
      currency: "",
      incomeAvgs: [],
      withdrawAvgs: [],
      sampleSize: [],
    },
    {
      bicFi: "-",
      bicFiLogoUrl: "",
      accNames: [],
      userNames: [],
      balances: [],
      currency: "",
      incomeAvgs: [],
      withdrawAvgs: [],
      sampleSize: [],
    },
  ], //
};
