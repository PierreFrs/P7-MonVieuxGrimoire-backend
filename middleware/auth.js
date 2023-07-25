require("dotenv").config();
const secretTokenKey = `${process.env.TOKEN_KEY}`;
// json web token package import
const jwt = require("jsonwebtoken");
// export to be used as a middleware
module.exports = (req, res, next) => {
  try {
    // splits the authorization header and keeps the token
    const token = req.headers.authorization.split(" ")[1];
    // Token verification with secret key
    const decodedToken = jwt.verify(token, secretTokenKey);
    // Gets the user ID
    const userId = decodedToken.userId;
    // Make the user ID go through in order to be re-used by other middlewares
    req.auth = {
      userId: userId,
    };
    // Go to next middleware
    next();
    // error handler (401 : unauthorized)
  } catch (error) {
    res.status(401).json({ error });
  }
};
