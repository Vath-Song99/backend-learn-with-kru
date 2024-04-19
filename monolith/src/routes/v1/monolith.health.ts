import { NextFunction,Request, Response, Router } from "express";
import { PATH_OK } from "../path-defs";


// Route
const Routehealths = Router()

Routehealths.get(PATH_OK,(req,res)=>{
res.send("hello world")
})

export default Routehealths