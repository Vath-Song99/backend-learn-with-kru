import { Paginate } from "../../@types/paginate.type";
import { ApiError, BaseCustomError } from "../../utils/base-custom-error";
import StatusCode from "../../utils/http-status-code";
import { teacherModel } from "../models/teacher.model";

export class TeacherRepository {
  constructor() {}

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
