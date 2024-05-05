import { NextFunction,Request, Response, Router } from "express";
import { PATH_AUTH } from "../path-defs";
import { AuthController } from "../../controllers/auth.controller";
import StatusCode from "../../utils/http-status-code";

// Route
const AuthRoute = Router()




AuthRoute.get(PATH_AUTH.logout , async (_req: Request ,res: Response ,_next: NextFunction) =>{
  
  try{
    
    res.clearCookie('authenticated');
    res.status(StatusCode.OK).json({
      success: true,
      message: "logout success"
    })
  }catch(error: unknown){
    _next(error)
  }
});



AuthRoute.get(PATH_AUTH.verify, async (req: Request ,res: Response, _next: NextFunction) =>{
  const token = req.query.token as string
  try{
    const controller = new AuthController();
    const respone = await controller.VerifyEmail(token)

    res.status(StatusCode.OK).json({
      success: true,
      jwtToken: respone.jwtToken
    })
  }catch(error: unknown){
    _next(error)
  }
})



export default AuthRoute

