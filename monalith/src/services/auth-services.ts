import { AuthRepository } from "../databases/repositories/auth.respository";
import { AuthServiceType } from "./@types/auth-service";

export class AuthServices{
    private AuthRepo: AuthRepository
    constructor(){
        this.AuthRepo = new AuthRepository()
    }

    async Signup(users:AuthServiceType ){
        try{

            return await this.AuthRepo.CreateUser(users)
        }catch(error: unknown){
            throw error
        }
    }
}