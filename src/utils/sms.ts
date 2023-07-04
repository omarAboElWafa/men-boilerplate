import {Twilio} from 'twilio';
import {SMS_CONFIG} from './config';

export const getClient = async (sid:string, authToken: string) => {
    return await new Twilio(sid, authToken);
}

export const defaultClient = new Twilio(SMS_CONFIG.sid, SMS_CONFIG.authToken);

export const sendSMS = async (client: Twilio, phoneNumber: string, messageBody:string) => {
    try {
        const messageResponse = await client.messages.create({
            body: messageBody,
            from: SMS_CONFIG.twilioMobNumber,
            to: phoneNumber
        });
        return messageResponse;
    } catch (error) {
        console.log(error);
    }
}
