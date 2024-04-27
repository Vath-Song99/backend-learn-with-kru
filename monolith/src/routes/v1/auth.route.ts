import { NextFunction,Request, Response, Router } from "express";
import { PATH_AUTH, PATH_TEACHER } from "../path-defs";
import { AuthController } from "../../controllers/auth.controller";
import StatusCode from "../../utils/http-status-code";
import {  zodValidate } from "../../middlewares/user-validate-middleware";
import { userValidateSchema } from "../../schemas/auth-validate";
import {  OauthConfig } from "../../utils/oauth-configs";

// Route
const AuthRoute = Router()

AuthRoute.post(PATH_AUTH.signUp, zodValidate(userValidateSchema) , async (req: Request, res: Response, _next: NextFunction) =>{
  const requestBody = req.body;
    try{
        const controller = new AuthController();
        const respone = await controller.Singup(requestBody);

        res.status(StatusCode.OK).json({
            messaage: 'success',
            users: respone.newUser,
            token: respone.jwtToken
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

AuthRoute.get(
    PATH_AUTH.googleOAuth,
    async (req: Request, res: Response, _next: NextFunction) => {
      const redirectUri = process.env.GOOGLE_REDIRECT_URI as string;
      const clienId = process.env.GOOGLE_CLIENT_ID as string;
      try {
       
        const googleConfig = await OauthConfig.getInstance()
        const authUrl = await googleConfig.GoogleConfigUrl(clienId, redirectUri);
        res.redirect(authUrl);
      } catch (error: unknown) {
        _next(error);
      }
    }
  );
  
  //Signin callback with google
  AuthRoute.get(
    PATH_AUTH.googleOAuthCallBack,
    async (req: Request, res: Response, _next: NextFunction) => {
      const { code } = req.query;
        try {
  
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

  AuthRoute.get(PATH_AUTH.facebookOAuth, async(req: Request , res: Response , _next: NextFunction) =>{
    try {
      const redirectUri = process.env.FACEBOOK_REDIRECT_URI as string;
      const clienId = process.env.FACEBOOK_APP_ID as string;
      
      const facebookConfig = await OauthConfig.getInstance()
      const authUrl = await facebookConfig.FacebookConfigUrl(clienId, redirectUri);
      res.redirect(authUrl);
    } catch (error: unknown) {
      _next(error);
    }
  })

  AuthRoute.get(PATH_AUTH.facebookOAuthCallBack, async(req: Request , res: Response ,_next: NextFunction) =>{
    try{
      const { code } = req.query;
      const queryCode = code as string;
      const controller = new AuthController()
      const userInfoResponse = await controller.FacebookOAuth(queryCode);

      res.status(StatusCode.OK).json({
        success: true,
        user: userInfoResponse.profile,
        token: userInfoResponse.jwtToken,
      });
    }catch(error: unknown){
      _next(error)
    }
  });



export default AuthRoute

