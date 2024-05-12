import { User } from "../../@types/user.type";

export interface AuthUserRepo extends User{
   
}
export interface OauthUserRepo extends User{
    googleId?: string;
    facebookId?: string;
    verified_email: boolean;
    picture?: string
}

export interface PaginateRepo {
    pageSize: number;
    skip: number;
}

export interface UserUpdates{
    firstname?: string;
    lastname?: string;
    password?: string;
    googleId?: string;
    is_verified?: boolean;
    picture?: string;
}
  