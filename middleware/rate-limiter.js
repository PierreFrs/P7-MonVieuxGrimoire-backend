const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  // 15min
  windowMs: 15 * 60 * 1000,
  // 100 requests max
  max: 100,
  message:
    "Trop de requêtes depuis cette IP, veuillez réessayer dans 15 minutes.",
});

module.exports = limiter;
