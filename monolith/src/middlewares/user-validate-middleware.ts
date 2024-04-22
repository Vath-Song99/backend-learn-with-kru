import { NextFunction, Request, Response } from "express";
import { BaseCustomError } from "../utils/base-custom-error";
import StatusCode from "../utils/http-status-code";
import { Schema, ZodError } from "zod";

export const userValidate = (schema: Schema) => {
  return async (req: Request, res: Response, _next: NextFunction) => {
    try {
      const { firstname,lastname, email, password } = req.body;

      schema.parse({ firstname,lastname, email, password });

      _next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        _next(
          new BaseCustomError(
            "username or password is invalid",
            StatusCode.BAD_REQUEST
          )
        );
      }
      _next(
        new BaseCustomError(
          "Somthing went wrong!",
          StatusCode.INTERNAL_SERVER_ERROR
        )
      );
    }
  };
};
