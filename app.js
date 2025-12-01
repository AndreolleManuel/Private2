import express from "express";
import session from "express-session";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";
import { xss } from "express-xss-sanitizer";

import paymentsWebhookRouter from "./routes/payment.webhook.js";
import { errorHandler, globalLimiter } from "./middlewares/index.js";
import { apiRouter } from "./routes/index.js";
import { adminRouter } from "./routes/admin.routes.js";
import { mountDocs } from "./docs/docs-setup.js";


const app = express();
const port = process.env.PORT || 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// EJS
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));


// Middlewares 
app.use("/api/payments/webhook", paymentsWebhookRouter); // Stripe webhook must come before express.json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Sessions
app.use(session({
  name: "sessionId",
  secret: process.env.SESSION_SECRET || "default_secret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 2 // 2 hours
  }
}));
app.use((req, res, next) => {
  res.locals.session = req.session || {};
  next();
});

// Security
app.use("/api", globalLimiter);
app.use(cors({
  origin: "http://localhost:5173",     // front origin
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // allowed methods
  allowedHeaders: ["Content-Type", "Authorization"] // allowed headers
}));
app.use(xss());

app.use("/admin", adminRouter);

// Routes
app.get("/", (req, res) => {
  res.send("🌱 Bienvenue sur l’API GreenRoots !");
});
app.use("/api", apiRouter);
app.use("/admin", adminRouter);
mountDocs(app);

// Error handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`🌱 API GreenRoots à l'écoute sur le port http://localhost:${port}`);
});

export default app;