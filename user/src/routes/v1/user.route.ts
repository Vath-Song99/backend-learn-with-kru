import {  NextFunction, Router, Request ,Response } from "express";
import { PATH_USER } from "../path-defs";
import { UserController } from "../../controllers/user.controller";
import StatusCode from "../../utils/http-status-code";


const Route = Router()


Route.get(PATH_USER.BASE , async (req: Request , res: Response , _next: NextFunction) =>{
    const token = (req as Request).session!.jwt;
    try{
        const controller = new UserController();
        const newUser = await controller.Createuser(token);

        res.json(StatusCode.OK).json({
            message: 'Create success',
            data: newUser
        })
    }catch(error: unknown){
        _next(error)
    }
})

export default Route