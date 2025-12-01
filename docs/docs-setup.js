// src/docs/docs-setup.js
import path from "node:path";
import { fileURLToPath } from "node:url";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function mountDocs(app) {
  // charge la spec YAML au démarrage
  const openapi = YAML.load(path.join(__dirname, "openapi.yaml"));

  // Basic auth simple en prod (optionnel)
  function docsAuth(req, res, next) {
    if (process.env.NODE_ENV !== "production") return next();
    const auth = req.headers.authorization || "";
    const ok =
      auth.startsWith("Basic ") &&
      Buffer.from(auth.split(" ")[1], "base64").toString() ===
        `${process.env.DOCS_USER}:${process.env.DOCS_PASS}`;
    return ok
      ? next()
      : res.set("WWW-Authenticate", "Basic").status(401).end("Auth required");
  }

  // expose la spec JSON pour générateurs externes (Postman, etc.)
  app.get("/openapi.json", (_req, res) => res.json(openapi));

  // Swagger UI (navigateur)
  app.use(
    "/docs",
    docsAuth,
    swaggerUi.serve,
    swaggerUi.setup(openapi, {
      explorer: true,
      swaggerOptions: { persistAuthorization: true },
      customSiteTitle: "GreenRoots API – Docs",
    })
  );
}
