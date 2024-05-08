import express, { Application } from "express";
import { errorHandler } from "./middlewares/errorsHandler";
// import Routehealths from './routes/v1/monolith.health';
import path from "path";
import cors from "cors";
import dotenv from 'dotenv'
import AuthRoute from "./routes/v1/auth.route";
import getConfig from "./utils/config";
import loggerMiddleware from "./middlewares/logger-handler";
import CrudRoute from "./routes/v1/crud.route";

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
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(loggerMiddleware);

const ROUTE_BASE = "/v1/auth";
app.use(ROUTE_BASE, AuthRoute);
app.use(ROUTE_BASE, CrudRoute)
// handle swaggerUi

// app.use(AUTH_ROUTE,Routehealths)

//error handler globale middleware
app.use(errorHandler);
export default app;
