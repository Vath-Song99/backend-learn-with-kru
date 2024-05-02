import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { errorHandler } from "./error/errorsHandler";
// import Routehealths from './routes/v1/monolith.health';
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../public/swagger.json";

import path from "path";
import { corsOptions } from "./utils/cors-options";
import cors from "cors";
import TeacherRoute from "./routes/v1/teacher.route";
import { RegisterRoutes } from "./routes/v1/routes";
import cookieParser from "cookie-parser";

//app
dotenv.config({ path: "configs/.env" });
const app: Application = express();

//global middleware
app.use(cors(corsOptions));
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const ROUTE = "/v1/teachers";
app.use(ROUTE, TeacherRoute);
// handle swaggerUi
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// app.use(AUTH_ROUTE,Routehealths)

//error handler globale middleware
app.use(errorHandler);
export default app;
