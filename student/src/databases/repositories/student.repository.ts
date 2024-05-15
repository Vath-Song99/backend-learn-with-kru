import { ApiError } from "../../error/base-custom-error";
import { StudentRepo } from "../@types/repo-type";
import { StudentModel } from "../models/student.model";

export class StudentRepository {
  async CreateStudent({
    schoolName,
    education,
    grade,
    studentCard,
    firstname,
    lastname,
    email,
    userId,
  }: StudentRepo) {
    try {
      const newStudent = await StudentModel.create({
        userId,
        firstname,
        lastname,
        email,
        school_name: schoolName,
        education: education,
        grade: grade,
        student_card: studentCard,
      });

      if (!newStudent) {
        throw new ApiError("Unable to create student in db!");
      }
      return await newStudent.save();
    } catch (error: unknown) {
      throw error;
    }
  }

  async FindOneStudent(authId: string) {
    try {
      const student = await StudentModel.find({
        authId: authId,
      });
      return student;
    } catch (error: unknown) {
      throw error;
    }
  }
}
