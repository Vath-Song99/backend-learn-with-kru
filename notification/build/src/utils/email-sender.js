"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_error_1 = __importDefault(require("../errors/api-error"));
// ********************************
// Singleton Pattern
// 1. A Class has only single instance
// 2. Provide a global access point to that instance
// link: https://refactoring.guru/design-patterns/singleton
// ********************************
class EmailSender {
    constructor() {
        this.isActive = false;
    }
    static getInstance() {
        if (!this.emailSenderInstance) {
            this.emailSenderInstance = new EmailSender();
        }
        return this.emailSenderInstance;
    }
    static resetEmailSenderInstance() {
        this.emailSenderInstance = new EmailSender();
    }
    activate() {
        this.isActive = true;
    }
    deactivate() {
        this.isActive = false;
    }
    setEmailApi(emailApi) {
        this.emailApi = emailApi;
    }
    sendEmail(template, receiver, locals) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateEmailSender();
            this.emailApi.sendEmail(template, receiver, locals);
        });
    }
    validateEmailSender() {
        if (!this.isActive) {
            throw new api_error_1.default('EmailSender is not active');
        }
        if (!this.emailApi) {
            throw new api_error_1.default('EmailApi is not set');
        }
    }
}
exports.default = EmailSender;
//# sourceMappingURL=email-sender.js.map