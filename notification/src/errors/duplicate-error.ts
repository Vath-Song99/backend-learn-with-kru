import StatusCode from "@notifications/utils/http-status-code";
import { SerializedErrorOutput } from "./@types/serialized-error-output";
import BaseCustomError from "./base-custom-error";

export default class DuplicateError extends BaseCustomError {
  constructor(message: string) {
    super(message, StatusCode.Conflict);

    Object.setPrototypeOf(this, DuplicateError.prototype);
  }

  getStatusCode(): number {
    return this.statusCode;
  }

  serializeErrorOutput(): SerializedErrorOutput {
    return { errors: [{ message: this.message }] };
  }
}
