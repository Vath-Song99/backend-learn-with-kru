import { Request, Response, NextFunction } from "express";
import StatusCode from "../utils/http-status-code";
import { ApiError, BaseCustomError } from "../error/base-custom-error";
import jwt from "jsonwebtoken";
import { DecodedUser } from "../@types/express-extend.type";

  

export const requireAuth = async (
  req: Request,
  _res: Response,
  _next: NextFunction
) => {

  try {
    const token = req.cookies.authenticated;
    if (!token) {
      throw new BaseCustomError("Unauthorized", StatusCode.UNAUTHORIZED);
    }
    const secretKey = process.env.SECRET_KEY as string;
    const decoded = jwt.verify(token, secretKey);

    if(!decoded){
        throw new BaseCustomError("Invalid token!", StatusCode.BAD_REQUEST)
    }
    req.user  = decoded as DecodedUser;
    _next()
  } catch (error) {
    if (error instanceof BaseCustomError) {
      _next(error);
    }
    _next(new ApiError("Somthing went wrong!"));
  }
};
