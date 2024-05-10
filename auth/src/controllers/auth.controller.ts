import { zodValidate } from "../middlewares/user-validate-middleware";
import { PATH_AUTH } from "../routes/path-defs";
import { authLoginSchema, userValidateSchema } from "../schemas/auth-validate";
import { AuthServices } from "../services/auth-services";
import StatusCode from "../utils/http-status-code";
import { Login, User } from "../@types/user.type";
import {
  Get,
  Post,
  Route,
  SuccessResponse,
  Middlewares,
  Body,
  Query,
} from "tsoa";
import { createUser } from "../utils/http-request";
import { ApiError } from "../error/base-custom-error";
import { generateSignature } from "../utils/jwt";

@Route("/api/v1")
export class AuthController {
  @Post(PATH_AUTH.signUp)
  @SuccessResponse(StatusCode.CREATED, "Created")
  @Middlewares(zodValidate(userValidateSchema))
  public async Singup(@Body() requestBody: User): Promise<any> {
    const {firstname , lastname , email , password } = requestBody;
    try {
      const authService = new AuthServices();
      const users = await authService.Signup({firstname , lastname , email , password});
      return users;
    } catch (error) {
      throw error;
    }
  }

  @Get(PATH_AUTH.verify)
  @SuccessResponse(StatusCode.OK, "OK")
  public async VerifyEmail(
    @Query() token: string
  ){
    try {
      const authService = new AuthServices();
      const user = await authService.VerifyEmailToken(token);

      const {data} = await createUser(user.jwtToken);
      if(!data){
          throw new ApiError("Can't create new user in to user service!")
        }
      const userJwtToken = await generateSignature({payload: data._id});
      return {user: data, token: userJwtToken}
    } catch (error: unknown) {
      throw error;
    }
  }

  @Post(PATH_AUTH.login)
  @SuccessResponse(StatusCode.OK, "OK")
  @Middlewares(zodValidate(authLoginSchema))
  public async Login(
    @Body() requestBody: Login
  ) {
    const { email, password } = requestBody;
    try {
      const authService = new AuthServices();
      const user = await authService.Login({email , password})

      return user
    } catch (error) {
      throw error;
    }
  }

  @SuccessResponse(StatusCode.OK, "OK")
  @Post(PATH_AUTH.googleOAuthCallBack)
  async GoogleOAuth(@Body() code: string): Promise<any> {
    try {
      const authService = new AuthServices();
      const {jwtToken} = await authService.SigninWithGoogleCallBack(code);

     const {data} = await createUser(jwtToken);
     if(!data){
      throw new ApiError("Can't create new user in user service!")
     }
      const userJwtToken = await generateSignature({payload: data._id});

      return {user: data , token: userJwtToken}
    } catch (error) {
      throw error;
    }
  }

  @SuccessResponse(StatusCode.OK, "OK")
  @Post(PATH_AUTH.facebookOAuthCallBack)
  async FacebookOAuth(@Body() code: string): Promise<any> {
    try {
      const authService = new AuthServices();
      const newUser = await authService.SigninWithFacebookCallBack(code);
      
      const { data } = await createUser(newUser.jwtToken);
      if(!data){
       throw new ApiError("Can't create new user in user service!")
      }
       const userJwtToken = await generateSignature({payload: data._id});
 
       return {user: data , token: userJwtToken}

    } catch (error) {
      throw error;
    }
  }

  @SuccessResponse(StatusCode.OK, "OK")
  @Post(PATH_AUTH.resetPassword)
  async ResetPassword(requestBody:{email: string} ){
    const {email} = requestBody
    try{
      const service = new AuthServices();
      const user = await service.ResetPassword({email});
      return user
    }catch(error: unknown){
      throw error
    }
  }

}
