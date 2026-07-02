import { v2 as cloudinary } from "cloudinary";
import cfg from "../../../global/environment.config.js";

cloudinary.config({
  cloud_name: cfg.CLOUDINARY_NAME,
  api_key: cfg.CLOUDINARY_API_KEY,
  api_secret: cfg.CLOUDINARY_API_SECRET,
});

export default cloudinary;
