"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const api_error_1 = __importDefault(require("../errors/api-error"));
function createConfig(configPath) {
    dotenv_1.default.config({ path: configPath });
    // Validate essential configuration
    const requiredConfig = [
        'NODE_ENV',
        'PORT',
        'CLIENT_URL',
        'LOG_LEVEL',
        'RABBITMQ_ENDPOINT',
        'SENDER_EMAIL',
        'SENDER_EMAIL_PASSWORD',
    ];
    const missingConfig = requiredConfig.filter((key) => !process.env[key]);
    if (missingConfig.length > 0) {
        throw new api_error_1.default(`Missing required environment variables: ${missingConfig.join(', ')}`);
    }
    // Return configuration object
    return {
        env: process.env.NODE_ENV,
        port: process.env.PORT,
        clientUrl: process.env.CLIENT_URL,
        logLevel: process.env.LOG_LEVEL,
        rabbitMQ: process.env.RABBITMQ_ENDPOINT,
        senderEmail: process.env.SENDER_EMAIL,
        senderEmailPassword: process.env.SENDER_EMAIL_PASSWORD,
    };
}
exports.default = createConfig;
//# sourceMappingURL=config.js.map