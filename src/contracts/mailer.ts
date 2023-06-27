export interface IMailerService {
    sendMail(from:string, to: string, subject: string, text: string): Promise<Object>;
}