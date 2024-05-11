import { CrudServices } from "../services/crud-services"


export class CrudController {

    async GetUser (authId: string){
        try{
            const service = new CrudServices();
            const user = await service.GetUser(authId);
            
            return user
        }catch(error: unknown){
            throw error
        }
    }
}