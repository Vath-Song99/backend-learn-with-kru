import {  Get, Post, SuccessResponse } from "@tsoa/runtime";
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

   @SuccessResponse(StatusCode.OK, "OK")
   @Get(PATH_USER.GETUSER)
   async GetUser (userId: string){
    try{
        const service = new UserServices();
        const user = await service.GetUser(userId);

        return user
    }catch(error: unknown){
        throw error
    }
   }
}