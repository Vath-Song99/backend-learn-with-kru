import {   Get, Post, SuccessResponse } from "@tsoa/runtime";
import StatusCode from "../utils/http-status-code";
import { PATH_USER } from "../routes/path-defs";
import { UserServices } from "../services/user-services";
import { User } from "../@types/user.type";

export class UserController {
   @SuccessResponse(StatusCode.OK, "OK")
   @Post(PATH_USER.BASE)
   async Createuser ( requestBody: User){
    const { authId , firstname , lastname , email , picture } = requestBody
    try{
        const service = new UserServices();
        const newUser = await service.CreateUser({ authId , firstname , lastname , email , picture });
        
        return newUser
    }catch(error: unknown){
        throw error
    }
   }

   @SuccessResponse(StatusCode.OK, "OK")
   @Get(PATH_USER.GETUSER)
   async GetUser (authId: string){
    try{
        const service = new UserServices();
        const user = await service.GetUser(authId);

        return user
    }catch(error: unknown){
        throw error
    }
   }
}