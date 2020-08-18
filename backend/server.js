/* 
Written by: Kristopher Werlinder,
Latest Update: 2020-08-04,
*/

/* ## Imports ## */
const express = require("express");

const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" }); /* ## Load env variables ## */

const session = require("express-session");
// const mongoose = require("mongoose");
// Database not currently used.
// const MongoStore = require("connect-mongo")(session);
// const connectDB = require("./config/db.js");
// connectDB();

const morgan = require("morgan");
const colors = require("colors");
const errorHandler = require("./middleware/error.js");
const rateLimit = require("express-rate-limit");

const fetch = require("node-fetch");
const { v4: uuidv4 } = require("uuid");

/* ## Https locally ## */
const https = require("https");
const http = require("http");
const fs = require("fs");
let options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

/* ## Load global variables ## */
var global = require("./globals");

/* ### Route files ### */
const aspsp = require("./routes/aspsp.js");
const consent = require("./routes/consent.js");
const ais = require("./routes/ais.js");
const pis = require("./routes/pis.js");
const redirect = require("./routes/redirect.js");
const cart = require("./routes/cart.js");

/* ## Start Express ## */
const app = express();

/* ## Session ## */
app.use(
  session({
    secret: "openpayments",
    resave: false,
    saveUninitialized: false,
    // store: new MongoStore({ mongooseConnection: mongoose.connection }),
    genid: function (req) {
      return uuidv4(); // use UUIDs for session IDs
    },
  })
);

/* ## Body parser ## */
app.use(express.urlencoded({ extended: true })); // used for parsing application/x-www-form-urlencoded [auth API calls]
app.use(express.json()); // used for parsing application/json [Majority of Open Payments API calls]

/* ## Rate limiting ## */
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 1000, // Limit to 1000 requests per 10 min
});
app.use(limiter);

/* ## Dev logging middleware ## */
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

/* ## Mount Routers: [] ## */
app.use("/psd2/aspspinformation/v1/aspsps", aspsp);
app.use("/psd2/consent/v1/consents", consent);
app.use("/psd2/accountinformation/v1/accounts", ais);
app.use("/psd2/paymentinitiation/v1/payment-service/payment-product", pis);
app.use("/cart", cart);
app.use("/externalCallback", redirect);
// [Router prefix could be added for professional purpose: "/api/v1"]

/* Backend routes below.. that have not yet recieved a controller file */
app.get("/userSession", async (req, res) => {
  res.json({
    session: req.session,
  });
});

app.post("/editSessionState/:state", async (req, res) => {
  if (req.params.state === "selectBank") {
    req.session.UIState = "SELECT_BANK";
    req.session.UIFlow = "UNKNOWN";
  } else if (req.params.state === "fetchAccounts") {
    req.session.UIState = "SELECT_ACCOUNT";
  }
  res.json({
    session: req.session,
  });
});

app.post("/setProductPage/:page", async (req, res) => {
  if (req.params.page === "Smartphone") {
    req.session.productPage = "smartphone";
  } else if (req.params.page === "Laptop") {
    req.session.productPage = "laptop";
  } else if (req.params.page === "Gaming") {
    req.session.productPage = "gaming";
  }
  res.json({
    session: req.session,
  });
});

/* Irrelavant for payment process */
app.post("/aisInstanceDone", async (req, res) => {
  global.bankCardTarget++;
  console.log("-");
  await console.log(global.bankCardTarget);
  console.log("-");
  await res.json({
    status: "Success",
  });
});

/* Irrelavant for payment process */
app.get("/getBankCards", async (req, res) => {
  await console.log("HERE");
  await console.log(global.bankCards);
  await res.json({
    status: "Success",
    bankCards: global.bankCards,
  });
});

/* # Use custom made middleware # */
app.use(errorHandler);

/* # Deployment uses: process.env.PORT # */
const PORT = process.env.PORT || 5000;

/* ## (Server Options Defined) Https server configuration ## */
const server = https
  .createServer(options, app)
  .listen(PORT, console.log(`Https server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

/* # Handle unhandled promise rejections # */
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
