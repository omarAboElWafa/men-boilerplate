import { Error } from "mongoose";

export interface ValidationErrors {
    [key: string]: string;
}

export interface CustomError extends Error {
    code?: number;
    keyValue: object;
}