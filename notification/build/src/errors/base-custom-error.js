"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseCustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        // Allow to chain prototype correctly from Error Class
        Object.setPrototypeOf(this, BaseCustomError.prototype);
    }
}
exports.default = BaseCustomError;
//# sourceMappingURL=base-custom-error.js.map