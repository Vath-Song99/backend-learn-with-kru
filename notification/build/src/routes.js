"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const consts_1 = require("./utils/consts");
const router = express_1.default.Router();
function healthRoutes() {
    router.get('/notification-health', (_req, res) => {
        res
            .status(consts_1.StatusCode.OK)
            .json({ message: 'Notification service is healthy and OK' });
    });
    return router;
}
exports.healthRoutes = healthRoutes;
//# sourceMappingURL=routes.js.map