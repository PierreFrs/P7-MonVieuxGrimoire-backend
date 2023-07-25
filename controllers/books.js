const Book = require("../models/Book");
const fs = require("fs");

exports.getAllBooks = (req, res, next) => {
  // Finds all books from the db
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneBook = (req, res, next) => {
  // find one book from the db corresponding to the id provided
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => res.status(404).json({ error }));
};

exports.getBestRatedBooks = (req, res, next) => {
  // Sorts the db from highest rating to the lowest, picks the 3 first books and returns the array
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(404).json({ error }));
};

exports.createBook = async (req, res, next) => {
  // Converts the book to a bookObject from the request body
  const bookObject = JSON.parse(req.body.book);
  // id => provided by mongoDB ; userID => provided by req.auth
  delete bookObject._id;
  delete bookObject._userId;
  // Creates a new book instance
  const book = new Book({
    // spread operator (copy all the bookObject properties into the new book), gets the user id from req.auth,
    ...bookObject,
    userId: req.auth.userId,
    // Retrieves the compressed image in "./images"
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  // Saves the book to the DB and handles errors
  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Livre enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.modifyBook = async (req, res, next) => {
  // Checks if an image is sent, if yes it updates the URL, if not it just sends the request body
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  // Deletes the user ID (will be replaced with the one in req.auth)
  delete bookObject._userId;
  // Find the book corresponding to the requested id
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Checks if the user is authorized to modify the book
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Non-autorisé" });
      } else {
        // Updates the book in the DB
        Book.updateOne(
          // Makes sure it's the right book
          { _id: req.params.id },
          // updates the book and the id to be sure it stays the same
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Livre modifié !" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    // error handler
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  // Finds a book by its ID
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // Verifies that the book's userId corresponds the actual userId
      if (book.userId != req.auth.userId) {
        // error if no
        res.status(401).json({ message: "Non authorisé" });
      } else {
        // Extracts the image url and deletes it from the folder (fs.unlink)
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          // Deletes the book from the DB
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Livre supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    // error handler
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.rateBook = (req, res, next) => {
  // gets the user ID
  const userId = req.auth.userId;
  // gets the grade
  const grade = req.body.rating;
  // error if one is missing
  if (!userId || !grade) {
    return res
      .status(400)
      .json({ error: "userId or grade missing from request." });
  }
  // Finds the book to rate with the id
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      // error if no book
      if (!book) {
        return res.status(404).json({ error: "Book not found." });
      }
      // boolean to find if a rating exists or not
      const existingRating = book.ratings.find(
        (rating) => String(rating.userId) === String(userId)
      );
      // if there is a rating associated with the userId => updates the rating
      if (existingRating) {
        return res.status(401).json({ error: "Vous avez déjà noté ce livre." });
        // else, adds the rating to the DB
      } else {
        book.ratings.push({ userId, grade });
      }

      // Recalculate the average rating
      const totalRatings = book.ratings.length;
      const sumGrades = book.ratings.reduce(
        (sum, rating) => sum + rating.grade,
        0
      );
      book.averageRating = parseFloat((sumGrades / totalRatings).toFixed(1));
      // Marks the rating field as modified
      book.markModified("ratings");
      // saves the book to the DB
      return book.save();
    })
    // Sends back the updated book
    .then((updatedBook) => {
      if (!updatedBook) {
        return res.status(500).json({ error: "Failed to save book." });
      }
      res.status(200).json(updatedBook);
    })
    // error handler
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while rating the book." });
    });
};
