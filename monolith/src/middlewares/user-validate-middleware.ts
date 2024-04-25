import { NextFunction, Request, Response } from "express";
import { BaseCustomError } from "../utils/base-custom-error";
import StatusCode from "../utils/http-status-code";
import { Schema, ZodError } from "zod";

export const userValidate = (schema: Schema) => {
  return async (req: Request, res: Response, _next: NextFunction) => {
    try {
      schema.parse(req.body);
      _next();
    } catch (error: unknown) {
     

      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res
          .status(StatusCode.UNPROCESSABLE_ENTITY)
          .json({ error: "Invalid data", details: errorMessages });
      }
    }
  };
};
