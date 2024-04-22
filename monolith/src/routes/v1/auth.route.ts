import { NextFunction,Request, Response, Router } from "express";
import { PATH_AUTH } from "../path-defs";
import { AuthController } from "../../controllers/auth.controller";
import StatusCode from "../../utils/http-status-code";
import { userValidate } from "../../middlewares/user-validate-middleware";
import { userValidateSchema } from "../../schemas/user-validate";

// Route
const Route = Router()

Route.post(PATH_AUTH.signUp, userValidate(userValidateSchema) , async (req: Request, res: Response, _next: NextFunction) =>{
    try{
        const controller = new AuthController();
        const requestBody = req.body;
        const respone = await controller.CreateAuth(requestBody);

        res.status(StatusCode.OK).json({
            messaage: 'success',
            users: respone
        })
    }catch(error: unknown){
    _next(error)
    }
    
})


export default Route

