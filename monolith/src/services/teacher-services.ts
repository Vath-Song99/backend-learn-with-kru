import { Paginate } from "../@types/paginate.type";
import { TeacherRepository } from "../databases/repositories/teacher.repository";

export class TeacherServices {
  private teacherRepo: TeacherRepository
  constructor() {
    this.teacherRepo = new TeacherRepository()
  }

  async TeacherList(options : Paginate) {
    try{
      const teachers = await this.teacherRepo.FindAllTeachers(options) 
      return teachers
    }catch(error: unknown){
        throw error
    }
  }
}
