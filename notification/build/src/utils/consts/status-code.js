"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCode = void 0;
var StatusCode;
(function (StatusCode) {
    // Success
    StatusCode[StatusCode["OK"] = 200] = "OK";
    StatusCode[StatusCode["Created"] = 201] = "Created";
    StatusCode[StatusCode["Accepted"] = 202] = "Accepted";
    StatusCode[StatusCode["NoContent"] = 204] = "NoContent";
    // Redirection
    StatusCode[StatusCode["MovedPermanently"] = 301] = "MovedPermanently";
    StatusCode[StatusCode["Found"] = 302] = "Found";
    // Client Errors
    StatusCode[StatusCode["BadRequest"] = 400] = "BadRequest";
    StatusCode[StatusCode["Unauthorized"] = 401] = "Unauthorized";
    StatusCode[StatusCode["Forbidden"] = 403] = "Forbidden";
    StatusCode[StatusCode["NotFound"] = 404] = "NotFound";
    StatusCode[StatusCode["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    StatusCode[StatusCode["NotAcceptable"] = 406] = "NotAcceptable";
    StatusCode[StatusCode["Conflict"] = 409] = "Conflict";
    StatusCode[StatusCode["UnprocessableEntity"] = 422] = "UnprocessableEntity";
    // Server Errors
    StatusCode[StatusCode["InternalServerError"] = 500] = "InternalServerError";
    StatusCode[StatusCode["NotImplemented"] = 501] = "NotImplemented";
    StatusCode[StatusCode["BadGateway"] = 502] = "BadGateway";
    StatusCode[StatusCode["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    StatusCode[StatusCode["GatewayTimeout"] = 504] = "GatewayTimeout";
})(StatusCode || (exports.StatusCode = StatusCode = {}));
//# sourceMappingURL=status-code.js.map