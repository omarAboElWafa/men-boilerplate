import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config';

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

export const verifyAccessToken = (req: Request, res: Response, next : NextFunction) => {
    const authHeader :string = req.headers.authorization? req.headers.authorization : '';
    if(!authHeader){
        return res.status(401).send({message: "No Access Token provided"});
    }
    const token = authHeader.split(' ')[1];
    if(!token){
        return res.status(401).send({message: "Invalid Access Token"});
    }
    try{
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const { _id } = decodedToken as { _id : string };
        req.body.userID = _id;
        next();
    }
    catch(error){
        console.log(error);
        return res.status(401).send({message: "Invalid Access Token"});
    }
}