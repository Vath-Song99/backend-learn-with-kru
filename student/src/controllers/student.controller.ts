import { Student } from "../@types/student.type";
import { StudentServices } from "../services/student-services";



export class StudentController {
    async Signup (requestBody: Student , userId: string){
        const {schoolName , education , grade , studentCard} = requestBody
        try{
            const service = new StudentServices();
            const newStudent = await service.Signup({schoolName , education , grade , studentCard}, userId);
            
            return newStudent
        }catch(error: unknown){
            throw error
        }
    }
}