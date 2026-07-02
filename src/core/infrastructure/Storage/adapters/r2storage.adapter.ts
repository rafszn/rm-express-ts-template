import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import path from "path";
import { extension } from "mime-types";
import { StorageContract } from "../contracts/storage.contract.js";
import { DeleteFileInput, UploadedFile, UploadFileInput } from "../types.js";
import cfg from "../../../../global/environment.config.js";

export class R2StorageAdapterImpl implements StorageContract {
  private bucket: string;
  private client: S3Client;
  private publicBaseUrl: string;

  constructor() {
    const bucket = cfg.R2_BUCKET_NAME;
    const accountId = cfg.R2_ACCOUNT_ID;
    const accessKeyId = cfg.R2_ACCESS_KEY_ID;
    const publicBaseUrl = cfg.R2_PUBLIC_BASE_URL;
    const secretAccessKey = cfg.R2_SECRET_ACCESS_KEY;

    if (
      !bucket ||
      !accountId ||
      !accessKeyId ||
      !publicBaseUrl ||
      !secretAccessKey
    ) {
      throw new Error("Cloudflare R2 configuration is incomplete");
    }

    this.bucket = bucket;
    this.publicBaseUrl = publicBaseUrl.replace(/\/$/, "");

    this.client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async upload(input: UploadFileInput): Promise<UploadedFile> {
    const {
      buffer,
      folder = "uploads",
      filename,
      resourceType = "image",
      contentType,
    } = input;

    const resolvedContentType = contentType || "application/octet-stream";

    const extFromContentType = extension(resolvedContentType);

    const baseName = filename?.replace(/\.[^/.]+$/, "") || crypto.randomUUID();

    const finalFilename =
      extFromContentType && !path.extname(baseName)
        ? `${baseName}.${extFromContentType}`
        : filename || baseName;

    const safeFolder = folder.replace(/^\/|\/$/g, "");
    const key = `${safeFolder}/${finalFilename}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: resolvedContentType,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );

    return {
      key,
      url: `${this.publicBaseUrl}/${key}`,
      resourceType: resourceType === "auto" ? "raw" : resourceType,
    };
  }

  async delete(input: DeleteFileInput): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: input.key,
      }),
    );
  }
}
