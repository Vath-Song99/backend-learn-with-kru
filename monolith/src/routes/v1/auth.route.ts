import { NextFunction,Request, Response, Router } from "express";
import { PATH_SIGNUP } from "../path-defs";
import { AuthController } from "../../controllers/auth.controller";
import StatusCode from "../../utils/http-status-code";
import { userValidate } from "../../middlewares/user-validate-middleware";
import { userValidateSchema } from "../../schemas/user-validate";

// Route
const Route = Router()

Route.post(PATH_SIGNUP, userValidate(userValidateSchema) , async (req: Request, res: Response, _next: NextFunction) =>{
    try{
        const controller = new AuthController();
        const requestBody = req.body;
        const respone = await controller.Signup(requestBody);

        res.status(StatusCode.OK).json({
            messaage: 'success',
            users: respone
        })
    }catch(error: unknown){
    _next(error)
    }
    
})


export default Route