import express, { Application, Request, Response } from "express";
import { errorHandler } from "./middlewares/errorsHandler";
// import Routehealths from './routes/v1/monolith.health';
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../public/swagger.json";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import AuthRoute from "./routes/v1/auth.route";
import cookieParser from "cookie-parser";
import getConfig from "./utils/config";
import loggerMiddleware from "./middlewares/logger-handler";

//app
dotenv.config({ path: "configs/.env" });
const app: Application = express();

//global middleware
app.set("trust proxy", 1);
app.use(
  cors({
    origin: getConfig().apiGateway,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(loggerMiddleware);

const ROUTE = "/v1/auth";
app.post(ROUTE, async (_req: Request, res: Response) => {
  try {
    res.json({
      message: "Hello world",
    });
  } catch (error) {}
});
app.use(ROUTE, AuthRoute);
// handle swaggerUi
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// app.use(AUTH_ROUTE,Routehealths)

//error handler globale middleware
app.use(errorHandler);
export default app;