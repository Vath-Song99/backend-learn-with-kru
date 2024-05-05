import { NextFunction, Request, Response } from "express";
import { ApiError, BaseCustomError } from "../error/base-custom-error";
import StatusCode from "../utils/http-status-code";
import { Schema, ZodError } from "zod";

export const studentValidate = (schema: Schema) => {
  return async (req: Request, _res: Response, _next: NextFunction) => {
    try {
      schema.parse(req.body);
      _next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => {
          return `${issue.path.join(".")} is ${issue.message}`
        });
        _next(new BaseCustomError(errorMessages as unknown as string , StatusCode.UNPROCESSABLE_ENTITY))
      }
      console.log("Somthign went wrong!");
      _next(new ApiError("Somthing went wrong!"))
    }
  };
};
