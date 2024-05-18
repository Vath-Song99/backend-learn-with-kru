import { StudentRepository } from "../databases/repositories/student.repository";
import { BaseCustomError } from "../error/base-custom-error";
import StatusCode from "../utils/http-status-code";
import { getUserById } from "../utils/htttp-request";
import { generateSignature } from "../utils/jwt";
import { StudentService } from "./@types/student-service";

export class StudentServices {
  public StudentRepo: StudentRepository;
  constructor() {
    this.StudentRepo = new StudentRepository();
  }

  async Signup({
    userId,
    schoolName,
    education,
    grade,
    studentCard,
  }: StudentService) {
    try {
      const data = await getUserById(userId) ;

      const { firstname, lastname, email } = data;
    

      const existingStudent = await this.StudentRepo.FindOneStudent(userId);

      if (existingStudent) {
        throw new BaseCustomError(
          "you're already be student",
          StatusCode.BAD_REQUEST
        );
      }
      const newStudent = await this.StudentRepo.CreateStudent({
        userId,
        firstname,
        lastname,
        email: email as string,
        schoolName,
        education,
        grade,
        studentCard,
      });

      const token = await generateSignature({ _id: newStudent._id.toString() });
      return { newStudent, token };
    } catch (error) {
      throw error;
    }
  }
}
