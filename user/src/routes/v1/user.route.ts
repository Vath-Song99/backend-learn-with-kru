import {  NextFunction, Router, Request ,Response } from "express";
import { UserController } from "../../controllers/user.controller";
import StatusCode from "../../utils/http-status-code";
import { PATH_USER } from "../path-defs";


const Route = Router()


Route.post(PATH_USER.CREATEUSER, async (req: Request , res: Response , _next: NextFunction) =>{
    const token =  req.query.token as string
    try{
        const controller = new UserController();
        const newUser = await controller.Createuser(token);

        res.status(StatusCode.OK).json({
            message: 'Create user success',
            data: newUser
        })
    }catch(error: unknown){
        _next(error)
    }
});


Route.get(PATH_USER.GETUSER, async (req: Request, res: Response, _next: NextFunction) =>{
    const {userId} = req.params
    try{
        const controller = new UserController();
        const user = await controller.GetUser(userId);

        res.status(StatusCode.OK).json({
            message: "Get user Success",
            data: user
        })
    }catch(error: unknown){
        _next(error)
    }
})

export default Route