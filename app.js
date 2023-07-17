const express = require("express");

const app = express();

app.use("/api/books", (req, res, next) => {
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
