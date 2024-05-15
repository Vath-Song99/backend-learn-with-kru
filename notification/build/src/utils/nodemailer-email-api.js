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
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodemailer_smtp_server_1 = __importDefault(require("./nodemailer-smtp-server"));
const email_templates_1 = __importDefault(require("email-templates"));
const server_1 = require("../server");
const path_1 = __importDefault(require("path"));
const logger_1 = require("./logger");
class NodemailerEmailApi {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport(new nodemailer_smtp_server_1.default().getConfig());
    }
    sendEmail(template, receiver, locals) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = new email_templates_1.default({
                    message: {
                        from: `Micro Sample <${(0, server_1.getConfig)().senderEmail}>`,
                    },
                    send: true,
                    preview: false,
                    transport: this.transporter,
                    views: {
                        options: {
                            extension: 'ejs',
                        },
                    },
                    juice: true, // use inline css style
                    juiceResources: {
                        preserveImportant: true,
                        webResources: {
                            relativeTo: path_1.default.join(__dirname, '../../build'),
                        },
                    },
                });
                yield email.send({
                    template: path_1.default.join(__dirname, '../../src/emails', template),
                    message: {
                        to: receiver,
                    },
                    locals: locals,
                });
                logger_1.logger.info(`Email send successfully.`);
            }
            catch (error) {
                logger_1.logger.error(`NotificationService SendMail() method error: ${error}`);
            }
        });
    }
}
exports.default = NodemailerEmailApi;
//# sourceMappingURL=nodemailer-email-api.js.map