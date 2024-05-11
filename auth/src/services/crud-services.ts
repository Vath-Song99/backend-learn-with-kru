import { AuthRepository } from "../databases/repositories/auth.respository"


export class CrudServices {
    public authRepo: AuthRepository

    constructor(){
        this.authRepo = new AuthRepository()
    }
    async GetUser (authId: string){
        
        try{
           const user = await this.authRepo.FindUserById({id: authId});
           return user
        }catch(error: unknown){
            throw error
        }
    }
}