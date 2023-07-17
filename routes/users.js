const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/users");

router.post("/signup", userCtrl.signUser);
router.post("/login", userCtrl.logUser);

module.exports = router;
