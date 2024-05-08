import {  UserRepository } from "../databases/repositories/user.repository";
import { getUserInfo } from "../utils/htttp-request";
import { decodedToken } from "../utils/jwt";


export class  UserServices {
  public  UserRepo:  UserRepository;
  constructor() {
    this.UserRepo = new  UserRepository();
  }
  async CreateUser (token: string){
    try{
      const authId = await decodedToken(token);
      
      const {data} = await getUserInfo(authId);

      const {_id , firstname,lastname,email,picture} = data
      const newUser = await this.UserRepo.CreateUser({authId: _id ,firstname,lastname,email,picture,});
      
      return newUser
    }catch(error: unknown){
      throw error
    }
  }
}
