import { NextFunction, Router, Request, Response } from "express";
import { UserController } from "../../controllers/user.controller";
import StatusCode from "../../utils/http-status-code";
import { PATH_USER } from "../path-defs";

const Route = Router();

Route.post(
  PATH_USER.CREATE_USER,
  async (req: Request, res: Response, _next: NextFunction) => {
    const requestBody = req.body;
    try {
      const controller = new UserController();
      const newUser = await controller.Createuser(requestBody);

      res.status(StatusCode.OK).json({
        message: "Create user success",
        data: newUser,
      });
    } catch (error: unknown) {
      _next(error);
    }
  }
);

Route.get(
  PATH_USER.GET_USER_BY_AUTH_ID,
  async (req: Request, res: Response, _next: NextFunction) => {
    const { authId } = req.params;
    try {
      const controller = new UserController();
      const user = await controller.GetUserByAuthId(authId);

      res.status(StatusCode.OK).json({
        message: "Get user Success",
        data: user,
      });
    } catch (error: unknown) {
      _next(error);
    }
  }
);

Route.get(
  PATH_USER.GET_USER_BY_USER_ID,
  async (req: Request, res: Response, _next: NextFunction) => {
    const { userId } = req.params;
    console.log("UserId:", userId)
    try {
      const controller = new UserController();
      const user = await controller.GetUserByUserId(userId);

      res.status(StatusCode.OK).json({
        message: "Get user success",
        data: user,
      });
    } catch (error: unknown) {
      _next(error);
    }
  }
);

export default Route;
