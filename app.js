require("dotenv").config();
const express = require("express");
const app = express();
const uri = `mongodb+srv://pierrefraisse90:${process.env.PASSWORD}@booksdb.bnllrtl.mongodb.net/?retryWrites=true&w=majority`;
const mongoose = require("mongoose");

const booksRoutes = require("./routes/books");
const usersRoutes = require("./routes/users");

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

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

// Users requests
app.use("/api/auth", usersRoutes);

// Books requests
app.use("/api/books", booksRoutes);

module.exports = app;
