import {Document} from "mongoose";

export interface IUser extends Document{
    firstName: string
    lastName: string
    email: string
    username: string
    password: string,
    phone: string,
    verified: boolean
    qualified: boolean
}

export type UserInput<T> = Omit<T, keyof Document>;