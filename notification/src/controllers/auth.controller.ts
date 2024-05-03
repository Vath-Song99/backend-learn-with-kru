import { PATH_AUTH } from "../routes/path-defs";
import { AuthServices } from "../services/auth-services";
import StatusCode from "../utils/http-status-code";
import {
  Get,
  Route,
  SuccessResponse,
  Query,
} from "tsoa";

@Route("/api/v1")
export class AuthController {

  @Get(PATH_AUTH.verify)
  @SuccessResponse(StatusCode.OK, "OK")
  public async VerifyEmail(
    @Query() token: string
  ){
    try {
      const authService = new AuthServices();
      const user = await authService.VerifyEmailToken(token);
      
      return user
    } catch (error) {
      throw error;
    }
  }


}
