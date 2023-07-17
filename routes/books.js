const express = require("express");
const auth = require("../middleware/auth");
const router = express.Router();

const bookCtrl = require("../controllers/books");

router.get("/", bookCtrl.getAllBooks);
router.get("/:id", bookCtrl.getOneBook);
router.get("/bestrating", bookCtrl.getBestRatedBooks);
router.post("/", auth, bookCtrl.createBook);
router.put("/:id", auth, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);
router.post("/:id/rating", auth, bookCtrl.rateBook);

module.exports = router;
