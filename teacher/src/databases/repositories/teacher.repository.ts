import { Teacher } from "../../@types/teacher.type";
import { ApiError, BaseCustomError } from "../../utils/base-custom-error";
import StatusCode from "../../utils/http-status-code";
import { teacherModel } from "../models/teacher.model";
import { PaginateRepo } from "../@types/repo-type";

export class TeacherRepository {
  constructor() {}

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
      const newUser = await teacherModel.create({
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
      return newUser;
    } catch (error: unknown) {
      throw error;
    }
  }

  async FindAllTeachers({ pageSize, skip }: PaginateRepo) {
    try {
      const teachers = await teacherModel.find({}).skip(skip).limit(pageSize);
      if (!teachers || teachers.length === 0) {
        throw new ApiError("Unable to find techers in Database!");
      }
      return teachers;
    } catch (error: unknown) {
      if (error instanceof BaseCustomError) {
        throw error;
      }
      throw new BaseCustomError(
        "Something went wrong!",
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }

  async FindOneTeacher({ _id }: { _id: string }) {
    try {
      const teacher = await teacherModel.findById(_id)

      if(!teacher) {
        throw new BaseCustomError("No teacher match this id!", StatusCode.NOT_FOUND);
      }
      return teacher;
    } catch (error: unknown) {
     if(error instanceof BaseCustomError){
      throw error
     }
     throw new ApiError("Somthing went wrong!")
    }
  }
}
