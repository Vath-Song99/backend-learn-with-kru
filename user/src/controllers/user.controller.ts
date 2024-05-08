import {  Post, SuccessResponse } from "@tsoa/runtime";
import StatusCode from "../utils/http-status-code";
import { PATH_USER } from "../routes/path-defs";
import { UserServices } from "../services/user-services";

export class UserController {
   @SuccessResponse(StatusCode.OK, "OK")
   @Post(PATH_USER.BASE)
   async Createuser (token: string){
    try{
        const service = new UserServices();
        const newUser = await service.CreateUser(token);
        
        return newUser
    }catch(error: unknown){
        throw error
    }
   }
}