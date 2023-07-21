const express = require("express");
// Imports router module
const router = express.Router();
// Imports auth middleware => authentification required routes
const auth = require("../middleware/auth");
// Imports multer middleware => images uploads
const multer = require("../middleware/multer-config");
// Imports sharpConversion middleware => converts to webP format
const sharpConversion = require("../middleware/sharp-conversion");
// Imports controllers for books requests
const bookCtrl = require("../controllers/books");
// CRUD requests (path, authentification, upload, conversion, controller)
router.get("/", bookCtrl.getAllBooks);
router.get("/bestrating", bookCtrl.getBestRatedBooks);
router.get("/:id", bookCtrl.getOneBook);
router.post("/", auth, multer, sharpConversion, bookCtrl.createBook);
router.put("/:id", auth, multer, sharpConversion, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);
router.post("/:id/rating", auth, bookCtrl.rateBook);

module.exports = router;
