const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// GET all books
router.get("/", (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
});

// GET one book
router.get("/:id", (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
});

// GET best rated books
router.get("/bestrating", (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(500).json({ error }));
});

// POST one book
router.post("/", (req, res, next) => {
  const book = new Book({
    ...req.body,
  });
  book
    .save()
    .then(() => res.status(201).json({ message: "Livre enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
});

// PUT (update) one book
router.put("/:id", (req, res, next) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body })
    .then(() => res.status(200).json({ message: "Livre modifié !" }))
    .catch((error) => res.status(400).json({ error }));
});

// DELETE one book
router.delete("/:id", (req, res, next) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Livre supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
});

// POST book rating
router.post("/:id/rating", (req, res, next) => {
  Book.findById(req.params.id)
    .then((book) => {
      book.ratings.push(req.body);
      return book.save();
    })
    .then(() => res.status(200).json({ message: "Livre noté !" }))
    .catch((error) => res.status(500).json({ error }));
});

module.exports = router;
