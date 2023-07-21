// imports sharp
const sharp = require("sharp");
// imports file system
const fs = require("fs");
// imports path
const path = require("path");
// image conversion function
const sharpConversion = async (req, res, next) => {
  // Checks if a file has been uploaded
  if (req.file) {
    try {
      // extracts the file data (buffer) and the file name
      const { buffer, originalname } = req.file;
      // Creates a new file instance, converts it in WebP format and converts it back into a buffer
      const convertedImageBuffer = await sharp(buffer)
        .webp({ quality: 20 })
        .toBuffer();
      // Unique file name => timestamp + original name (spaces => underscores)
      const timestamp = Date.now();
      const name = originalname.split(" ").join("_");
      const filename = `${timestamp}_${name.split(".")[0]}.webp`;
      // Path where the file is saved (./images)
      const imagePath = path.join(__dirname, "../images", filename);
      // Writes the buffer in the right folder
      fs.writeFileSync(imagePath, convertedImageBuffer);
      // updates the file name for the next middleware
      req.file.originalname = filename;
      req.file.filename = filename;
      // error handler
    } catch (error) {
      return next(error);
    }
  }
  // no file has been uploaded => next middleware
  next();
};

module.exports = sharpConversion;
