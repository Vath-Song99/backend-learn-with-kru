"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NodemailerSmtpServer {
    constructor() {
        this.host = process.env.SMTP_HOST;
        this.port = parseInt(process.env.SMTP_PORT, 10);
        this.user = process.env.SENDER_EMAIL;
        this.pass = process.env.SENDER_EMAIL_PASSWORD;
    }
    getConfig() {
        return {
            host: this.host,
            port: this.port,
            auth: {
                user: this.user,
                pass: this.pass,
            },
        };
    }
}
exports.default = NodemailerSmtpServer;
//# sourceMappingURL=nodemailer-smtp-server.js.map