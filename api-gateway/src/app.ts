import express, { Application, NextFunction, Request , Response } from "express";
import getConfig from "./utils/createConfig";
import compression from "compression";
import cookieSession from "cookie-session";
import hpp from "hpp";
import helmet from "helmet";
import cors from "cors";
import { applyRateLimit } from "./middlewares/rate-limit";
// import { StatusCode } from "./utils/consts";
// import { logger } from "./utils/logger";
import applyProxy from "./middlewares/proxy";
// import { verifyUser } from "./middlewares/auth-middleware";
// import unless from "./middlewares/unless-route";
import { errorHandler } from "./middlewares/error-handler";
import { StatusCode } from "./utils/consts";
import { logger } from "./utils/logger";
import unless from "./middlewares/unless-route";
import { verifyUser } from "./middlewares/auth-middleware";
const app: Application = express();

const config = getConfig();

// ===================
// Security Middleware
// ===================
app.set("trust proxy", 1);
app.use(compression());
app.use(
  cookieSession({
    name: "session",
    keys: [`${config.cookieSecretKeyOne}`, `${config.cookieSecretKeyTwo}`],
    maxAge: 24 * 7 * 3600000,
    secure: config.env !== "development", // update with value from config
    ...(config.env !== "development" && {
      sameSite: "none",
    }),
  })
);

// Prevent HTTP Parameter Pollution attacks
app.use(hpp());
// Prevent Some Security:
// - Stops browsers from sharing your site's vistor data
// - Stops your website from being displayed in a frame
// - Prevent XSS, etc.
app.use(helmet());

// Only Allow Specific Origin to Access API Gateway (Frontend)
app.use(
  cors({
    origin:
      getConfig().env === "development" ? "*" : [config.clientUrl as string],
    credentials: true, // attach token from client
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Apply Limit Request
applyRateLimit(app);

// Hide Express Server Information
app.disable("x-powered-by");

// ===================
// JWT Middleware
// ===================
app.use(unless("/v1/auth", verifyUser));
-
// ===================
// Proxy Routes
// ===================
applyProxy(app);

// ====================
// Global Error Handler
// ====================
app.use("*", (req: Request, res: Response, _next: NextFunction) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  logger.error(`${fullUrl} endpoint does not exist`);
  res
    .status(StatusCode.NotFound)
    .json({ message: "The endpoint called does not exist." });
});

app.use(errorHandler);

export default app;
