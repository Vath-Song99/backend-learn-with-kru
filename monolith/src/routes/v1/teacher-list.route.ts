import { NextFunction, Router, Request, Response } from "express";
import { PATH_TEACHER } from "../path-defs";
import { TeacherController } from "../../controllers/teacher.controller";
import StatusCode from "../../utils/http-status-code";
import { Paginate } from "../../@types/paginate.type";

const TeacherRoute = Router();

TeacherRoute.get(
  PATH_TEACHER.teacherList,
  async (req: Request, res: Response, _next: NextFunction) => {
    const { pageSize, pageNumber } = req.query;

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
        success: true,
        teachers: teachers,
      });
    } catch (error: unknown) {
      _next(error);
    }
  }
);

export default TeacherRoute;
