
import { Student } from "../../@types/student.type"
import { ApiError } from "../../error/base-custom-error"
import { StudentModel } from "../models/student.model"

export class StudentRepository {

  async CreateStudent ({schoolName , education , grade , studentCard}: Student){
      try{

        const newStudent = await StudentModel.create({
          school_name: schoolName,
          education: education,
          grade: grade,
          student_card: studentCard
        })
        
        if(!newStudent){
          throw new ApiError("Unable to create student in db!")
        }
        return await newStudent.save()
      }catch(error: unknown){
        throw error
      }
  }
}