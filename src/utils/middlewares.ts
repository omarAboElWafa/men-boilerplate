import { PhoneNumberUtil, PhoneNumberFormat } from 'google-libphonenumber';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from './config';
import multer from 'multer';
import  FileUploader  from '../core/FileUploader';
import * as cache from "./cache";

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

export const checkEmail = (req:Request, res:Response, next: NextFunction) => {
    const { email } = req.body;
    const emailRegex : RegExp = /^[^\s@]+@[^\s@]+\.[^\s@.]+$/;
    if(email && !emailRegex.test(email)){
        return res.status(400).send({message: 'Invalid email'});
    }
    next();
}

export const verifyAccessToken = async (req: Request, res: Response, next : NextFunction) => {
    const authHeader :string = req.headers.authorization? req.headers.authorization : '';
    if(!authHeader){
        return res.status(401).send({message: "No Access Token provided"});
    }
    const token = authHeader.split(' ')[1];
    if(!token){
        return res.status(401).send({message: "Invalid Access Token"});
    }
    try{
        const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
        const { _id } = decodedToken as { _id : string };
        if(!_id){
            return res.status(401).send({message: "Invalid Access Token"});
        }
        // check if the access token is in redis
        const cacheTokenClient = cache.tokenClientPool;
        const cacheAccessValue = await cache.getFromCache(cacheTokenClient, `access-${_id}`);
        if(!cacheAccessValue || cacheAccessValue !== token){
            return res.status(401).send({message: "Invalid Access Token"});
        }
        req.body.userID = _id;
        next();
    }
    catch(error){
        console.log(error);
        return res.status(401).send({message: "Invalid Access Token"});
    }
}


export const verifyRefreshToken = (req: Request, res: Response, next : NextFunction) => {
    const authHeader :string = req.headers.authorization? req.headers.authorization : '';
    if(!authHeader){
        return res.status(401).send({message: "No Access Token provided"});
    }
    const refreshToken = authHeader.split(' ')[1];
    if(!refreshToken){
        return res.status(401).send({message: "Invalid Access Token"});
    }
    try{
        const decodedToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
        const { _id } = decodedToken as { _id : string };
        if(!_id){
            return res.status(401).send({message: "Invalid Refresh Token"});
        }
        req.body.userID = _id;
        req.body.clientRefreshToken = refreshToken;
        next();
    }
    catch(error){
        console.log(error);
        return res.status(401).send({message: "Invalid Refresh Token"});
    }
}

export const verifyAdminToken = async (req: Request, res: Response, next : NextFunction) => {
    const authHeader :string = req.headers.authorization? req.headers.authorization : '';
    if(!authHeader){
        return res.status(401).send({message: "No Access Token provided"});
    }
    const token = authHeader.split(' ')[1];
    if(!token){
        return res.status(401).send({message: "Invalid Access Token"});
    }
    try{
        const decodedToken = jwt.verify(token, ACCESS_TOKEN_SECRET);
        const { _id, IA } = decodedToken as { _id : string, IA: boolean };
        if(!_id){
            return res.status(401).send({message: "Invalid Access Token"});
        }
        if(!IA){
            return res.status(401).send({message: "You are not authorized to access this rout"});
        }
        console.log(_id, "id from admin token");
        req.body.userID = _id;
        req.body.isAdmin = IA;
        next();
    }
    catch(error){
        console.log(error);
        return res.status(401).send({message: "Invalid Access Token"});
    }
}

// middlewares to upload files and pass the file public path to the next middleware
export const handleUploadMulter = (req: Request, res: Response, next: NextFunction) => {
    const upload = multer({ dest: 'uploads/' }).single('file');
    upload(req, res, (err) => {
        if (err) {
            console.log(err);
            return res.status(400).send({ message: "Error uploading file" });
        }
        next();
    });
}



export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { file } = req;
        if(!file){
            return res.status(400).send({message: "Invalid file"});
        }
        const metaData = {
            'Content-Type': file.mimetype,
        };
        const fileUploader = new FileUploader();
        const fileLink = await fileUploader.uploadFile(file, metaData);
        if(!fileLink){
            return res.status(500).send({message: "Error uploading file"});
        }
        console.log(fileLink);
        req.body.translationLink = fileLink;
        next();
    } catch(err){
        console.log(err);
        return res.status(500).send({message: "Error uploading file"});
    }
}