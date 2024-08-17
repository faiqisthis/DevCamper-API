import multer from 'multer';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
// Set storage engine
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, `${process.env.FILE_UPLOAD_PATH}`); // Folder where images will be stored
  },
  filename: function(req, file, cb) {
    const ext = path.extname(file.originalname); // Get the file extension
    cb(null, `image_${req.params.id}${ext}`); // Custom filename with bootcamp ID
  }
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize:process.env.FILE_UPLOAD_SIZE }, // 1MB limit
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('file');

export default upload;
