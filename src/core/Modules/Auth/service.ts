import { cacheService } from "../../infrastructure/Cache/service.js";

class AuthService {
private readonly authCachePrefix = "myapp:auth";

 async createAuth () {
   const cacheKey = cacheService.createKey(this.authCachePrefix);
   return cacheService.getOrSet(
      cacheKey,
      async () => ({
        module: "Auth",
        status: "ready",
      }),
      5 * 60 * 1000,
    );
  }
};

const authService = new AuthService();
export default authService;
