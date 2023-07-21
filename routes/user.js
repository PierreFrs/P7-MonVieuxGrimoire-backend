const express = require("express");
// Imports router module
const router = express.Router();
// Imports controllers for user
const userCtrl = require("../controllers/user");
// http requests (path, controller)
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
