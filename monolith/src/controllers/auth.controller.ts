import { userValidate } from "../middlewares/user-validate-middleware";

import { PATH_AUTH } from "../routes/path-defs";

import { userValidateSchema } from "../schemas/user-validate";
import { AuthServices } from "../services/auth-services";
import StatusCode from "../utils/http-status-code";
import {
  Get,
  Post,
  Route,
  SuccessResponse,
  Middlewares,
  Body,
  Query,
} from "tsoa";
import { generateSignature } from "../utils/jwt";

import { BaseCustomError } from "../utils/base-custom-error";
import { authLoginSchema } from "../schemas/auth-login";

interface AuthControllerType {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}
interface Authlogin {
  email: string;
  password: string;
}
/**
 * Redirects the user to a specified URL.
 * @param url The URL to redirect to.
 */
@Route("/api/v1")
export class AuthController {
  @Post(PATH_SIGNUP)
  @SuccessResponse(StatusCode.CREATED, "Created")
  @Middlewares(userValidate(userValidateSchema))
  public async createAuth(
    @Body() requestBody: AuthControllerType
  ): Promise<any> {
    try {
      const { firstname, lastname, email, password } = requestBody;


import { User } from "../@types/user.type";

@Route("/api/v1")
export class AuthController {
  @Post(PATH_AUTH.signUp)
  @SuccessResponse(StatusCode.CREATED, "Created")
  @Middlewares(userValidate(userValidateSchema))
  public async CreateAuth(@Body() requestBody: User): Promise<any> {
    try {
      const { firstname, lastname, email, password } = requestBody;


      const authService = new AuthServices();
      const users = await authService.Signup(requestBody);
      // Send Email Verification
      await authService.SendVerifyEmailToken(users._id);
      return users;
    } catch (error: unknown) {
      throw error;
    }
  }
  @SuccessResponse(StatusCode.OK, "OK")

  @Get(PATH_VERIFY)
  
  public async VerifyEmail(
    @Query() token: string,
  ): Promise<any> {
    try {
      const authService = new AuthServices();
      const authRequest = await authService.Expiredverify({ token });
      if(!authRequest){

      throw new BaseCustomError(
        "User does not exist!",
        StatusCode.NOT_ACCEPTABLE
      );
      }
      const isTokenExpired = authRequest.expired_at < new Date();

      if (isTokenExpired) {
   
       await authService.SendVerifyEmailToken(authRequest.userId);
       await authService.DeleteVerifyOld(authRequest._id )
      }else{
        const user = await authService.VerifyEmailToken({ token });
        // Generate JWT for the verified user
  
        const jwtToken = await generateSignature({
          userId: user._id,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  @Post(PATH_LOGIN)
  @SuccessResponse(StatusCode.CREATED, "CREATE")
  @Middlewares(userValidate(authLoginSchema))
  public async LoginWithEmail(
    @Body() authdata: Authlogin
  ): Promise<{ message: string }>{
   try{
    const authService = new AuthServices();
    const { email, password } = authdata;
    
    const jwtToken = await authService.Login({ email, password });
    return { message: "success login" };
   }
   catch(error: unknown){
    throw error;
   }
  }
}

  @Get(PATH_AUTH.verify)
  public async VerifyEmail(
    @Query() token: string
  ): Promise<{ message: string }> {
    try {
      const authService = new AuthServices();
      // Verify the email token
      const user = await authService.VerifyEmailToken({ token });

      // Generate JWT for the verified user

      const jwtToken = await generateSignature({
        payload: user._id.toString(),
      });
      return { message: "success verify email" };
    } catch (error) {
      throw error;
    }
  }

  @SuccessResponse(StatusCode.OK, "OK")
  @Post(PATH_AUTH.googleOAuthCallBack)
  async GoogleOAuth(code: string) {
    try {
      const authService = new AuthServices();
      const user = await authService.SigninWithGoogleCallBack(code);
      
      return user;
    } catch (error: unknown) {
      throw error;
    }
  }

  @SuccessResponse(StatusCode.OK, "OK")
  @Get(PATH_AUTH.facebookOAuthCallBack)
  async FacebookOAuth(code : string){
    try{
      const authService = new AuthServices();
      const newUser = await authService.SigninWithFacebookCallBack(code)

      return newUser
    }catch(error: unknown) {
      throw error
    }
  }
}

