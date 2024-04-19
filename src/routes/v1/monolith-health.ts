import { NextFunction,Request, Response, Router } from "express";
import { PATH_OK } from "../path-defs";


// Route
const Route = Router()

Route.get(PATH_OK,(req,res)=>{
res.send("hello world")
})