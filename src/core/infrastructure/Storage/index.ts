import { StorageService } from "./service.js";
import { R2StorageAdapterImpl } from "./adapters/r2storage.adapter.js";
import { CloudinaryStorageAdapterImpl } from "./adapters/cloudinary.adapter.js";

const provider = process.env.STORAGE_PROVIDER ?? "r2";

const adapter =
  provider === "r2"
    ? new R2StorageAdapterImpl()
    : new CloudinaryStorageAdapterImpl();

const storageService = new StorageService(adapter);

export default storageService;
