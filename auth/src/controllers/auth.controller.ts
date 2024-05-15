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

@Route("/api/v1")
export class AuthController {


  @Post(PATH_AUTH.signUp)
  @SuccessResponse(StatusCode.CREATED, "Created")
  @Middlewares(zodValidate(userValidateSchema))
  public async Singup(@Body() requestBody: User): Promise<void>{
    const {firstname , lastname , email , password } = requestBody;
    try {
      const authService = new AuthServices();
      await authService.Signup({firstname , lastname , email , password});

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

      return user
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
      const user = await authService.SigninWithGoogleCallBack(code);

      return user
    } catch (error) {
      throw error;
    }
  }

  @SuccessResponse(StatusCode.OK, "OK")
  @Post(PATH_AUTH.facebookOAuthCallBack)
  async FacebookOAuth(@Body() code: string): Promise<any> {
    try {
      const authService = new AuthServices();
      const user = await authService.SigninWithFacebookCallBack(code);
      
      return user
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
