require("dotenv").config();
const express = require("express");
const app = express();
const uri = `mongodb+srv://pierrefraisse90:${process.env.PASSWORD}@booksdb.bnllrtl.mongodb.net/?retryWrites=true&w=majority`;
const mongoose = require("mongoose");

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

app.post("/api/books", (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: String,
  });
});

app.get("/api/books", (req, res, next) => {
  const books = [
    {
      userId: "oeihfzeoi",
      title: "Mon premier livre",
      author: "Toto",
      imageUrl:
        "https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg",
      year: 2022,
      genre: "Roman",
      ratings: [
        {
          userId: "user1",
          grade: 5,
        },
      ],
      averageRating: 4.2,
    },
    {
      userId: "hifhbzizs",
      title: "Mon second livre",
      author: "Tata",
      imageUrl:
        "https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg",
      year: 2022,
      genre: "Roman",
      ratings: [
        {
          userId: "user2",
          grade: 5,
        },
      ],
      averageRating: 4.2,
    },
  ];
  res.status(200).json(books);
});

module.exports = app;
