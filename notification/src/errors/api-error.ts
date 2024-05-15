import StatusCode from "@notifications/utils/http-status-code";
import { SerializedErrorOutput } from "./@types/serialized-error-output";
import BaseCustomError from "./base-custom-error";

// USE CASE:
// 1. Unexpected Server Error
// 2. Fallback Error Handler
// 3. Generic Server Error

export default class ApiError extends BaseCustomError {
  constructor(
    message: string,
    statusCode: number = StatusCode.InternalServerError
  ) {
    super(message, statusCode);

    Object.setPrototypeOf(this, ApiError.prototype);
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  serializeErrorOutput(): SerializedErrorOutput {
    return { errors: [{ message: this.message }] };
  }
}
