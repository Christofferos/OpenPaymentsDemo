// const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse.js");
const { request } = require("express");

// @desc    Request aspsp information token
// @route   POST /api/v1/connect/token
// @access  Private
exports.requestAspspInfoToken = (req, res, next) => {
  try {
    const dataAPI = {};

    request({ url: "https://auth.sandbox.openbankingplatform.com/connect/token" }, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(400).json({ type: "error", message: error.message });
      }
      dataAPI = res.json(JSON.parse(body));
    });

    res.status(201).json({
      success: true,
      data: dataAPI,
    });
  } catch (err) {
    return next(new ErrorResponse(`Request token failed ${req.params.id}`, 400));
  }
};
