import { NextFunction,Request, Response, Router } from "express";
import { PATH_AUTH } from "../path-defs";
import { AuthController } from "../../controllers/auth.controller";
import StatusCode from "../../utils/http-status-code";
import { userValidate } from "../../middlewares/user-validate-middleware";
import { userValidateSchema } from "../../schemas/user-validate";
import { GoogleOauthConfig } from "../../utils/oauth-configs";

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

Route.get(
    PATH_AUTH.googleOauth,
    async (req: Request, res: Response, _next: NextFunction) => {
      try {
        const redirectUri = process.env.REDIRECT_URI as string;
        const clienId = process.env.CLIENT_ID as string;
        
        const googleConfig = await GoogleOauthConfig.getInstance()
        const authUrl = await googleConfig.AuthConfigUrl(clienId, redirectUri);
        res.redirect(authUrl);
      } catch (error: unknown) {
        _next(error);
      }
    }
  );
  
  //Signin callback with google
  Route.get(
    PATH_AUTH.googleOauthCallBack,
    async (req: Request, res: Response, _next: NextFunction) => {
        try {
  
          const { code } = req.query;
          const queryCode = code as string;
          const controller = new AuthController()
          const userInfoResponse = await controller.GoogleOAuth(queryCode);
  
          res.status(StatusCode.OK).json({
            success: true,
            user: userInfoResponse.newUser,
            token: userInfoResponse.jwtToken,
          });
        } catch (error: unknown) {
          _next(error);
        }
      }
  );


export default Route

