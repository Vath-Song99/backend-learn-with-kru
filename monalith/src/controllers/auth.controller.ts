import { AuthServices } from "../services/auth-services";
import { AuthControllerType } from "./@types/auth-controller-type";

export class AuthController{
    
    async Signup (requestBody: AuthControllerType){
        try{    
            const { username, email , password } = requestBody;
            const authService = new AuthServices();
            const users = await authService.Signup({username, email , password})
            
            return users
        }catch(error: unknown){
            throw error
        }
    }
}