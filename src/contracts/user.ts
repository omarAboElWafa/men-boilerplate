import {Document} from "mongoose";

export interface IUser extends Document{
    firstName: string
    lastName: string
    email: string
    username: string
    password: string,
    phone: string,
    verified: boolean
}

export type NewUserInput<T> = Omit<T, keyof Document>;