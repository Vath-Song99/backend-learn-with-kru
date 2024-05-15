"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_custom_error_1 = __importDefault(require("./base-custom-error"));
class MockCustomError extends base_custom_error_1.default {
    constructor(message, statusCode) {
        super(message, statusCode);
        Object.setPrototypeOf(this, MockCustomError.prototype);
    }
    getStatusCode() {
        return this.statusCode;
    }
    serializeErrorOutput() {
        return {
            errors: [{ message: this.message }],
        };
    }
}
exports.default = MockCustomError;
//# sourceMappingURL=mock-error.js.map