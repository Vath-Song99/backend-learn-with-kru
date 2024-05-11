import { Student } from "../@types/student.type";
import { StudentRepository } from "../databases/repositories/student.repository";
import { BaseCustomError } from "../error/base-custom-error";
import StatusCode from "../utils/http-status-code";
import { getUserInfo } from "../utils/htttp-request";
import { decodedToken } from "../utils/jwt";

export class StudentServices {
  public StudentRepo: StudentRepository;
  constructor() {
    this.StudentRepo = new StudentRepository();
  }

  async Signup(
    { schoolName, education, grade, studentCard }: Student,
    token: string
  ) {
    try {
      const authId = await decodedToken(token as string);
      const { data } = await getUserInfo(authId);

      const { _id, firstname, lastname, email } = data;

      const existingStudent = await this.StudentRepo.FindOneStudent(_id);

      if(existingStudent.length > 0){
        throw new BaseCustomError("Student is existing!", StatusCode.BAD_REQUEST)
      }
      const newStudent = await this.StudentRepo.CreateStudent({
        authId: _id,
        firstname,
        lastname,
        email: email,
        schoolName,
        education,
        grade,
        studentCard,
      });
      return  newStudent;
    } catch (error) {
      throw error;
    }
  }
}
