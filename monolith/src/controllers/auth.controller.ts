import { userValidate } from "../middlewares/user-validate-middleware";
import { PATH_SIGNUP, PATH_VERIFY } from "../routes/path-defs";
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
      Query
    } from "tsoa";
import { generateSignature } from "../utils/jwt";

    interface AuthControllerType{
        firstname: string;
        lastname: string;
        email: string;
        password: string;
    }

 @Route("/api/v1")
export class AuthController{
   
     @Post(PATH_SIGNUP)
     @SuccessResponse(StatusCode.CREATED, "Created")
     @Middlewares(userValidate(userValidateSchema))
    public  async createAuth ( @Body() requestBody: AuthControllerType): Promise<any>{
        try{    
            const { firstname,lastname, email , password } = requestBody;
        
            const authService = new AuthServices();
            const users = await authService.Signup(requestBody)
              // Send Email Verification
               await authService.SendVerifyEmailToken(users._id);
               return users
          
        }catch(error: unknown){
            throw error
        }
    }
    @SuccessResponse(StatusCode.OK, "OK")
    @Get(PATH_VERIFY)
    public async VerifyEmail(
      @Query() token: string
    ): Promise<{ message: string }> {
      try {
        const authService = new AuthServices();
        // Verify the email token
        const user = await authService.VerifyEmailToken({ token });
         
        // Generate JWT for the verified user
      
        const jwtToken = await generateSignature({
          userId: user._id
        });
        return { message: "success verify email" };
      } catch (error) {
        throw error;
      }
    }
}