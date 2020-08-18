const express = require("express");
const {
  addSelectedItem,
  deleteSelectedItem,
  deleteAllItems,
  incrementSelectedItem,
  decrementSelectedItem,
} = require("../controllers/cart.js");

const router = express.Router();

// Base route
router.route("/addSelectedItem/:id").post(addSelectedItem);
router.route("/deleteSelectedItem/:id").delete(deleteSelectedItem);
router.route("/deleteAllItems").delete(deleteAllItems);
router.route("/incrementSelectedItem/:id").post(incrementSelectedItem);
router.route("/decrementSelectedItem/:id").post(decrementSelectedItem);

module.exports = router;
