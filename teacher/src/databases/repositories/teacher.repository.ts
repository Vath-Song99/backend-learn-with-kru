import StatusCode from "../../utils/http-status-code";
import { teacherModel } from "../models/teacher.model";
import { PaginateRepo, TeacherRepo } from "../@types/repo-type";
import { ApiError, BaseCustomError } from "../../error/base-custom-error";
import { logger } from "../../utils/logger";
import { Teacher } from "../../@types/teacher.type";
export class TeacherRepository {
  constructor() {}

  async CreateTeacher(teacherData: TeacherRepo) {
    try {
      // Log the attempt to create a new teacher
      logger.info(
        `Attempting to create a new teacher with data: ${JSON.stringify(
          teacherData
        )}`
      );
      // Create the new teacher
      const newTeacher = new teacherModel(teacherData)

      if (!newTeacher) {
        // Log the failure to create the teacher
        logger.error(
          "Failed to create a new teacher: Teacher creation returned null"
        );
        throw new ApiError("Unable to create user in database!");
      }
      // Save the new teacher
      const savedTeacher = await newTeacher.save();

      // Log the success
      logger.info(
        `Successfully created and saved a new teacher with ID: ${savedTeacher.id}`
      );

      return savedTeacher;
    } catch (error: unknown) {
      // Log the error
      logger.error("Error occurred while creating a new teacher", error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError("Somthing went wrong!");
    }
  }

  async FindAllTeachers({ pageSize, skip }: PaginateRepo): Promise<Teacher[]> {
    try {
      // Validate inputs
      if (pageSize <= 0 || skip < 0) {
        throw new ApiError("Invalid pagination parameters!", StatusCode.BAD_REQUEST);
      }
  
      // Fetch teachers from the database
      const teachers = await teacherModel.find({}).skip(skip).limit(pageSize).exec();
      
      // Check if teachers are found
      if (!teachers || teachers.length === 0) {
        throw new ApiError("Unable to find teachers in the database!", StatusCode.NOT_FOUND);
      }
  
      return teachers;
    } catch (error: unknown) {
      // Log the error
      logger.error('Error finding teachers:', error);

      // Re-throw custom errors
      if (error instanceof BaseCustomError) {
        throw error;
      }
  
      // Throw a generic error for other cases
      throw new ApiError("Something went wrong!");
    }
  }
  // By teacher id
  async  FindTeacherById({ _id }: {_id: string}): Promise<Teacher> {
    try {
      // Validate input
      if (!_id) {
        throw new ApiError("Invalid ID parameter!", StatusCode.BAD_REQUEST);
      }
  
      // Fetch teacher by ID from the database
      const teacher = await teacherModel.findById(_id).exec();
  
      // Check if a teacher was found
      if (!teacher) {
        throw new BaseCustomError("No teacher matches this ID!", StatusCode.NOT_FOUND);
      }
  
      return teacher;
    } catch (error: unknown) {
      // Log the error
      logger.error('Error finding teacher by ID:', error);
  
      // Re-throw custom errors
      if (error instanceof BaseCustomError) {
        throw error;
      }
  
      // Throw a generic error for other cases
      throw new ApiError("Something went wrong!");
    }
  }

  async FindTeacherByUserID(userId: string): Promise<Teacher | null> {
    try {
      // Validate input
      if (!userId) {
        throw new ApiError("Invalid user ID parameter!", StatusCode.BAD_REQUEST);
      }
  
      // Fetch teacher by user ID from the database
      const existTeacher = await teacherModel.findOne({ userId }).exec();
  
      // Log the operation
      logger.info(`Teacher with user ID ${userId} ${existTeacher ? 'found' : 'not found'}`);
  
      return existTeacher;
    } catch (error: unknown) {
      // Log the error
      logger.error('Error finding teacher by user ID:', error);
  
      // Re-throw custom errors
      if (error instanceof BaseCustomError) {
        throw error;
      }
  
      // Throw a generic error for other cases
      throw new ApiError("Something went wrong!");
    }
  }
}
