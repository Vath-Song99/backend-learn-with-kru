import {  NextFunction, Router, Request ,Response } from "express";
import { UserController } from "../../controllers/user.controller";
import StatusCode from "../../utils/http-status-code";
import { PATH_USER } from "../path-defs";


const Route = Router()


Route.post(PATH_USER.CREATEUSER, async (req: Request , res: Response , _next: NextFunction) =>{
    const requestBody = req.body;
    try{
        const controller = new UserController();
        const newUser = await controller.Createuser(requestBody);

        res.status(StatusCode.OK).json({
            message: 'Create user success',
            data: newUser
        })
    }catch(error: unknown){
        _next(error)
    }
});


Route.get(PATH_USER.GETUSER, async (req: Request, res: Response, _next: NextFunction) =>{
    const {authId} = req.params
    try{
        const controller = new UserController();
        const user = await controller.GetUser(authId);

        res.status(StatusCode.OK).json({
            message: "Get user Success",
            data: user
        })
    }catch(error: unknown){
        _next(error)
    }
});

export default Route