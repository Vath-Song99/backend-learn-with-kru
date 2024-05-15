"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("../utils/consts");
const base_custom_error_1 = __importDefault(require("./base-custom-error"));
// USE CASE:
// 1. Unexpected Server Error
// 2. Fallback Error Handler
// 3. Generic Server Error
class APIError extends base_custom_error_1.default {
    constructor(message, statusCode = consts_1.StatusCode.InternalServerError) {
        super(message, statusCode);
        Object.setPrototypeOf(this, APIError.prototype);
    }
    getStatusCode() {
        return this.statusCode;
    }
    serializeErrorOutput() {
        return { errors: [{ message: this.message }] };
    }
}
exports.default = APIError;
//# sourceMappingURL=api-error.js.map