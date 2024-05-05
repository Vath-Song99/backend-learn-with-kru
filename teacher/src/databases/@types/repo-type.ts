import { User } from "../../@types/user.type";

export interface AuthUserRepo extends User{
   
}
export interface OauthUserRepo extends User{
    googleId?: string;
    facebookId?: string;
    verified_email: boolean;
    profile_picture?: string
}

export interface PaginateRepo {
    pageSize: number;
    skip: number;
}
  