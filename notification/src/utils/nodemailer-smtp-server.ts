import { SmtpServer, SmtpServerConfig } from './@types/email-sender.type';
import getConfig from './config';

export default class NodemailerSmtpServer implements SmtpServer {
  private host = getConfig().smtpHost;
  private port = parseInt(getConfig().smtpPort!);
  private user = getConfig().senderEmail;
  private pass = getConfig().senderEmailPassword;

  getConfig(): SmtpServerConfig {
    return {
      host: this.host as string,
      port: this.port,
      auth: {
        user: this.user as string,
        pass: this.pass as string,
      },
    };
  }
}
