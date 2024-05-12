import Mail from 'nodemailer/lib/mailer';
import { EmailApi, IEmailLocals } from './@types/email-sender.type';
import nodemailer from 'nodemailer';
import path from 'path';
import { logger } from './logger';
import NodemailerSmtpServer from './nodemailer-smtp-server';
import getConfig from './config';
import Email from 'email-templates';

export default class NodemailerEmailApi implements EmailApi {
  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport(
      new NodemailerSmtpServer().getConfig()
    );
  }

  async sendEmail(
    template: string,
    receiver: string,
    locals: IEmailLocals
  ): Promise<void> {
    try {
      const email: Email = new Email({
        message: {
          from: `Learnwithkru <${getConfig().senderEmail}>`,
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
            relativeTo: path.join(__dirname, '../../build'),
          },
        },
      });

      await email.send({
        template: path.join(__dirname, '../../src/emails', template),
        message: {
          to: receiver,
        },
        locals: locals,
      });

      logger.info(`Email send successfully.`);
    } catch (error) {
      logger.error(`NotificationService SendMail() method error: ${error}`);
    }
  }
}
