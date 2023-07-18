// const sharp = require("sharp");
// const fs = require("fs");

// const sharpConversion = async (req, res, next) => async (req, res) => {
//   fs.access("./images", (error) => {
//     if (error) {
//       fs.mkdirSync("./images");
//     }
//   });
//   const { buffer, originalname } = req.file;
//   const timestamp = new Date().toISOString();
//   const ref = `${timestamp}-${originalname}.webp`;
//   await sharp(buffer)
//     .webp({ quality: 20 })
//     .toFile("./images/" + ref);
//   const link = `./images/${ref}`;
//   return res.json({ filename });
// };

// module.exports = sharpConversion;

const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const sharpConversion = async (req, res, next) => {
  if (req.file) {
    try {
      const { buffer, originalname } = req.file;
      const convertedImageBuffer = await sharp(buffer)
        .webp({ quality: 20 })
        .toBuffer();

      const timestamp = Date.now();
      const name = originalname.split(" ").join("_");
      const filename = `${timestamp}_${name.split(".")[0]}.webp`;
      const imagePath = path.join(__dirname, "../images", filename);
      fs.writeFileSync(imagePath, convertedImageBuffer);

      req.file.originalname = filename;
      req.file.filename = filename;
    } catch (error) {
      return next(error);
    }
  }

  next();
};

module.exports = sharpConversion;
