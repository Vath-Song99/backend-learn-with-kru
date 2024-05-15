import { Paginate } from "../@types/paginate.type";
import { TeacherRepository } from "../databases/repositories/teacher.repository";
import { BaseCustomError } from "../error/base-custom-error";
import StatusCode from "../utils/http-status-code";
import { generateSignature } from "../utils/jwt";
import {  TeacherService } from "./@types/auth-service";

export class TeacherServices {
  private teacherRepo: TeacherRepository;
  constructor() {
    this.teacherRepo = new TeacherRepository();
  }

  async TeacherList(options: Paginate) {
    try {
      const { pageNumber, pageSize } = options as Paginate;
      const skip = (pageNumber - 1) * pageSize;
      const teachers = await this.teacherRepo.FindAllTeachers({
        pageSize,
        skip,
      });
      return teachers;
    } catch (error: unknown) {
      throw error;
    }
  }

  async CreateTeacher(teacherData: TeacherService){
    try {
      const { userId } = teacherData;
      const existTeacher = await this.teacherRepo.FindTeacherByUserID(userId);

      if (existTeacher) {
        throw new BaseCustomError(
          "you aready become a teacher !",
          StatusCode.BAD_REQUEST
        );
      }

      const newTeacher = await this.teacherRepo.CreateTeacher(teacherData);

      const token = await generateSignature({_id: newTeacher._id!.toString()})

      return {newTeacher, token};
    } catch (error: unknown) {
      throw error;
    }
  }

  async FindOneTeacher({ _id }: { _id: string }) {
    try {
      const teacher = await this.teacherRepo.FindTeacherById({ _id });

      return teacher;
    } catch (error: unknown) {
      throw error;
    }
  }
}
