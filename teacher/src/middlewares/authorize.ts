import { NextFunction, Request, Response } from "express";
import StatusCode from "../utils/http-status-code";
import { BaseCustomError } from "../error/base-custom-error";
import { decodedToken } from "../utils/jwt";

export const authorize = (requireRole: string) => {
  return async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1] as string;
      const decoded = await decodedToken(token);

      const { role } = decoded;

      if (role !== requireRole) {
        throw new BaseCustomError(
          "Forbidden - Insufficient permissions",
          StatusCode.FORBIDDEN
        );
      }
      _next();
    } catch (error: unknown) {
      if (error instanceof BaseCustomError) {
        res.status(error.statusCode).json(error);
      }
      res
        .status(StatusCode.UNAUTHORIZED)
        .json({
          message: "Unauthorized - Invalid token",
          stausCode: StatusCode.UNAUTHORIZED,
        });
    }
  };
};
