import { SuccessResponse } from "tsoa";
import StatusCode from "../utils/http-status-code";
import { TeacherServices } from "../services/teacher-services";
import { Paginate } from "../@types/paginate.type";
import { Teacher } from "../@types/teacher.type";

export class TeacherController {
  constructor() {}
  @SuccessResponse(StatusCode.OK, "OK")
  public async TeacherList(options: Paginate) {
    try {
      const service = new TeacherServices();
      const newTeacher = await service.TeacherList(options);

      return newTeacher;
    } catch (error: unknown) {
      throw error;
    }
  }

  public async TeacherSingup(requestBody: Teacher) {
    const {
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
    } = requestBody;
    try {
      const service = new TeacherServices();
      const newUser = await service.CreateTeacher({
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

      return newUser
    } catch (error: unknown) {
      throw error;
    }
  }

  async FindOneTeacher ({_id}: {_id: string}){
    try{
      const service = new TeacherServices();
      const teacher = await service.FindOneTeacher({_id})
      return teacher
    }catch(error: unknown){
      throw error
    }
  }
}
