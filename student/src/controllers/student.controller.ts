import { Student } from "../@types/student.type";
import { StudentServices } from "../services/student-services";



export class StudentController {
    async Signup (requestBody: Student , userId: string){
        const student = {userId , ...requestBody}
        console.log(student)
        try{
            const service = new StudentServices();
            const newStudent = await service.Signup(student);
            
            return newStudent
        }catch(error: unknown){
            throw error
        }
    }
}