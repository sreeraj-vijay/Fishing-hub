const multer=require("multer")
const path=require("path")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "../public/product-images"));
    },
    filename: function (req, file, cb) {
      const fileName = Date.now() + path.extname(file.originalname);
      cb(null, fileName);
    }
  });
 module.exports = {
    upload: multer({ storage: storage }).array("file"),
    update: multer({ storage: storage }).array("images"),
}