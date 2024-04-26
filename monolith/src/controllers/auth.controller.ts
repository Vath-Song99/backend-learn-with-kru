import { userValidate } from "../middlewares/user-validate-middleware";
import { PATH_AUTH } from "../routes/path-defs";
import { userValidateSchema } from "../schemas/user-validate";
import { AuthServices } from "../services/auth-services";
import StatusCode from "../utils/http-status-code";
import { generateSignature } from "../utils/jwt";
import { authLoginSchema } from "../schemas/auth-login";
import { User } from "../@types/user.type";
import {
  Get,
  Post,
  Route,
  SuccessResponse,
  Middlewares,
  Body,
  Query,
} from "tsoa";
import { UserLogin } from "./@types/auth-controller-type";

@Route("/api/v1")
export class AuthController {
  @Post(PATH_AUTH.signUp)
  @SuccessResponse(StatusCode.CREATED, "Created")
  @Middlewares(userValidate(userValidateSchema))
  public async Singup(@Body() requestBody: User): Promise<any> {
    try {
      const authService = new AuthServices();
      const users = await authService.Signup(requestBody);
      await authService.SendVerifyEmailToken(users._id);
      return users;
    } catch (error) {
      throw error;
    }
  }

  @Get(PATH_AUTH.verify)
  @SuccessResponse(StatusCode.OK, "OK")
  public async VerifyEmail(
    @Query() token: string
  ): Promise<{ message: string }> {
    try {
      const authService = new AuthServices();
      const user = await authService.VerifyEmailToken({ token });
      const jwtToken = await generateSignature({
        payload: user._id.toString(),
      });
      return { message: "success verify email" };
    } catch (error) {
      throw error;
    }
  }

  @Post(PATH_AUTH.login)
  @SuccessResponse(StatusCode.OK, "OK")
  @Middlewares(userValidate(authLoginSchema))
  public async LoginWithEmail(
    @Body() authdata: UserLogin
  ): Promise<{ message: string }> {
    try {
      const authService = new AuthServices();
      const { email, password } = authdata;
      const jwtToken = await authService.Login({ email, password });
      return { message: "success login" };
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
      return user;
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
      return newUser;
    } catch (error) {
      throw error;
    }
  }
}
