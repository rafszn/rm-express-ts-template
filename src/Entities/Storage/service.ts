import cloudinary from "./config.js";
import streamifier from "streamifier";

const StorageService = {
  uploadBufferToCloudinary: async function ({
    buffer,
    folder = "platform_uploads",
  }: {
    buffer: Buffer;
    folder?: string;
  }): Promise<CloudinaryUploadResult> {
    if (!StorageService.checkCloudinaryConfig()) {
      throw new Error("Cloudinary configuration is incomplete");
    }
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [
            { width: 1200, crop: "limit" },
            { quality: "auto", fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error || !result)
            return reject(error ?? new Error("Cloudinary upload failed"));
          resolve({ url: result.secure_url, key: result.public_id });
        },
      );

      streamifier.createReadStream(buffer).pipe(stream);
    });
  },
  checkCloudinaryConfig: function (): boolean {
    const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
      cloudinary.config();
    return Boolean(
      CLOUDINARY_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET,
    );
  },
};

export default StorageService;
