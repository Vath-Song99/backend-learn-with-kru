"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logDestroy = exports.logInit = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const { combine, timestamp, printf, colorize, align } = winston_1.default.format;
// Create a Winston Logger
exports.logger = winston_1.default.createLogger({
    defaultMeta: { service: 'notification-service' },
    // Add a timestamp to each log message & format in JSON
    format: combine(colorize({ all: true }), timestamp(), align(), printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)),
    transports: [],
});
const logInit = ({ env = 'development', logLevel, }) => {
    // Output Logs to the Console (Unless it's Testing)
    exports.logger.add(new winston_1.default.transports.Console({
        level: logLevel,
        silent: env === 'testing',
    }));
    if (env !== 'development') {
        exports.logger.add(new winston_1.default.transports.File({
            level: logLevel,
            filename: path_1.default.join(__dirname, '../../logs/auth-service.log'),
        }));
    }
};
exports.logInit = logInit;
const logDestroy = () => {
    exports.logger.clear();
    exports.logger.close();
};
exports.logDestroy = logDestroy;
//# sourceMappingURL=logger.js.map