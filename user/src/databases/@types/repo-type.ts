import { User } from "../../@types/user.type";


export interface UserRepo extends User{
    authId: string;
}