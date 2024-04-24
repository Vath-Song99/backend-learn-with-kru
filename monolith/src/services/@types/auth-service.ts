import { User } from "../../@types/user.type";

export interface AuthService extends User{
}

export interface GoogleOauth extends User{
    googleId: string
    verified_email: boolean
}