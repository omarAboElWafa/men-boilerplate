import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';
import { Request, Response, NextFunction } from 'express';

export const checkPhone = (req:Request, res:Response, next:NextFunction) => {
    if (req.body.phone) {
        const {phone} = req.body; 
        const phoneUtil = PhoneNumberUtil.getInstance();
        if(!phone.startsWith('+')) {
            return res.status(400).send({message: 'Phone number should not start with +'});
        }
        else{
            const phoneNumber = phoneUtil.parse(phone, 'ZZ');
            const isValid = phoneUtil.isValidNumber(phoneNumber);
            if (isValid) {
                const formatted = phoneUtil.format(phoneNumber, PhoneNumberFormat.E164);
                req.body.phone = formatted;
                next();
            }
            else {
                return res.status(400).send({message: 'Invalid phone number'});
            }
        }
    }
    else{
        next();
    }
}