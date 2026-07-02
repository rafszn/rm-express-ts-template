import streamifier from "streamifier";
import cfg from "../../../../global/environment.config.js";
import { StorageContract } from "../contracts/storage.contract.js";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import {
  DeleteFileInput,
  StorageResourceType,
  UploadedFile,
  UploadFileInput,
} from "../types.js";

const getUploadOptions = (resourceType: StorageResourceType) => {
  if (resourceType === "image") {
    return {
      transformation: [
        { width: 1200, crop: "limit" },
        { quality: "auto", fetch_format: "auto" },
      ],
    };
  }

  return {};
};

export class CloudinaryStorageAdapterImpl implements StorageContract {
  constructor() {
    if (
      !cfg.CLOUDINARY_NAME ||
      !cfg.CLOUDINARY_API_KEY ||
      !cfg.CLOUDINARY_API_SECRET
    ) {
      throw new Error("Cloudinary configuration is incomplete");
    }

    cloudinary.config({
      cloud_name: cfg.CLOUDINARY_NAME,
      api_key: cfg.CLOUDINARY_API_KEY,
      api_secret: cfg.CLOUDINARY_API_SECRET,
    });
  }

  async upload(input: UploadFileInput): Promise<UploadedFile> {
    const { buffer, folder = "uploads", resourceType = "auto" } = input;

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          ...getUploadOptions(resourceType),
        },
        (error, result?: UploadApiResponse) => {
          if (error || !result) {
            return reject(error ?? new Error("Cloudinary upload failed"));
          }

          resolve({
            url: result.secure_url,
            key: result.public_id,
            resourceType: result.resource_type as "image" | "video" | "raw",
          });
        },
      );

      streamifier.createReadStream(buffer).pipe(stream);
    });
  }

  async delete(input: DeleteFileInput): Promise<void> {
    const { key, resourceType = "image" } = input;

    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        key,
        { resource_type: resourceType },
        (error, result) => {
          if (error) return reject(error);

          if (!result || result.result !== "ok") {
            return reject(
              new Error(`Cloudinary deletion failed: ${result?.result}`),
            );
          }

          resolve();
        },
      );
    });
  }
}
