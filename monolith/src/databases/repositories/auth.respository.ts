import { authModel } from "../models/auth.model";
import { AuthRepotype } from "../@types/repo-type";
import { ApiError } from "../../utils/base-custom-error";
export class AuthRepository {
    
    async CreateUser(users: AuthRepotype){
        try{
            const createdUser = await authModel.create(users)

            if(!createdUser){
                throw new ApiError("Unable to create user into Database!");
            }
            return createdUser.save()

        }catch(error: unknown){
          throw error
        }
    }
}