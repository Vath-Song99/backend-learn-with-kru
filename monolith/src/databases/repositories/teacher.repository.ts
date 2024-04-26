import { Paginate } from "../../@types/paginate.type";
import { Teacher } from "../../@types/teacher.type";
import { ApiError, BaseCustomError } from "../../utils/base-custom-error";
import StatusCode from "../../utils/http-status-code";
import { teacherModel } from "../models/teacher.model";

export class TeacherRepository {
  constructor() {}

  async CreateTeacher ({
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
  }:Teacher){
    try{
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
      return  newUser
    }catch(error: unknown){
      throw error
    }
  }

  async FindAllTeachers(options: Paginate) {
    const { pageNumber, pageSize } = options as Paginate;
    const skip = (pageNumber - 1) * pageSize;

    try {
      const teachers = await teacherModel.find({}).skip(skip).limit(pageSize);
      if (!teachers || teachers.length === 0) {
        throw new ApiError("Unable to find techers in Database!");
      }
      return teachers;
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new BaseCustomError(
        "Something went wrong!",
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
  }
}
