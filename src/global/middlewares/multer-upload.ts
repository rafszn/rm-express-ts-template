import multer from "multer";
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, WEBP, and GIF images are allowed"));
    }
  },
});

export default multerUpload;

/**
  MULTER File object. {
  size: number;
  buffer: Buffer;
  encoding: string;
  mimetype: string;
  fieldname: string;
  originalname: string;
  }

  multerUpload.single("cover") - Middleware to handle single file uploads with the field name "cover".
  in controller, the uploaded file can be accessed via req.file
  
 
  multerUpload.array("images", 5) - Middleware to handle multiple file uploads with the field name "images", allowing up to 5 files.
  in controller, the uploaded files can be accessed via req.files. example: req.files for the array of images.
 

  multerUpload.fields([
    { name: "cover", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]) - Middleware to handle multiple file uploads with different field names and constraints.
  in controller, the uploaded files can be accessed via req.files, which will be an object with keys "cover" and "images". example: req.files.cover[0] for the single cover image, and req.files.images for the array of images.

 **/
