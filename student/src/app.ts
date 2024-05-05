import express, { Application } from "express";
import { errorHandler } from "./middlewares/errorsHandler";
// import Routehealths from './routes/v1/monolith.health';
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../public/swagger.json";

import path from "path";
import cors from "cors";
import getConfig from "./utils/config";
import loggerMiddleware from "./middlewares/logger-handler";
import { PATH_STUDENT } from "./routes/path-defs";
import Route from "./routes/v1/student.route";
import { extractTokenMiddleware } from "./middlewares/extract-token";

//app
const app: Application = express();

//global middleware
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
app.use(express.json({limit: "100mb"}));
app.use(express.urlencoded({ extended: true, limit: "200mb" }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(loggerMiddleware);
app.use(extractTokenMiddleware);

app.use(PATH_STUDENT.BASE, Route)
// handle swaggerUi
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// app.use(AUTH_ROUTE,Routehealths)

//error handler globale middleware
app.use(errorHandler);
export default app;
