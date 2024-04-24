import { authModel } from "../models/auth.model";
import { AuthUserRepo, OauthUserRepo } from "../@types/repo-type";
import { ApiError, BaseCustomError } from "../../utils/base-custom-error";
import StatusCode from "../../utils/http-status-code";
import { Types } from "mongoose";
export class AuthRepository {
  async CreateAuthUser({
    firstname,
    lastname,
    email,
    password,
  }: AuthUserRepo) {
    try {
      const existingUser = await this.FindUserByEmail({ email });
      if (existingUser) {
        throw new BaseCustomError("Email already exists", StatusCode.FORBIDDEN);
      }
      
      const user = new authModel({
        firstname,
        lastname,
        email,
        password,
      });
      const userResult = await user.save();
      if (!user) {
        throw new ApiError("Unable to create user into Database!");
      }
      return userResult;
    } catch (error: unknown) {
      throw error;
    }
  }

  async CreateOauthUser({ firstname,
    lastname,
    email,
    password,
    googleId,
    verified_email, profile}: OauthUserRepo) {
      try{
        const existingUser = await this.FindUserByEmail({ email });
        if (existingUser) {
          throw new BaseCustomError("Email already exists", StatusCode.FORBIDDEN);
        }
        
        const user = new authModel({
          firstname,
          lastname,
          email,
          password,
          googleId: googleId,
          is_verified: verified_email,
          profile: profile
        });
        const userResult = await user.save();
        if (!user) {
          throw new ApiError("Unable to create user into Database!");
        }
        return userResult;
      }catch(error: unknown){
        throw error
      }
    }
  async FindUserByEmail({ email }: { email: string }) {
    try {
      const existingUser = await authModel.findOne({ email: email });
      return existingUser;
    } catch (error) {
      throw new BaseCustomError(
        "Unable to Find User in Database",
        StatusCode.FORBIDDEN
      );
    }
  }
  async FindUserById({ id }: { id: Types.ObjectId }) {
    try {
      const existingUser = await authModel.findById(id);
      return existingUser;
    } catch (error) {
      throw error;
    }
  }
}
