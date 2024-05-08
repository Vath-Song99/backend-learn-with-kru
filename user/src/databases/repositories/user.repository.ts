
import { ApiError, BaseCustomError } from "../../error/base-custom-error"
import { UserRepo } from "../@types/repo-type"
import { UserModel } from "../models/user.model"

export class UserRepository {

  async CreateUser ({ firstname , lastname , email , authId , picture}: UserRepo){
      try{

        const newUser = await UserModel.create({
          authId,
          firstname,
          lastname,
          email,
        })
        
        if(!newUser){
          throw new ApiError("Unable to create User in db!")
        }
        return await newUser.save()
      }catch(error: unknown){
        throw error
      }
  }

  async FindOneUser (authId: string){
      try{  
        const User = await UserModel.find({
          authId: authId
        });
        return User
      }catch(error: unknown){
        throw error
      }
  }

  async UpdateUser (userId: string , {firstname, lastname , picture}:{firstname: string, lastname: string; picture: string}){
    try{
      const newUser = await UserModel.findByIdAndUpdate({
        _id: userId
      },{firstname, lastname , picture},{new: true});
      if(!newUser){
        throw new ApiError("Unable to update user in database!")
      }
      return newUser
    }catch(error: unknown){
      throw error
    }
  }

  async DeleteUser (userId: string){
    try{
      const deletedUser = await UserModel.findByIdAndDelete({_id: userId});
      if(!deletedUser?.$isDeleted){
        throw new ApiError("Unable to delete user in database!")
      }
    }catch(error: unknown){
      throw error
    }
  }
}