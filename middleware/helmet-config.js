const helmet = require("helmet");

const helmetConfig = helmet({
  crossOriginResourcePolicy: false,
});

module.exports = helmetConfig;
