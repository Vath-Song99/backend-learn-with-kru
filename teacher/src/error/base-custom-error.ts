import StatusCode from "../utils/http-status-code";

export class BaseCustomError extends Error {
    statusCode: number;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
  
      // Ensure the error prototype is set correctly
      Object.setPrototypeOf(this, BaseCustomError.prototype);
    }
  
    // This method will be used to send the error response
    // Override it in subclasses if necessary
    serializeErrors() {
      return [{ message: this.message }];
    }
}

export class ApiError extends BaseCustomError{
      constructor(message: string, statusCode: number = StatusCode.INTERNAL_SERVER_ERROR){
        super(message, statusCode)
    }
}
