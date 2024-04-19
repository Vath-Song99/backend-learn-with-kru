import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv'
import Route from './routes/v1/auth.route';
import { errorHandler } from './error/errorsHandler';
import Routehealths from './routes/v1/monolith.health';
//app
dotenv.config({path: 'configs/.env'});
const app: Application = express();
const AUTH_ROUTE = process.env.ROUTE as string;
console.log("auth",AUTH_ROUTE)
//global middleware
app.use(express.json())
app.use(express.static('public'));
app.use(AUTH_ROUTE, Route)
app.use(AUTH_ROUTE,Routehealths)
app.get(AUTH_ROUTE, (req: Request, res: Response) =>{
    res.json({
        message: "Hello world"
    })
})

//error handler globale middleware
app.use(errorHandler)

export default app