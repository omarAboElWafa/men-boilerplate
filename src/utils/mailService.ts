import nodemailer from 'nodemailer';
// import sendgrid from '@sendgrid/mail';
import { IMailerService } from "../contracts/mailer";
import { EMAIL_CONFIGS } from "./config";


// sendgrid implementation
export class SendGridService implements IMailerService {
    async sendMail(to: string, subject: string, text: string): Promise<Object> {
      // SendGrid implementation
      return {};
    }
}

// nodemailer implementation
export class NodemailerService implements IMailerService {
    private transporter : nodemailer.Transporter;
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: EMAIL_CONFIGS.service,
            auth: {
                user: EMAIL_CONFIGS.user,
                pass: EMAIL_CONFIGS.pass
            }
        });
    }
    async sendMail(from:string, to: string, subject: string, text: string): Promise<Object> {
        const mailOptions = {
            from: from,
            to: to,
            subject: subject,
            html: text,
          };
        return this.transporter.sendMail(mailOptions).then((info) => {
            return info;
        }).catch((err) => {
            console.log(err);
            throw new Error('Error while sending email');
        });
    }
  }


export class MailSender {
    constructor(private mailerService: IMailerService) {}

    async sendMail(from: string, to: string, subject: string, text: string): Promise<Object> {
        return await this.mailerService.sendMail(from, to, subject, text);
    }
}