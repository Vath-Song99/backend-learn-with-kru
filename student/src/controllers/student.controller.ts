import { Student } from "../@types/student.type";
import { StudentServices } from "../services/student-services";



export class StudentController {
    async Signup (requestBody: Student , token: string){
        const {schoolName , education , grade , studentCard} = requestBody
        try{
            const service = new StudentServices();
            const newStudent = await service.Signup({schoolName , education , grade , studentCard}, token);
            
            return newStudent
        }catch(error: unknown){
            throw error
        }
    }
}