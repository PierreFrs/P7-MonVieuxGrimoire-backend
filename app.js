// dotenv file import for the db password
require("dotenv").config();
// import express and creates an instance of it
const express = require("express");
const app = express();
// MongoDB connection uri (uniform resource identifier)
const uri = `mongodb+srv://pierrefraisse90:${process.env.PASSWORD}@booksdb.bnllrtl.mongodb.net/?retryWrites=true&w=majority`;
// Mongoose import => handles db connexion
const mongoose = require("mongoose");
// Imports Node path module
const path = require("path");
// imports the routes for the user and the books
const booksRoutes = require("./routes/books");
const userRoutes = require("./routes/user");
// db connexion handler
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));
// Json express middleware => parses request headers
app.use(express.json());
// Cross Origins Ressource Sharing setter => allows front and back communication
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// User authentification requests redirection
app.use("/api/auth", userRoutes);

// Books requests redirection
app.use("/api/books", booksRoutes);
// Images file serving middleware
app.use("/images", express.static(path.join(__dirname, "images")));
// Exports the app (to the server)
module.exports = app;
