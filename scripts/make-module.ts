/// <reference types="node" />

import fs from "fs";
import path from "path";

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const pluralize = (value: string) => {
  if (value.endsWith("s")) return value;
  if (value.endsWith("y")) return `${value.slice(0, -1)}ies`;
  return `${value}s`;
};

const entityArg = process.argv[2];

if (!entityArg) {
  console.error("❌ Please provide a module name");
  console.error("Example: npm run make:module user");
  process.exit(1);
}

const entityName = entityArg.toLowerCase();
const EntityName = capitalize(entityName);
const EntitiesName = capitalize(pluralize(entityName));

const rootDir = process.cwd();
const entitiesDir = path.join(rootDir, "src", "core", "Modules");
const entityDir = path.join(entitiesDir, EntitiesName);

if (fs.existsSync(entityDir)) {
  console.error(`❌ Module "${EntitiesName}" already exists`);
  process.exit(1);
}

const routesTemplate = `import { Router } from "express";
import { get${EntityName} } from "./controller.js";
import { create${entityName}Schema } from "./dto.js";
import { validate } from "../../../global/middlewares/validator.js";

const router = Router();

router.get("/", validate(create${entityName}Schema), get${EntityName});

export default router;
`;

const serviceTemplate = `import { cacheService } from "../../infrastructure/Cache/service.js";

class ${EntityName}Service {
private readonly ${entityName}CachePrefix = "myapp:${entityName}";

 async create${EntityName} () {
   const cacheKey = cacheService.createKey(this.${entityName}CachePrefix);
   return cacheService.getOrSet(
      cacheKey,
      async () => ({
        module: "${EntityName}",
        status: "ready",
      }),
      5 * 60 * 1000,
    );
  }
};

const ${entityName}Service = new ${EntityName}Service();
export default ${entityName}Service;
`;

const controllerTemplate = `import ${entityName}Service from "./service.js"
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../global/constants/http-status-codes.js";

export const get${EntityName} = async (
  req: Request<object, object, object>,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await ${entityName}Service.create${EntityName}()

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "${entityName} creation successful",
      data,
    });
  } catch (error) {
    next(error);
  }
};
`;

const dtoTemplate = `import { z } from "zod";

export const create${entityName}Schema = z.object({
  type: z.string().min(2, "type is required"),
});

export type Create${entityName}DTO = z.infer<typeof create${entityName}Schema>;
`;

const docsTemplate = `// ${EntityName} docs go here`;

const globalTypesTemplate = `export {}

declare global {}
`;

fs.mkdirSync(entityDir, { recursive: true });

fs.writeFileSync(path.join(entityDir, "routes.ts"), routesTemplate);
fs.writeFileSync(path.join(entityDir, "service.ts"), serviceTemplate);
fs.writeFileSync(path.join(entityDir, "controller.ts"), controllerTemplate);
fs.writeFileSync(path.join(entityDir, "dto.ts"), dtoTemplate);
fs.writeFileSync(path.join(entityDir, "docs.ts"), docsTemplate);
fs.writeFileSync(path.join(entityDir, "types.d.ts"), globalTypesTemplate);

const routesFilePath = path.join(rootDir, "src", "Routes.ts");

if (fs.existsSync(routesFilePath)) {
  let routesFile = fs.readFileSync(routesFilePath, "utf-8");

  const routeVarName = `${EntityName}Routes`;
  const routePath = pluralize(entityName);

  const importLine = `import ${routeVarName} from "./core/Modules/${EntitiesName}/routes.js";`;
  const useLine = `router.use("/${routePath}", ${routeVarName});`;

  if (!routesFile.includes(importLine)) {
    const lastImportIndex = routesFile.lastIndexOf("import");
    const insertIndex = routesFile.indexOf("\n", lastImportIndex) + 1;

    routesFile =
      routesFile.slice(0, insertIndex) +
      importLine +
      "\n" +
      routesFile.slice(insertIndex);
  }

  if (!routesFile.includes(useLine)) {
    const routerUseRegex = /router\.use\([^)]*\);\s*/g;
    const matches = routesFile.match(routerUseRegex);

    if (matches && matches.length > 0) {
      // insert after last router.use
      const lastMatch = matches[matches.length - 1];
      const index = routesFile.lastIndexOf(lastMatch) + lastMatch.length;

      routesFile =
        routesFile.slice(0, index) + useLine + "\n" + routesFile.slice(index);
    } else {
      // no router.use exists, insert after Router()
      routesFile = routesFile.replace(
        /const router = Router\(\);\s*/,
        `const router = Router();\n\n${useLine}\n`,
      );
    }
  }

  fs.writeFileSync(routesFilePath, routesFile);
  console.log("🧩 Routes.ts updated");
} else {
  console.warn("⚠️ src/Routes.ts not found. Skipped route registration.");
}

console.log(`✅ Module "${EntitiesName}" created.`);
console.log(`📁 Location: ${entityDir}`);
