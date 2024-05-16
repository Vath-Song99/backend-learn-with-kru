import { NextFunction, Router, Request, Response } from "express";
import { PATH_TEACHER } from "../path-defs";
import { TeacherController } from "../../controllers/teacher.controller";
import StatusCode from "../../utils/http-status-code";
import { Paginate } from "../../@types/paginate.type";
import { teacherSchemas } from "../../schemas/teacher-validate";
import { TeacherValidate } from "../../middlewares/teacher-validate-input";
import { authorize } from "../../middlewares/authorize";
import { DecodedUser } from "../../@types/express-extend.type";

const TeacherRoute = Router();

TeacherRoute.get(
  PATH_TEACHER.teacherList,
  async (req: Request, res: Response, _next: NextFunction) => {
    const { pageSize = 10, pageNumber= 1 } = req.query;

    // Convert pageSize and pageNumber to numbers
    const parsedPageSize = parseInt(pageSize as string, 10);
    const parsedPageNumber = parseInt(pageNumber as string, 10);

    const options: Paginate = {
      pageSize: parsedPageSize,
      pageNumber: parsedPageNumber,
    };
    try {
      const controller = new TeacherController();
      const teachers = await controller.TeacherList(options);

      res.status(StatusCode.OK).json({
        message: 'success',
        data: teachers,
      });
    } catch (error: unknown) {
      _next(error);
    }
  }
);

TeacherRoute.post(
  PATH_TEACHER.teacherSignup,
  authorize(["user","student"]),
  TeacherValidate(teacherSchemas),
  async (req: Request, res: Response, _next: NextFunction) => {
    const requestBody = req.body;
    const user = (req.user as DecodedUser);
    try {
      const controller = new TeacherController();
      const newTeacher = await controller.TeacherSingup(requestBody , user.id);

      res.status(StatusCode.CREATED).json({
        message: 'success',
        data: newTeacher,
        token: newTeacher.token
      });
    } catch (error: unknown) {
      _next(error);
    }
  }
);

TeacherRoute.get(
  PATH_TEACHER.teacherProfile ,
  async (req: Request, res: Response, _next: NextFunction) => {
    const _id = req.query.id as string;
    try {
      const controller = new TeacherController();
      const teacher = await controller.FindOneTeacher({ _id });

      res.status(StatusCode.OK).json({
        message: 'success',
        data: teacher,
      });
    } catch (error: unknown) {
      _next(error);
    }
  }
);

export default TeacherRoute;
