import { User } from "../@types/user.type";
import {  UserRepository } from "../databases/repositories/user.repository";
import { ApiError, BaseCustomError } from "../error/base-custom-error";
import StatusCode from "../utils/http-status-code";

export class  UserServices {
  public  UserRepo:  UserRepository;
  constructor() {
    this.UserRepo = new  UserRepository();
  }
  async CreateUser ({ authId , firstname , lastname , email , picture }: User){
    // TODO 
    // 1. encrypt token
    // 2. make requst to get auth user in auth service database
    // 3. create new user in database
    try{

      const existingUser = await this.UserRepo.FindAuthUser(authId);

      if(existingUser !== null){
        throw new BaseCustomError("User is exist in database!",StatusCode.BAD_REQUEST);
      }
      // step 3
      const newUser = await this.UserRepo.CreateUser({authId ,firstname,lastname,email, picture});
      
      return newUser
    }catch(error: unknown){
      throw error
    }
  };

  async GetUser(authId: string){
    try{
      const user = await this.UserRepo.FindUser(authId); 

      if(user === null){
        throw new ApiError("Unable to find user in database!")
      }
      return user
    }catch(error: unknown){
      throw error
    }
  }
}
