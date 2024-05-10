import {  UserRepository } from "../databases/repositories/user.repository";
import { BaseCustomError } from "../error/base-custom-error";
import StatusCode from "../utils/http-status-code";
import { getUserInfo } from "../utils/htttp-request";
import { decodedToken } from "../utils/jwt";


export class  UserServices {
  public  UserRepo:  UserRepository;
  constructor() {
    this.UserRepo = new  UserRepository();
  }
  async CreateUser (token: string){
    // TODO 
    // 1. encrypt token
    // 2. make requst to get auth user in auth service database
    // 3. create new user in database
    try{
      // step 1
      const authId = await decodedToken(token);
      
      // step 2
      const {data} = await getUserInfo(authId);
      const {_id , firstname,lastname,email,profile_picture} = data

      const existingUser = await this.UserRepo.FindAuthUser(_id);

      if(existingUser !== null){
        throw new BaseCustomError("User is exist in database!",StatusCode.BAD_REQUEST);
      }
      // step 3
      const newUser = await this.UserRepo.CreateUser({authId: _id ,firstname,lastname,email,picture: profile_picture});
      
      return newUser
    }catch(error: unknown){
      throw error
    }
  };

  async GetUser(userId: string){
    try{
      const user = await this.UserRepo.FindUser(userId);
      return user
    }catch(error: unknown){
      throw error
    }
  }
}
