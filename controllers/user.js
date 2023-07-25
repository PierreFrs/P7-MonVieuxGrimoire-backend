require("dotenv").config();
const secretTokenKey = `${process.env.TOKEN_KEY}`;
// imports bcrypt for password hash
const bcrypt = require("bcrypt");
// User database model
const User = require("../models/User");
// json web token
const jwt = require("jsonwebtoken");
// signup function
exports.signup = (req, res, next) => {
  // password hash => 10 turns
  bcrypt
    .hash(req.body.password, 10)
    // new User instance with hashed PWS
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      // Saves the new user to the DB
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    // error handler (500 : internal server)
    .catch((error) => res.status(500).json({ error }));
};
// Login function
exports.login = (req, res, next) => {
  // find the email corresponding user
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        // returns an error if the user isn't found
        return res
          .status(401)
          .json({ message: "Paire login/mot de passe incorrecte" });
      }
      // PW comparison with bcrypt
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          // Returns error if not valid
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Paire login/mot de passe incorrecte" });
          }
          // Returns token if valid
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, secretTokenKey, {
              expiresIn: "24h",
            }),
          });
        })
        // error handler
        .catch((error) => {
          res.status(500).json({ error });
        });
    })
    // error handler
    .catch((error) => {
      res.status(500).json({ error });
    });
};
