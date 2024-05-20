import multer from "multer";

const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, "./public/images/uploads");
   },
   filename: function (req, file, cb) {
      cb(null, `${Date.now().toString()}-${file.originalname.trim()}`);
   },
});

const upload = multer({ storage: storage });
export default upload;
