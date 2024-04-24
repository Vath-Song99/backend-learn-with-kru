import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv'
import { errorHandler } from './error/errorsHandler';
// import Routehealths from './routes/v1/monolith.health';
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../public/swagger.json";
import { RegisterRoutes } from './routes/v1/routes';
import Route from './routes/v1/auth.route';

//app
dotenv.config({path: 'configs/.env'});
const app: Application = express();
const AUTH_ROUTE = process.env.ROUTE as string;

//global middleware
app.use(express.static('public'));
app.use(express.json())
app.set('view engine', 'ejs');

// RegisterRoutes(app);
const ROUTE = "/api/v1"
app.use(ROUTE, Route)
// handle swaggerUi
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// app.use(AUTH_ROUTE,Routehealths)


//error handler globale middleware
app.use(errorHandler)

export default app