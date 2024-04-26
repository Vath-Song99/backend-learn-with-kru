import { Paginate } from "../@types/paginate.type";
import { Teacher } from "../@types/teacher.type";
import { TeacherRepository } from "../databases/repositories/teacher.repository";

export class TeacherServices {
  private teacherRepo: TeacherRepository;
  constructor() {
    this.teacherRepo = new TeacherRepository();
  }

  async TeacherList(options: Paginate) {
    try {
      const teachers = await this.teacherRepo.FindAllTeachers(options);
      return teachers;
    } catch (error: unknown) {
      throw error;
    }
  }

  async CreateTeacher({
    first_name,
    last_name,
    phone_number,
    subject,
    is_degree,
    university,
    year_experience,
    type_degree,
    specialization,
    bio,
    teacher_experience,
    motivate,
    date_available,
    price,
    certificate,
    class_id,
    video,
  }: Teacher) {
    try {
      return await this.teacherRepo.CreateTeacher({
        first_name,
        last_name,
        phone_number,
        subject,
        is_degree,
        university,
        year_experience,
        type_degree,
        specialization,
        bio,
        teacher_experience,
        motivate,
        date_available,
        price,
        certificate,
        class_id,
        video,
      });
    } catch (error: unknown) {
      throw error;
    }
  }
}