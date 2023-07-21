// multer import (handle entering files in http requests)
const multer = require("multer");
// Choose memoryStorage as storage unit => buffer
const storage = multer.memoryStorage();
// multer has to save the file in the buffer
const upload = multer({ storage });
// Multer waits for ONE IMAGE file
module.exports = upload.single("image");
