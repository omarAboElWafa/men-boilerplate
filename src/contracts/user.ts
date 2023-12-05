import {Document} from "mongoose";

export interface IUser extends Document{
    firstName: string
    lastName: string
    email: string
    username: string
    password: string,
    phone?: string,
    verified?: boolean
    qualified?: boolean
    type?: string
    gender?: string
    birthDate?: Date
    isAdmin?: boolean
    searchHistory?: string[]
    favourites?: string[],
    socialLogin?: object
}

export type UserInput<T> = Omit<T, keyof Document>;