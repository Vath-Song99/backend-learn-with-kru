import { NextFunction, Request, Response } from "express";
import { decodedToken } from "../utils/jwt";
import { ApiError, BaseCustomError } from "../error/base-custom-error";
import StatusCode from "../utils/http-status-code";
import { DecodedUser } from "../@types/express-extend.type";
import { logger } from "../utils/logger";

interface RequestWithUser extends Request {
  user: DecodedUser;
}

export const authorize = (requireRole: string[]) => {
  return async (req: Request, _res: Response, _next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1] as string;
      const decoded = await decodedToken(token);

      const { role } = decoded;
      if (requireRole.includes(role)) {
        throw new BaseCustomError(
          "Forbidden - Insufficient permissions",
          StatusCode.FORBIDDEN
        );
      }
      (req as RequestWithUser).user = decoded;
      
      logger.info(`User with role '${role}' authorized for '${requireRole}' role`);
      _next();
    } catch (error: unknown) {
      logger.error('Authorization error:', error);
      if (error instanceof BaseCustomError) {
        _next(error);
      }
      _next(
        new ApiError("Unauthorized - Invalid token", StatusCode.UNAUTHORIZED)
      );
    }
  };
};
