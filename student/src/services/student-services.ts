import { Student } from "../@types/student.type";
import { StudentRepository } from "../databases/repositories/student.repository";



export class StudentServices {
    public StudentRepo: StudentRepository
    constructor(){
        this.StudentRepo = new StudentRepository()
    }

    async Signup ({schoolName , education , grade , studentCard}: Student){
        try{
             const newStudent = await this.StudentRepo.CreateStudent({schoolName, education , grade , studentCard});
             return await newStudent
        }catch(error){
            throw error
        }
    }
}