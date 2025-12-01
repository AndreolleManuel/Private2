import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { httpStatusCodes } from "../utils/index.js";

// Function to generate a unique key for each IP address
const ipOnly = (req) => ipKeyGenerator(req); // Using built-in IP key generator

// Function to generate a unique key for login attempts (IP + email)
const loginKeyGenerator = (req) => {
  const ip = ipKeyGenerator(req);
  const mail = req.body?.mail.toString().toLowerCase().trim() || "";
  return mail ? `${ip}-${mail}` : ip;
};

// Custom handler for rate limit exceeded
const makeHandler = (msg) => (req, res) =>
  res.status(httpStatusCodes.TOO_MANY_REQUESTS).json({ error: "Too Many Requests", details: msg });

// Middlewares
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  keyGenerator: ipOnly,
  message: { error: "Too many requests, please try again later." },
  handler: (req, res, /*next*/) => {
    makeHandler("Trop de requêtes. Veuillez réessayer plus tard.")(req, res);
  }
});
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: loginKeyGenerator,
  skipSuccessfulRequests: true,
  handler: makeHandler("Trop de tentatives. Veuillez réessayer plus tard."),
});
export const sensitiveLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: ipKeyGenerator,
  handler: makeHandler("Limite atteinte. Merci de réessayer plus tard."),
});