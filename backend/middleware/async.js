// AsyncHandler - Applying the DRY principle - "Don't Repeat Yourself"
// This file let's us avoid using: try {} catch {} code blocks - in the server controllers when doing our api requests.
// We wrap all our controllers in asyncHandler, which makes the errorHandler fire off when something goes wrong.

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
